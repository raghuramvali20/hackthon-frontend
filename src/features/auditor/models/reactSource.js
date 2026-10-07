export const MAX_REACT_SOURCE_BYTES = 100 * 1024
export const MAX_REACT_SOURCE_CHARACTERS = 100_000

export function getReactFileValidationError(file) {
  if (!file || typeof file.name !== 'string') {
    return 'Choose one .jsx or .tsx source file.'
  }
  if (!/\.(jsx|tsx)$/i.test(file.name)) {
    return 'Choose a file with a .jsx or .tsx extension.'
  }
  if (!Number.isFinite(file.size) || file.size < 0 || file.size > MAX_REACT_SOURCE_BYTES) {
    return 'This source file is larger than the 100 KB limit.'
  }
  return ''
}

export function getReactContentValidationError(source) {
  if (typeof source !== 'string' || !source.trim()) {
    return 'React source is empty. Paste source or choose a file.'
  }
  if (source.length > MAX_REACT_SOURCE_CHARACTERS) {
    return 'React source exceeds the 100,000 character limit.'
  }
  if (new TextEncoder().encode(source).length > MAX_REACT_SOURCE_BYTES) {
    return 'React source exceeds the 100 KB limit.'
  }
  return ''
}
