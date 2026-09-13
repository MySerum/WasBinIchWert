import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const worker = await readFile(path.join(root, 'service-worker.js'), 'utf8');

test('v8.46 verwendet einen neuen Offline-Cache', () => {
  assert.match(worker, /const CACHE='wasbinichwert-pages-v846';/);
});

function stringArray(name) {
  const match = worker.match(new RegExp(`const ${name}=(\\[[^;]+\\]);`));
  assert.ok(match, `${name} fehlt im Service Worker`);
  return [...match[1].matchAll(/'([^']+)'/g)].map(item => item[1]);
}

const local = stringArray('LOCAL');
const modules = stringArray('MODULES');

test('alle Offline-Dateien existieren im Repository', async () => {
  for (const entry of local) {
    const relative = entry === './' ? 'index.html' : entry.replace(/^\.\//, '');
    await access(path.join(root, relative), constants.R_OK);
  }
});

test('alle Laufzeitmodule sind offline vorgemerkt', () => {
  for (const module of modules) assert.ok(local.includes(module), `${module} fehlt in LOCAL`);
});

test('Steuer- und PDF-Module werden lokal ausgeliefert', async () => {
  assert.ok(local.includes('./vendor/lohnsteuerrechner.js'));
  assert.ok(local.includes('./vendor/pdf-lib.min.js'));

  const app = await readFile(path.join(root, 'app.js'), 'utf8');
  const loader = await readFile(path.join(root, 'pdf-lib-loader.js'), 'utf8');
  assert.match(app, /from ["']\.\/vendor\/lohnsteuerrechner\.js["']/);
  assert.match(loader, /\.\/vendor\/pdf-lib\.min\.js/);
});

test('v8.45-UI-Modul bleibt Bestandteil des Offline-Bundles', () => {
  assert.ok(local.includes('./ui-consistency.js'));
  assert.ok(modules.includes('./ui-consistency.js'));
});
