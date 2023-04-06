import { spawn } from 'node:child_process'

spawn('node', ['dist/server.js', '--stdio'])

// I don't known about unit tests
