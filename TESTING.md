# Testing Guide - LineNumbering.jsx

## Testszenarien

### Test 1: Grundfunktion - Einfacher Text

**Setup:**
1. Neues InDesign-Dokument erstellen
2. Textrahmen mit mindestens 20 Zeilen Text einfügen
3. Schriftart: Arial Regular, 12pt

**Schritte:**
1. Gesamten Text markieren
2. Skript ausführen

**Erwartetes Ergebnis:**
- Zeilennummern 5, 10, 15, 20 erscheinen
- Nummern sind 12pt groß (wie der Text)
- Nummern sind bei 50% Deckkraft (da Arial keinen Light-Schnitt hat)
- Rechtsbündige Ausrichtung
- 10pt links vom Text

---

### Test 2: Light-Schriftschnitt

**Setup:**
1. Neues Dokument
2. Textrahmen mit 15 Zeilen
3. Schriftart mit Light-Schnitt: z.B. "Helvetica Neue Light", 11pt

**Schritte:**
1. Text markieren
2. Skript ausführen

**Erwartetes Ergebnis:**
- Zeilennummern 5, 10, 15 erscheinen
- Nummern verwenden Helvetica Neue Light (gleicher Schnitt)
- Nummern sind 11pt groß
- Volle Deckkraft (100%), nicht 50%

---

### Test 3: Gemischte Schriftgrößen

**Setup:**
1. Textrahmen mit 10 Zeilen
2. Erste 5 Zeilen: 12pt
3. Letzte 5 Zeilen: 14pt

**Schritte:**
1. Gesamten Text markieren
2. Skript ausführen

**Erwartetes Ergebnis:**
- Nummern 5, 10 erscheinen
- Alle Nummern in 12pt (Größe der ersten Zeile)
- **Hinweis:** Bei gemischten Größen immer die erste Zeile als Referenz

---

### Test 4: Mehrfachausführung

**Setup:**
1. Textrahmen mit 20 Zeilen
2. Skript bereits einmal ausgeführt

**Schritte:**
1. Text erneut markieren
2. Skript nochmals ausführen

**Erwartetes Ergebnis:**
- Alte Zeilennummern werden entfernt
- Neue Zeilennummern werden erstellt
- Keine Duplikate
- Position bleibt konsistent

---

### Test 5: Verschiedene Schriftarten

**Zu testende Schriften:**

| Schriftart | Light-Schnitt verfügbar? | Erwartete Deckkraft |
|-----------|-------------------------|-------------------|
| Arial | Nein | 50% |
| Helvetica Neue | Ja (Light) | 100% |
| Futura | Ja (Light) | 100% |
| Garamond Premier Pro | Ja (Light) | 100% |
| Times New Roman | Nein | 50% |
| Avenir | Ja (Light) | 100% |

**Schritte für jede Schrift:**
1. Text mit Schriftart formatieren
2. Skript ausführen
3. Ergebnis überprüfen

---

### Test 6: Unterschiedliche Zeilenanzahlen

**Szenarien:**

| Zeilenanzahl | Erwartete Nummern |
|-------------|------------------|
| 1-4 Zeilen | Keine Nummern (keine 5. Zeile) |
| 5 Zeilen | Nur "5" |
| 7 Zeilen | Nur "5" |
| 10 Zeilen | "5", "10" |
| 13 Zeilen | "5", "10" |
| 50 Zeilen | "5", "10", "15", ... "50" |

---

### Test 7: Edge Cases

#### Test 7a: Sehr kurzer Text
- **Setup:** Nur 3 Zeilen
- **Erwartung:** Keine Nummern (keine erreicht 5)

#### Test 7b: Sehr langer Text
- **Setup:** 100+ Zeilen
- **Erwartung:** Nummern bis 100 (5, 10, 15... 100)
- **Performance:** Sollte < 5 Sekunden dauern

#### Test 7c: Kein Text markiert
- **Setup:** Nur Cursor im Text, keine Markierung
- **Erwartung:** Fehlermeldung "Bitte einen Textbereich (mind. eine Zeile) markieren."

#### Test 7d: Leerer Textrahmen
- **Setup:** Textrahmen ohne Inhalt markiert
- **Erwartung:** Fehlermeldung

---

### Test 8: Verschiedene Dokumentstrukturen

#### Test 8a: Mehrspaltiger Text
- **Setup:** Textrahmen mit 2 Spalten, je 10 Zeilen
- **Test:** Erste Spalte markieren
- **Erwartung:** Nummern nur für erste Spalte

#### Test 8b: Verkettete Textrahmen
- **Setup:** 2 verkettete Textrahmen mit je 5 Zeilen
- **Test:** Alle Zeilen markieren
- **Erwartung:** Nummern 5, 10

#### Test 8c: Tabellen
- **Setup:** Text in Tabellenzellen
- **Test:** Tabellentext markieren
- **Erwartung:** Kann fehlschlagen (Tabellen sind keine Standard-Textrahmen)

---

### Test 9: Positionierung und Alignment

**Prüfpunkte:**
1. Nummern sind exakt 10pt links vom Textrahmen
2. Baseline der Nummern stimmt mit Baseline der Zeilen überein
3. Nummern sind rechtsbündig
4. Vertikale Ausrichtung: Bottom-Align im Textrahmen

**Messung:**
- Verwenden Sie InDesign-Lineale und Hilfslinien
- Prüfen Sie mit Info-Panel (F8)

---

### Test 10: Absatzformat "LineNumbers"

**Nach Skript-Ausführung prüfen:**

1. **Absatzformate-Panel öffnen** (F11)
2. **"LineNumbers" Format finden**
3. **Eigenschaften prüfen:**
   - Schriftart: Entspricht Haupttext
   - Schriftschnitt: Light (wenn verfügbar)
   - Punktgröße: Entspricht Haupttext
   - Ausrichtung: Rechtsbündig
   - Farbe: Schwarz
   - Deckkraft: 50% oder 100%

---

## Automatisiertes Testing

### JavaScript-Konsolen-Tests

Fügen Sie am Ende des Skripts folgende Debug-Ausgaben ein:

```javascript
// Debug: Am Ende der numberLines() Funktion
$.writeln("=== LineNumbering Debug ===");
$.writeln("Base Font: " + baseFont.fontFamily);
$.writeln("Base Font Size: " + baseFontSize);
$.writeln("Light Font Style Found: " + (lightFontStyle || "None"));
$.writeln("Total Lines: " + ln.length);
$.writeln("Numbers Created: " + Math.floor(ln.length / 5));
```

**Konsole öffnen:**
- ExtendScript Toolkit (bei älteren InDesign-Versionen)
- Oder: VS Code mit InDesign-Erweiterung

---

## Performance-Tests

### Benchmark verschiedene Textlängen:

| Zeilen | Erwartete Zeit |
|--------|---------------|
| 10 | < 1 Sekunde |
| 50 | < 2 Sekunden |
| 100 | < 3 Sekunden |
| 500 | < 10 Sekunden |
| 1000 | < 20 Sekunden |

**Messung:**
Fügen Sie Timer in das Skript ein:

```javascript
var startTime = new Date();
// ... Skript-Code ...
var endTime = new Date();
var duration = (endTime - startTime) / 1000;
alert("Ausführungszeit: " + duration + " Sekunden");
```

---

## Visuelle Qualitätsprüfung

### Checkliste für professionelle Erscheinung:

- [ ] Nummern sind deutlich aber unaufdringlich
- [ ] Baseline-Ausrichtung ist perfekt
- [ ] Keine überlappenden Elemente
- [ ] Konsistente Abstände
- [ ] Lesbarkeit bei 100% Ansicht
- [ ] Lesbarkeit bei 50% Ansicht
- [ ] Druckvorschau prüfen

### Vergleich mit professionellen Dokumenten:

Laden Sie ein professionelles Dokument mit Zeilennummern (z.B. juristische Schriftsätze) und vergleichen Sie:
- Deckkraft/Schriftgewicht
- Positionierung
- Schriftgröße
- Nummerierungsintervall

---

## Fehlerbehandlung testen

### Test: Ungültige Dokumentzustände

1. **Kein aktives Dokument:**
   - Alle Dokumente schließen
   - Skript ausführen
   - **Erwartung:** Fehlermeldung

2. **Gesperrte Ebene:**
   - Text auf gesperrter Ebene
   - **Erwartung:** Nummern können nicht erstellt werden

3. **Ausgeblendete Ebene:**
   - Text auf ausgeblendeter Ebene
   - **Erwartung:** Skript sollte funktionieren, Nummern sind sichtbar

---

## Regressionstests

Nach Änderungen am Skript alle Tests wiederholen:

1. ✓ Test 1: Grundfunktion
2. ✓ Test 2: Light-Schriftschnitt
3. ✓ Test 5: Verschiedene Schriftarten
4. ✓ Test 7: Edge Cases
5. ✓ Test 9: Positionierung

---

## Testprotokoll-Vorlage

```
Datum: __________
InDesign Version: __________
Betriebssystem: __________

Test 1: Grundfunktion
[ ] Bestanden [ ] Fehlgeschlagen
Notizen: _______________________________

Test 2: Light-Schriftschnitt
[ ] Bestanden [ ] Fehlgeschlagen
Notizen: _______________________________

[... weitere Tests ...]

Gesamtergebnis:
[ ] Alle Tests bestanden
[ ] Fehler gefunden (Details siehe Notizen)
```

---

## Bekannte Limitationen

1. **Tabellen:** Funktioniert nicht zuverlässig in Tabellenzellen
2. **Pfadtext:** Nicht unterstützt
3. **Verankerte Textrahmen:** Kann zu Positionierungsproblemen führen
4. **Masterseiten:** Eingeschränkte Funktionalität

---

## Reporting von Bugs

Bei gefundenen Fehlern bitte folgende Informationen angeben:

1. InDesign-Version
2. Betriebssystem
3. Verwendete Schriftart
4. Dokumentstruktur
5. Erwartetes vs. tatsächliches Verhalten
6. Screenshots
7. Schritte zur Reproduktion

**Issue erstellen:** https://github.com/Medientyp/InDesign-Zeilennummerierung/issues
