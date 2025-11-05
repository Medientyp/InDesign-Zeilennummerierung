# InDesign Zeilennummerierung - Ausführliche Anleitung

## Übersicht

Dieses Skript fügt professionelle Zeilennummern zu markierten Textbereichen in Adobe InDesign hinzu. Die Implementierung folgt typografischen Best Practices für akademische und juristische Dokumente.

## Typografische Konzepte

### Warum Zeilennummern in 5er-Schritten?

In professionellen Dokumenten (z.B. juristische Texte, wissenschaftliche Editionen, Poesie) werden Zeilen üblicherweise in 5er-Schritten nummeriert (5, 10, 15, 20...). Dies bietet:
- Bessere Lesbarkeit (weniger visuelle Ablenkung)
- Ausreichende Referenzierungsgenauigkeit
- Reduzierter Platzbedarf im Seitenrand

### Visuelle Separierung

Das Skript verwendet zwei Methoden zur visuellen Trennung von Haupttext und Zeilennummern:

**1. Light-Schriftschnitt (bevorzugt)**
- Automatische Erkennung von Light/Thin/Hairline-Schnitten
- Volle Deckkraft (100%) bei dünnerem Schriftschnitt
- Elegante, professionelle Erscheinung

**2. Reduzierte Deckkraft (Fallback)**
- 50% Deckkraft wenn kein Light-Schnitt verfügbar
- Funktioniert mit jeder Schriftart
- Subtile, unaufdringliche Darstellung

### Schriftgrößen-Synchronisierung

Die Zeilennummern übernehmen automatisch die exakte Punktgröße des Haupttextes. Dies gewährleistet:
- Korrekte Baseline-Ausrichtung
- Konsistente vertikale Rhythmik
- Professionelles Erscheinungsbild

## Installation

### Schritt 1: Skripte-Panel öffnen
1. In InDesign: **Fenster** → **Hilfsprogramme** → **Skripte**
2. Das Skripte-Panel wird angezeigt

### Schritt 2: Skript-Ordner finden
1. Im Skripte-Panel: Rechtsklick auf **"Benutzer"**
2. **"Im Explorer/Finder anzeigen"** wählen
3. Der Scripts-Panel-Ordner öffnet sich

### Schritt 3: Skript installieren
1. `LineNumbering.jsx` in diesen Ordner kopieren
2. Zurück zu InDesign
3. Im Skripte-Panel: Rechtsklick auf **"Benutzer"** → **"Aktualisieren"**
4. Das Skript sollte nun sichtbar sein

## Verwendung

### Grundlegende Anwendung

1. **Text markieren**
   - Mindestens eine vollständige Textzeile markieren
   - Funktioniert mit ganzen Absätzen oder Textrahmen

2. **Skript ausführen**
   - Im Skripte-Panel: Doppelklick auf **"LineNumbering"**
   - Oder: Rechtsklick → **"Ausführen"**

3. **Ergebnis**
   - Zeilennummern erscheinen links neben dem Text
   - Nur jede 5. Zeile wird nummeriert (5, 10, 15...)
   - Nummern sind rechtsbündig ausgerichtet

### Erweiterte Optionen

**Alte Nummerierung entfernen:**
Das Skript entfernt automatisch alle vorherigen Zeilennummern (erkannt am Label "LineNo") und erstellt neue.

**Mehrfachausführung:**
Sie können das Skript beliebig oft ausführen. Es überschreibt immer die vorherigen Zeilennummern.

## Technische Details

### Absatzformat "LineNumbers"

Das Skript erstellt automatisch ein Absatzformat mit folgenden Eigenschaften:

- **Name:** LineNumbers
- **Schriftart:** Übernommen vom markierten Text
- **Schriftschnitt:** Light/Thin (wenn verfügbar)
- **Punktgröße:** Identisch zum Haupttext
- **Ausrichtung:** Rechtsbündig
- **Farbe:** Schwarz
- **Deckkraft:** 50% (nur wenn kein Light-Schnitt verfügbar)

### Positionierung

- **Horizontal:** 10 Punkte links vom Textrand
- **Vertikal:** Baseline-Ausrichtung mit der jeweiligen Textzeile
- **Container:** Auf der gleichen Seite/Spread wie der Haupttext

### Light-Schriftschnitt-Erkennung

Das Skript sucht automatisch nach folgenden Schriftschnitten (case-insensitive):
- Light
- Thin
- Hairline
- UltraLight
- ExtraLight

**Beispiele:**
- "Helvetica Light"
- "Arial Thin"
- "Futura Light Oblique"
- "Garamond Premier Pro Light"

## Fehlerbehebung

### "Bitte einen Textbereich (mind. eine Zeile) markieren"

**Problem:** Nichts oder nur ein Cursor ist markiert

**Lösung:** Markieren Sie mindestens eine vollständige Zeile Text

### Zeilennummern erscheinen nicht

**Mögliche Ursachen:**
1. **Textrahmen außerhalb der Seite:** Prüfen Sie, ob der Textrahmen vollständig auf der Seite liegt
2. **Gesperrte Ebene:** Entsperren Sie die Ebene des Textrahmens
3. **Masterseite:** Bei Texten auf Masterseiten kann es zu Problemen kommen

### Zeilennummern haben falsche Schriftgröße

**Problem:** Schriftgröße entspricht nicht dem Haupttext

**Lösung:**
- Stellen Sie sicher, dass der markierte Text eine einheitliche Schriftgröße hat
- Das Skript liest die Größe der ersten Zeile aus
- Bei gemischten Größen: Erste Zeile einzeln markieren und formatieren

### Light-Schriftschnitt wird nicht verwendet

**Problem:** Trotz verfügbarem Light-Schnitt wird 50% Deckkraft verwendet

**Mögliche Ursache:**
- Schriftschnitt-Benennung entspricht nicht den Standard-Mustern
- Font ist beschädigt oder nicht korrekt installiert

**Lösung:**
- Prüfen Sie die exakte Benennung des Schriftschnitts
- Kontaktieren Sie mich für Erweiterung der Suchmuster

## Anpassungen

### Nummerierungsintervall ändern

Aktuell: Jede 5. Zeile

**Zeile 81 ändern von:**
```javascript
if (lineNumber % 5 !== 0) continue;
```

**Für jede 10. Zeile:**
```javascript
if (lineNumber % 10 !== 0) continue;
```

**Für jede Zeile:**
```javascript
// Zeile einfach auskommentieren oder löschen
```

### Deckkraft anpassen

Aktuell: 50%

**Zeile 49 ändern von:**
```javascript
fillTint: 50  // 50% Deckkraft
```

**Für 40% Deckkraft:**
```javascript
fillTint: 40  // 40% Deckkraft
```

### Horizontalen Abstand ändern

Aktuell: 10 Punkte links vom Text

**Zeile 97 ändern von:**
```javascript
var x2 = line.horizontalOffset - 10;
```

**Für 15 Punkte:**
```javascript
var x2 = line.horizontalOffset - 15;
```

## Best Practices

### Typografische Empfehlungen

1. **Satzspiegel beachten:** Stellen Sie sicher, dass der linke Rand genügend Platz für Zeilennummern bietet (mindestens 20-30 Punkte)

2. **Einheitliche Zeilenhöhe:** Für saubere Ausrichtung sollten alle Zeilen die gleiche Zeilenhöhe haben

3. **Absatzformate:** Verwenden Sie Absatzformate mit fester Zeilenhöhe (z.B. genau 24pt bei 12pt Schrift)

4. **Schriftfamilie:** Verwenden Sie Schriftfamilien mit verfügbaren Light-Schnitten für beste Ergebnisse:
   - Helvetica/Helvetica Neue
   - Futura
   - Avenir
   - Garamond Premier Pro
   - Adobe Caslon Pro

### Workflow-Tipps

1. **Erst formatieren, dann nummerieren:** Finalisieren Sie die Textformatierung bevor Sie Zeilennummern hinzufügen

2. **Master-Absatzformate:** Nutzen Sie Absatzformate für konsistente Formatierung

3. **Ebenen nutzen:** Erwägen Sie, Zeilennummern auf eine separate Ebene zu legen für einfacheres Ein-/Ausblenden

## Technischer Support

Bei Fragen oder Problemen:
- GitHub Issues: https://github.com/Medientyp/InDesign-Zeilennummerierung/issues
- Beschreiben Sie das Problem mit Screenshots und InDesign-Version

## Kompatibilität

- **Getestet mit:** Adobe InDesign CC 2019-2024
- **Mindestanforderung:** InDesign CS6
- **Betriebssystem:** macOS und Windows

## Lizenz

MIT License - Frei für private und kommerzielle Nutzung
