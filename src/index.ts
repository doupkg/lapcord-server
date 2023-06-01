import { createConnection } from './utils/lsp-connection'

const { connection, documents } = createConnection()

documents.listen(connection)
connection.listen()
