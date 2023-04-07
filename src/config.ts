import { join } from 'node:path'
import { tmpdir } from 'node:os'

export const LockFile = join(tmpdir(), 'discord-rpc.lock')
export const ClientId = '1084261309677318154'
