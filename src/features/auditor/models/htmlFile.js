export const MAX_HTML_FILE_BYTES = 100 * 1024
export const MAX_HTML_CHARACTERS = 100_000

export function getHtmlFileValidationError(file) {
  if (!file || typeof file.name !== 'string') {
    return 'Choose one HTML file to continue.'
  }

  if (!/\.(html|htm)$/i.test(file.name)) {
    return 'Choose a file with an .html or .htm extension.'
  }

  if (!Number.isFinite(file.size) || file.size < 0 || file.size > MAX_HTML_FILE_BYTES) {
    return 'This file is larger than the 100 KB limit. Choose a smaller HTML file.'
  }

  return ''
}

export function getHtmlContentValidationError(contents) {
  if (typeof contents !== 'string' || !contents.trim()) {
    return 'This file is empty. Choose an HTML file with page content.'
  }

  if (contents.length > MAX_HTML_CHARACTERS) {
    return 'This file contains more than 100,000 characters. Choose a smaller HTML file.'
  }

  return ''
}
