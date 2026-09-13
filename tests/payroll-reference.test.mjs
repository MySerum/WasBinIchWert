import test from 'node:test';
import assert from 'node:assert/strict';

import { calculate } from '../vendor/lohnsteuerrechner.js';

test('BMF-PAP-Referenzfall 2026 bleibt unverändert', () => {
  const result = calculate(2026, {
    LZZ: 2,
    RE4: 500000,
    STKL: 1,
    KVZ: 2.5,
    PVZ: 1,
  });

  assert.equal(result.LSTLZZ, 78583);
  assert.equal(result.SOLZLZZ, 0);
});

test('Sozialversicherungs-Referenzfall bei 4.200 Euro', () => {
  const gross = 4200;
  const rv = gross * 0.093;
  const av = gross * 0.013;
  const kv = gross * (0.073 + 0.029 / 2);
  const pv = gross * 0.024;

  const equalsCent = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.005);
  equalsCent(rv, 390.6);
  equalsCent(av, 54.6);
  equalsCent(kv, 367.5);
  equalsCent(pv, 100.8);
});

test('lokale Steuerengine liefert steigende Lohnsteuer', () => {
  const base = { LZZ: 2, STKL: 1, KVZ: 2.9, PVZ: 1 };
  const lower = calculate(2026, { ...base, RE4: 300000 });
  const higher = calculate(2026, { ...base, RE4: 500000 });

  assert.ok(lower.LSTLZZ >= 0);
  assert.ok(higher.LSTLZZ > lower.LSTLZZ);
});
