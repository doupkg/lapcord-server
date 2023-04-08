import { join } from 'node:path'
import { tmpdir } from 'node:os'

export const LockFile = join(tmpdir(), 'discord-rpc.lock')
export const ClientID = '1093947322708262992'
