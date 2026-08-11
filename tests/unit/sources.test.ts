// Tests for the keyword pre-filter — the first, zero-cost line of defense in the
// ingest pipeline. Every news item must clear this gate before any LLM token is
// spent, so a regression here either leaks noise to the model or silently drops
// relevant news. Pure function, no I/O.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { preFiltroPasa, KEYWORDS_REQUERIDOS } from '../../src/lib/sources'

test('passes when a required keyword appears in the title', () => {
  assert.equal(preFiltroPasa('Terremoto sacude Colombia', ''), true)
})

test('passes when the keyword appears only in the description', () => {
  assert.equal(preFiltroPasa('Última hora', 'Fuerte sismo en Chocó'), true)
})

test('is case-insensitive', () => {
  assert.equal(preFiltroPasa('EARTHQUAKE HITS COLOMBIA', ''), true)
})

test('matches English keywords for international sources', () => {
  assert.equal(preFiltroPasa('Rescue teams search the rubble', ''), true)
})

test('the "colombia" keyword matches the Spanish adjectives "colombiano"/"colombiana" as a substring', () => {
  // Unlike the old Venezuela list (stem "venezuel" did NOT match "venezolano",
  // spelled with an "o"), "colombia" is a plain substring of "colombiano" and
  // "colombiana", so no separate adjective entry is needed for this to pass.
  assert.equal(preFiltroPasa('El gabinete colombiano se reúne hoy', ''), true)
})

test('matches a department name even without a seismic term', () => {
  assert.equal(preFiltroPasa('Autoridades de Risaralda coordinan la respuesta', ''), true)
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
