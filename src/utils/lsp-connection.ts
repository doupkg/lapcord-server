import { ProposedFeatures, TextDocuments, createConnection as createLSP } from 'vscode-languageserver/node'
import { Server } from './lsp-server'
import { TextDocument } from 'vscode-languageserver-textdocument'

export function createConnection() {
  const connection = createLSP(ProposedFeatures.all)
  const documents = new TextDocuments(TextDocument)
  const server = new Server(connection)

  connection.onInitialize(() => server.onInitialize(documents))
  connection.onInitialized(() => server.onInitialized())

  documents.onDidChangeContent((x) => server.onDidChangeContent(x.document))
  documents.onWillSave((x) => server.onWillSave(x.document))

  connection.onShutdown(() => server.onShutdown())
  connection.onExit(() => server.onExit())

  return connection
}
