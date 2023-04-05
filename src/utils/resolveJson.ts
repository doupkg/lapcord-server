import type { TextDocument } from 'vscode-languageserver-textdocument'
import { LanguageData } from '../types'
import { extname } from 'node:path'
import * as LanguageJSON from '../../assets/languages.json'

export function resolveJson(document: TextDocument): LanguageData {
  const Extension = extname(document?.uri) ? extname(document.uri) : null
  const FileName = document?.uri.split('/').at(-1)
  return LanguageJSON[FileName] ? { ...LanguageJSON[FileName] } : LanguageJSON[Extension] ? { ...LanguageJSON[Extension] } : null
}
