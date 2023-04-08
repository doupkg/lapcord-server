import type { WorkDoneProgressServerReporter } from 'vscode-languageserver'
import { Client } from '@xhayper/discord-rpc'
/* import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { LockFile } from '#src/config' */
import { Connection } from '../server'
import { ClientID } from '../config'
import { setActivity } from './index'

export let workDoneProgress: WorkDoneProgressServerReporter
export let rpcConection = false
export const Ninth = new Client({
  clientId: ClientID,
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
    workDoneProgress.report(Ninth.user?.tag)
    setActivity('idle')
  })

  return Ninth.login()
}

/* async function createLock() {
  if (existsSync(LockFile)) return false
  await writeFile(LockFile, process.pid.toString())
  return true
} */
