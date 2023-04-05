import type { LanguageData } from '../types'
import { extname } from 'node:path'
import * as LanguageJSON from '../../assets/languages.json'

export function resolveJson(uri: string): LanguageData | null {
  const Extension = extname(uri) ? extname(uri) : null
  const FileName = uri.split('/').at(-1)
  return LanguageJSON[FileName] ? { ...LanguageJSON[FileName] } : LanguageJSON[Extension] ? { ...LanguageJSON[Extension] } : null
}
