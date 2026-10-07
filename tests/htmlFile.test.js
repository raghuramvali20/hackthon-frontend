import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getHtmlContentValidationError,
  getHtmlFileValidationError,
  MAX_HTML_CHARACTERS,
  MAX_HTML_FILE_BYTES,
} from '../src/features/auditor/models/htmlFile.js'

test('accepts .html and .htm files within the upload limit', () => {
  assert.equal(getHtmlFileValidationError({ name: 'page.html', size: 128 }), '')
  assert.equal(getHtmlFileValidationError({ name: 'PAGE.HTM', size: MAX_HTML_FILE_BYTES }), '')
})

test('rejects missing, unsupported, and oversized files with useful errors', () => {
  assert.match(getHtmlFileValidationError(null), /Choose one HTML file/)
  assert.match(getHtmlFileValidationError({ name: 'page.txt', size: 20 }), /\.html or .htm/)
  assert.match(getHtmlFileValidationError({
    name: 'page.html',
    size: MAX_HTML_FILE_BYTES + 1,
  }), /100 KB limit/)
})

test('validates decoded HTML content against the scan limits', () => {
  assert.equal(getHtmlContentValidationError('<!doctype html>'), '')
  assert.match(getHtmlContentValidationError('  '), /file is empty/)
  assert.match(getHtmlContentValidationError('x'.repeat(MAX_HTML_CHARACTERS + 1)), /100,000 characters/)
})
