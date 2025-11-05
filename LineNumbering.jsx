var doc = app.activeDocument;
var s = app.selection[0];

// Script needs a range of text to be selected
if (s && (s.constructor.name === "Text" || s.constructor.name === "Paragraph" || s.constructor.name === "TextColumn")) {
    app.doScript(numberLines, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "Number Lines");
} else {
    alert("Bitte einen Textbereich (mind. eine Zeile) markieren.");
}

function numberLines(){
    var prevUnits = app.scriptPreferences.measurementUnit;
    app.scriptPreferences.measurementUnit = MeasurementUnits.POINTS;

    try {
        if (!doc.isValid) throw new Error("Dokument ungültig.");
        if (!s || !s.isValid) throw new Error("Auswahl ungültig.");

        // Absatzformat holen/erstellen
        var nStyle = makeParaStyle(doc, "LineNumbers");
        if (!nStyle || !nStyle.isValid) throw new Error("Absatzformat konnte nicht erstellt werden.");

        // Font und Größe ermitteln (mit Fallback)
        var baseFont = null;
        var baseFontSize = 9; // Fallback
        var baseFontStyle = null;

        try {
            if (s.lines && s.lines.length > 0 && s.lines[0].isValid) {
                baseFont = s.lines[0].appliedFont;
                baseFontSize = s.lines[0].pointSize || 9;
                baseFontStyle = s.lines[0].fontStyle;
            } else if (s.appliedFont) {
                baseFont = s.appliedFont;
                baseFontSize = s.pointSize || 9;
                baseFontStyle = s.fontStyle;
            }
        } catch(_) {}
        if (!baseFont) baseFont = app.fonts.length ? app.fonts[0] : null;

        // Versuche Light-Schriftschnitt zu finden
        var lightFontStyle = findLightFontStyle(baseFont, baseFontStyle);

        // Stil konfigurieren mit der gleichen Schriftgröße wie der Haupttext
        nStyle.properties = {
            pointSize: baseFontSize,
            justification: Justification.RIGHT_ALIGN,
            fillColor: doc.swatches.item("Black"),
            fillTint: 50  // 50% Deckkraft für subtile Erscheinung
        };

        if (baseFont && baseFont.isValid) {
            try {
                nStyle.appliedFont = baseFont;
                // Wenn Light-Schriftschnitt gefunden, verwenden
                if (lightFontStyle) {
                    nStyle.fontStyle = lightFontStyle;
                    nStyle.fillTint = 100;  // Bei Light-Schnitt volle Deckkraft
                }
            } catch(_) {}
        }

        // Alte LineNo-Rahmen entfernen
        var nl = "LineNo";
        var ntf = doc.textFrames.everyItem().getElements();
        for (var n = 0; n < ntf.length; n++){
            if (ntf[n].isValid && ntf[n].label === nl) {
                try { ntf[n].remove(); } catch(_) {}
            }
        }

        // Zeilen sammeln
        var ln = (s.lines && s.lines.length) ? s.lines.everyItem().getElements() : [];
        if (!ln || ln.length === 0) throw new Error("Keine Zeilen in der Auswahl gefunden.");

        // Nummern setzen (nur jede 5. Zeile)
        for (var i = 0; i < ln.length; i++){
            var line = ln[i];
            if (!line || !line.isValid) continue;

            // Nur jede 5. Zeile nummerieren (5, 10, 15, ...)
            var lineNumber = i + 1;
            if (lineNumber % 5 !== 0) continue;

            // Für jede Zeile die spezifische Seite ermitteln
            var lineParentTextFrame = null;
            try {
                if (line.parentTextFrames && line.parentTextFrames.length > 0) {
                    lineParentTextFrame = line.parentTextFrames[0];
                }
            } catch(_) { continue; }

            if (!lineParentTextFrame || !lineParentTextFrame.isValid) continue;

            // Seite dieser spezifischen Zeile ermitteln
            var linePage = null;
            try {
                linePage = lineParentTextFrame.parentPage;
            } catch(_) {}

            // Fallback: Spread versuchen
            if (!linePage || !linePage.isValid) {
                try {
                    var parentObj = lineParentTextFrame.parent;
                    if (parentObj && parentObj.isValid) {
                        var parentType = "" + parentObj.constructor.name;
                        if (parentType.match(/Spread|MasterSpread/)) {
                            linePage = parentObj;
                        } else if (parentType === "Page") {
                            linePage = parentObj;
                        }
                    }
                } catch(_) {}
            }

            if (!linePage || !linePage.isValid) continue;

            // Koordinaten für diese Zeile in Pasteboard-Koordinaten
            var x2 = line.horizontalOffset - 10; // 10 pt links der Zeile
            var y2 = line.baseline;
            var gb = [y2 - 20, x2 - 20, y2, x2]; // [top,left,bottom,right]

            var nf = null;
            // Versuche Textrahmen auf der korrekten Seite zu erstellen
            try {
                nf = linePage.textFrames.add({
                    label: nl,
                    geometricBounds: gb,
                    contents: lineNumber.toString(),
                    textFramePreferences: { verticalJustification: VerticalJustification.BOTTOM_ALIGN }
                });
            } catch(e1) {
                // Bei Fehler diese Zeile überspringen
                continue;
            }

            if (nf && nf.isValid) {
                try { nf.texts[0].appliedParagraphStyle = nStyle; } catch(_) {}
            }
        }

    } finally {
        // Einheiten zurücksetzen
        app.scriptPreferences.measurementUnit = prevUnits;
    }
}


// Absatzformat-Helfer
function makeParaStyle(d, n){
    var it = d.paragraphStyles.itemByName(n);
    if (it.isValid) return it;
    return d.paragraphStyles.add({ name: n });
}

// Suche Light-Schriftschnitt in der Font-Familie
function findLightFontStyle(font, currentStyle){
    if (!font || !font.isValid) return null;

    try {
        var styles = font.fontStyleName;
        var availableStyles = [];

        // Sammle verfügbare Schriftschnitte
        var fontFamily = font.fontFamily;
        var allFonts = app.fonts.everyItem().getElements();

        for (var i = 0; i < allFonts.length; i++) {
            if (allFonts[i].fontFamily === fontFamily) {
                var styleName = allFonts[i].fontStyleName;
                availableStyles.push(styleName);
            }
        }

        // Suche nach Light-Varianten (typische Bezeichnungen)
        var lightPatterns = ["Light", "Thin", "Hairline", "UltraLight", "ExtraLight"];

        for (var j = 0; j < lightPatterns.length; j++) {
            for (var k = 0; k < availableStyles.length; k++) {
                var style = availableStyles[k];
                // Case-insensitive Suche
                if (style.toLowerCase().indexOf(lightPatterns[j].toLowerCase()) >= 0) {
                    return style;
                }
            }
        }
    } catch(_) {}

    return null;  // Kein Light-Schnitt gefunden
}
