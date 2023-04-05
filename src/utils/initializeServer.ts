import type { WorkDoneProgressServerReporter } from 'vscode-languageserver'
import { Client } from '@xhayper/discord-rpc'
import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { LockFile } from '../config'
import { Connection } from '../server'
import { setActivity } from './setActivity'

export let workDoneProgress: WorkDoneProgressServerReporter
export let rpcConection = false
export const Ninth = new Client({
  clientId: '1084261309677318154',
  transport: {
    type: 'ipc'
  }
})

export async function initializeServer() {
  workDoneProgress = await Connection.window.createWorkDoneProgress()
  workDoneProgress.begin('Discord Presence', 0, 'Connecting...')

  /* const lock = await createLock()
  if (!lock) return workDoneProgress.report('Already connected!') */

  Ninth.on('connected', () => {
    rpcConection = true
    workDoneProgress.report(Ninth.user?.tag as string)
    setActivity('idle')
  })

  return Ninth.login()
}

/* async function createLock() {
  if (existsSync(LockFile)) return false
  await writeFile(LockFile, process.pid.toString())
  return true
} */
