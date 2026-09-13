# WasBinIchWert

## Entwicklung

Einmalig Abhängigkeiten und den Chromium-Testbrowser installieren:

```bash
npm ci
npx playwright install chromium
```

Danach werden alle Referenz-, Offline- und UI-Tests mit folgendem Befehl ausgeführt:

```bash
npm test
```

Die Tests prüfen die lokale Steuerengine, die Sozialversicherungs-Referenzwerte,
die Vollständigkeit des Offline-Caches sowie die Browserabläufe für Rechner,
Gehaltsentwicklung und Gehaltsverhandlung. Nach der einmaligen Installation laufen
sie vollständig gegen die lokalen App-Dateien.
