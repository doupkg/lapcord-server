/* eslint @typescript-eslint/no-var-requires: 0 */
const { tmpdir } = require('node:os')
const { join } = require('node:path')
const { unlink } = require('node:fs/promises')
const { existsSync } = require('node:fs')

;(async () => {
  const lockFile = join(tmpdir(), 'discord-rpc.lock')
  if (!existsSync(lockFile)) return
  unlink(lockFile)
})()
