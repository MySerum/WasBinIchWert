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
Gehaltsentwicklung und Gehaltsverhandlung. Visuelle Vergleichstests kontrollieren
diese drei Kernbereiche zusätzlich auf Desktop-, iPhone- und Android-Abmessungen.
Nach der einmaligen Installation laufen alle Prüfungen vollständig gegen die lokalen
App-Dateien.

Der aktuelle Funktionsstand steht im [Änderungsprotokoll](CHANGELOG.md). Vor einer
stabilen Veröffentlichung wird die [Freigabe-Checkliste](RELEASE-CHECKLIST.md)
durchlaufen.

Die in der App enthaltene Drittanbieter-Software und die zugehörigen
Lizenzhinweise sind in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)
dokumentiert.

## Lizenz

Der eigenentwickelte Code und die eigenen Inhalte von WasBinIchWert sind
proprietär und unterliegen der Regelung in [LICENSE](LICENSE). Alle Rechte sind
vorbehalten. Für Drittanbieter-Komponenten gelten unabhängig davon deren
jeweilige Open-Source-Lizenzen.

Beabsichtigte Layoutänderungen können mit neuen Referenzbildern bestätigt werden:

```bash
npm run test:ui -- --update-snapshots
```
