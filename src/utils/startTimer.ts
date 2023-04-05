import type { TextDocument } from 'vscode-languageserver-textdocument'
import { existsSync } from 'node:fs'
import { unlink } from 'node:fs/promises'
import { setActivity } from './setActivity'
import { LockFile } from '../config'
import { Documents } from '../server'

let timerId: NodeJS.Timeout | null = null

export function startTimer(document: TextDocument, time?: number) {
  if (timerId) clearTimeout(timerId)
  timerId = setTimeout(async () => {
    if (Documents.get(document.uri)) setActivity('idle')
    if (existsSync(LockFile)) unlink(LockFile)
  }, time || 10000)
}
