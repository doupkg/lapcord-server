#! /usr/bin/env node
import { createConnection } from "./utils/lsp-connection";

createConnection()
  .listen()
