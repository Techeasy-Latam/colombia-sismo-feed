// Tests for the Supabase configuration guard. When credentials are missing or
// still set to placeholders, the API must degrade gracefully instead of handing
// the browser a broken client. Pure function over process.env.

import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { isSupabaseConfigured } from '../../src/lib/env'

const URL_KEY = 'NEXT_PUBLIC_SUPABASE_URL'
const ANON_KEY = 'NEXT_PUBLIC_SUPABASE_ANON_KEY'

let savedUrl: string | undefined
let savedAnon: string | undefined

beforeEach(() => {
  savedUrl = process.env[URL_KEY]
  savedAnon = process.env[ANON_KEY]
})

afterEach(() => {
  // Restore original environment so tests stay isolated.
  if (savedUrl === undefined) delete process.env[URL_KEY]
  else process.env[URL_KEY] = savedUrl
  if (savedAnon === undefined) delete process.env[ANON_KEY]
  else process.env[ANON_KEY] = savedAnon
})

test('returns true when both URL and anon key are present and real', () => {
  process.env[URL_KEY] = 'https://abc.supabase.co'
  process.env[ANON_KEY] = 'real-anon-key'
  assert.equal(isSupabaseConfigured(), true)
})

test('returns false when the URL is missing', () => {
  delete process.env[URL_KEY]
  process.env[ANON_KEY] = 'real-anon-key'
  assert.equal(isSupabaseConfigured(), false)
})

test('returns false when the anon key is missing', () => {
  process.env[URL_KEY] = 'https://abc.supabase.co'
  delete process.env[ANON_KEY]
  assert.equal(isSupabaseConfigured(), false)
})

test('returns false when values are still placeholders', () => {
  process.env[URL_KEY] = 'https://placeholder.supabase.co'
  process.env[ANON_KEY] = 'placeholder-key'
  assert.equal(isSupabaseConfigured(), false)
})
