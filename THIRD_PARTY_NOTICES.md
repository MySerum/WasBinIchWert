# Hinweise zu Drittanbieter-Software

WasBinIchWert enthält die nachfolgend aufgeführten Open-Source-Komponenten.
Sie dürfen auch in kommerzieller Software verwendet werden. Die jeweiligen
Urheberrechts- und Lizenzhinweise bleiben erhalten.

## In der ausgelieferten App enthalten

| Komponente | Version | Lizenz | Projekt |
| --- | --- | --- | --- |
| lohnsteuerrechner | 1.0.7 | MIT | <https://github.com/canida-software/lohnsteuer> |
| decimal.js | 10.6.0 | MIT | <https://github.com/MikeMcl/decimal.js> |
| pdf-lib | 1.17.1 | MIT | <https://github.com/Hopding/pdf-lib> |
| @pdf-lib/standard-fonts | 1.0.0 | MIT | <https://github.com/Hopding/standard-fonts> |
| @pdf-lib/upng | 1.0.1 | MIT | <https://github.com/Hopding/upng> |
| pako | 1.0.11 | MIT und Zlib | <https://github.com/nodeca/pako> |
| tslib | 1.14.1 | 0BSD | <https://github.com/microsoft/tslib> |

`lohnsteuerrechner` implementiert den offiziellen Programmablaufplan (PAP)
des Bundesministeriums der Finanzen. Die Bibliothek selbst steht unter der
unten wiedergegebenen MIT-Lizenz.

## Nur für Entwicklung und Tests verwendet

Diese Werkzeuge werden nicht als Bestandteil der Web-App an Nutzer
ausgeliefert:

| Komponente | Version | Lizenz | Projekt |
| --- | --- | --- | --- |
| Playwright und @playwright/test | 1.55.0 | Apache-2.0 | <https://github.com/microsoft/playwright> |
| esbuild | 0.25.0 | MIT | <https://github.com/evanw/esbuild> |

## MIT-Lizenz

Die folgenden Copyright-Vermerke gehören zu Komponenten, die unter der
MIT-Lizenz stehen:

- Copyright (c) 2026 Canida Software (`lohnsteuerrechner`)
- Copyright (c) 2025 Michael Mclaughlin (`decimal.js`)
- Copyright (c) 2019 Andrew Dillon (`pdf-lib`)
- Copyright (c) 2018 Andrew Dillon (`@pdf-lib/standard-fonts`)
- Copyright (c) 2017 Photopea (`@pdf-lib/upng`)
- Copyright (c) 2014-2017 Vitaly Puzrin and Andrei Tuputcyn (`pako`)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Zlib-Lizenz

Teile von `pako` basieren auf zlib.

Copyright (C) 1995-2013 Jean-loup Gailly and Mark Adler

This software is provided 'as-is', without any express or implied warranty.
In no event will the authors be held liable for any damages arising from the
use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

1. The origin of this software must not be misrepresented; you must not claim
   that you wrote the original software. If you use this software in a
   product, an acknowledgment in the product documentation would be
   appreciated but is not required.
2. Altered source versions must be plainly marked as such, and must not be
   misrepresented as being the original software.
3. This notice may not be removed or altered from any source distribution.

## 0BSD-Lizenz

Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.

## Pflegehinweis

Diese Datei bildet die in `package-lock.json` festgeschriebenen Versionen ab.
Bei Änderungen an Laufzeit-Abhängigkeiten oder neu übernommenen Medien ist sie
vor einer Veröffentlichung zu aktualisieren.
