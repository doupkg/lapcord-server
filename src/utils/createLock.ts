import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { LockFile } from '../config'

export async function createLock() {
  if (existsSync(LockFile)) return false
  await writeFile(LockFile, process.pid.toString())
  return true
}
