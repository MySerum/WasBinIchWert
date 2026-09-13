import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = await readFile(path.join(root, 'app.js'), 'utf8');
const html = await readFile(path.join(root, 'index.html'), 'utf8');

test('Steuerklassen I bis VI sind in Oberfläche und Berechnung vollständig', () => {
  for (const taxClass of ['I', 'II', 'III', 'IV', 'V', 'VI']) {
    assert.match(html, new RegExp(`<option>${taxClass}</option>`));
  }
  assert.match(app, /stklMap=\{I:1,II:2,III:3,IV:4,V:5,VI:6\}/);
});

test('kritische Steuerparameter werden gegen negative Eingaben abgesichert', () => {
  assert.match(app, /ZKF:Math\.max\(0,/);
  assert.match(app, /KVZ:[^}]*Math\.max\(0,/);
  assert.match(app, /PKPV:[^}]*Math\.max\(0,/);
  assert.match(app, /PKPVAGZ:[^}]*Math\.max\(0,/);
});

test('Pflegeversicherung berücksichtigt Kinder und Sachsen', () => {
  assert.match(app, /PVS:\$\('state'\)\.value==='Sachsen'\?1:0/);
  assert.match(app, /PVA:kids>=2\?Math\.min\(kids-1,4\):0/);
  assert.match(app, /Math\.max\(\.008,r\)/);
});

test('produktive Steuer- und PDF-Imports bleiben lokal', async () => {
  const loader = await readFile(path.join(root, 'pdf-lib-loader.js'), 'utf8');
  assert.doesNotMatch(app, /from ["']https?:\/\//);
  assert.match(app, /from ["']\.\/vendor\/lohnsteuerrechner\.js["']/);
  assert.match(loader, /\.\/vendor\/pdf-lib\.min\.js/);
});
