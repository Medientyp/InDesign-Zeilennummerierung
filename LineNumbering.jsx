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

        // Font ermitteln (mit Fallback)
        var baseFont = null;
        try {
            if (s.lines && s.lines.length > 0 && s.lines[0].isValid) {
                baseFont = s.lines[0].appliedFont;
            } else if (s.appliedFont) {
                baseFont = s.appliedFont;
            }
        } catch(_) {}
        if (!baseFont) baseFont = app.fonts.length ? app.fonts[0] : null;

        // Stil konfigurieren (ohne appliedFont, wenn keiner sicher ist)
        nStyle.properties = {
            pointSize: 9,
            justification: Justification.RIGHT_ALIGN
        };
        if (baseFont && baseFont.isValid) {
            try { nStyle.appliedFont = baseFont; } catch(_) {}
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

        // Primären Textframe & Zielcontainer ermitteln
        var container = (s.parentTextFrames && s.parentTextFrames.length) ? s.parentTextFrames[0] : null;
        if (!container || !container.isValid) throw new Error("Kein gültiger übergeordneter Textframe.");

        var targetContainer = container.parentPage;
        if (!targetContainer || !targetContainer.isValid) {
            // Spread/MasterSpread als Alternative
            var parentObj = container.parent;
            if (parentObj && parentObj.isValid && (""+parentObj.constructor.name).match(/Spread|MasterSpread|Page/)) {
                targetContainer = parentObj;
            }
        }
        // Letzter Fallback: erste Seite
        if (!targetContainer || !targetContainer.isValid) {
            if (doc.pages.length === 0) throw new Error("Dokument hat keine Seiten.");
            targetContainer = doc.pages[0];
        }

        // Nummern setzen
        for (var i = 0; i < ln.length; i++){
            var line = ln[i];
            if (!line || !line.isValid) continue;

            var x2 = line.horizontalOffset - 10; // 10 pt links der Zeile
            var y2 = line.baseline;
            var gb = [y2 - 20, x2 - 20, y2, x2]; // [top,left,bottom,right]

            var nf = null;
            // Primär versuchen: im ermittelten Container
            try {
                nf = targetContainer.textFrames.add({
                    label: nl,
                    geometricBounds: gb,
                    contents: (i+1).toString(),
                    textFramePreferences: { verticalJustification: VerticalJustification.BOTTOM_ALIGN }
                });
            } catch(e1) {
                // Fallback: auf Seite 1 (falls Container z. B. kein Page-/Spread-Objekt war)
                try {
                    nf = doc.pages[0].textFrames.add({
                        label: nl,
                        geometricBounds: gb,
                        contents: (i+1).toString(),
                        textFramePreferences: { verticalJustification: VerticalJustification.BOTTOM_ALIGN }
                    });
                } catch(e2) {
                    // Diese Zeile überspringen, wenn sogar der Fallback scheitert
                    continue;
                }
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
