import { ProposedFeatures, TextDocuments, createConnection as createLSP } from 'vscode-languageserver/node'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { Server } from './lsp-server'

export function createConnection() {
  const connection = createLSP(ProposedFeatures.all)
  const documents = new TextDocuments(TextDocument)
  const server = new Server(connection)

  connection.onInitialize((x) => server.onInitialize(x))
  connection.onInitialized(() => server.onInitialized(documents))

  connection.onShutdown(() => server.onShutdown())
  connection.onExit(() => server.onExit())

  return { connection, documents }
}
