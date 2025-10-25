/**
 * JSON-RPC 2.0 over HTTP.
 *
 * Single endpoint, ``{"jsonrpc":"2.0","method":"…","params":{…},"id":N}``.
 * Wallets, blockchain nodes, IDE language servers all use this.
 */
import jayson from "jayson";
import { Store } from "../_shared/store.js";

const methods = {
  list:   (_args, cb) => cb(null, Store.list()),
  get:    ({ id }, cb) => cb(null, Store.get(id)),
  create: ({ title }, cb) => cb(null, Store.create(title)),
  update: ({ id, ...patch }, cb) => cb(null, Store.update(id, patch)),
  remove: ({ id }, cb) => { Store.remove(id); cb(null, true); },
};

const PORT = process.env.PORT || 4005;
jayson.server(methods).http().listen(PORT, () =>
  console.log(`[jsonrpc] listening on http://localhost:${PORT}`));
