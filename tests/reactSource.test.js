import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getReactContentValidationError,
  getReactFileValidationError,
  MAX_REACT_SOURCE_BYTES,
  MAX_REACT_SOURCE_CHARACTERS,
} from '../src/features/auditor/models/reactSource.js'

test('accepts JSX and TSX source files within the source limit', () => {
  assert.equal(getReactFileValidationError({ name: 'Card.jsx', size: 40 }), '')
  assert.equal(getReactFileValidationError({ name: 'Card.TSX', size: MAX_REACT_SOURCE_BYTES }), '')
})

test('rejects unsupported, oversized, empty, and over-limit source', () => {
  assert.match(getReactFileValidationError({ name: 'page.html', size: 10 }), /\.jsx or .tsx/)
  assert.match(getReactFileValidationError({
    name: 'Card.tsx',
    size: MAX_REACT_SOURCE_BYTES + 1,
  }), /100 KB/)
  assert.match(getReactContentValidationError(' '), /empty/)
  assert.match(getReactContentValidationError('x'.repeat(MAX_REACT_SOURCE_CHARACTERS + 1)), /100,000/)
  assert.match(getReactContentValidationError('é'.repeat(60_000)), /100 KB/)
})
