// Tests for the keyword pre-filter — the first, zero-cost line of defense in the
// ingest pipeline. Every news item must clear this gate before any LLM token is
// spent, so a regression here either leaks noise to the model or silently drops
// relevant news. Pure function, no I/O.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { preFiltroPasa, KEYWORDS_REQUERIDOS } from '../../src/lib/sources'

test('passes when a required keyword appears in the title', () => {
  assert.equal(preFiltroPasa('Terremoto sacude Venezuela', ''), true)
})

test('passes when the keyword appears only in the description', () => {
  assert.equal(preFiltroPasa('Última hora', 'Fuerte sismo en Carabobo'), true)
})

test('is case-insensitive', () => {
  assert.equal(preFiltroPasa('EARTHQUAKE HITS VENEZUELA', ''), true)
})

test('matches English keywords for international sources', () => {
  assert.equal(preFiltroPasa('Rescue teams search the rubble', ''), true)
})

test('stem "venezuel" matches the English adjective "Venezuelan"', () => {
  assert.equal(preFiltroPasa('Venezuelan government declares emergency', ''), true)
})

test('KNOWN GAP: the Spanish adjective "venezolano" alone does NOT pass the filter', () => {
  // "venezolano" is spelled with an "o" (venez-O-lano), so it does not contain
  // the "venezuel" stem nor any other required keyword. A news item mentioning
  // only "gobierno venezolano" — without "Venezuela" or a seismic term — is
  // silently dropped before reaching the model. This asserts current behavior;
  // if the keyword list is extended to cover "venezolan", update this test.
  assert.equal(preFiltroPasa('El gabinete venezolano se reúne hoy', ''), false)
})

test('rejects when no required keyword is present', () => {
  assert.equal(preFiltroPasa('Resultados de la liga de fútbol', 'Goles del fin de semana'), false)
})

test('rejects empty input', () => {
  assert.equal(preFiltroPasa('', ''), false)
})

test('every keyword is lowercase (the filter lowercases input before matching)', () => {
  // If a keyword had uppercase, it could never match because the haystack is
  // lowercased first. This guards the invariant the matcher relies on.
  for (const kw of KEYWORDS_REQUERIDOS) {
    assert.equal(kw, kw.toLowerCase(), `keyword "${kw}" must be lowercase`)
  }
})
