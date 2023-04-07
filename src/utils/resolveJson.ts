import type { TextDocument } from 'vscode-languageserver-textdocument'
import { extname } from 'node:path'
import { LanguageData } from '../types'
import * as LanguageJSON from '../langs/languages.json'

export function resolveJson(document: TextDocument): LanguageData {
  const Extension = extname(document.uri) ? extname(document.uri).toLocaleLowerCase() : null
  const FileName = document.uri.split('/').at(-1)
  return LanguageJSON[FileName] ? { ...LanguageJSON[FileName] } : LanguageJSON[Extension] ? { ...LanguageJSON[Extension] } : null
}
