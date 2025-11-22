/**
 * Connect (by Buf) — gRPC-compatible API that also speaks plain HTTP/1.1
 * + JSON, so the browser can hit it without a proxy.
 *
 * This file is a *stub*: the real Connect server uses generated TS handlers
 * derived from the same `.proto` we use for gRPC. The on-the-wire format is
 * either Protobuf (binary) or JSON depending on the ``Content-Type``.
 *
 * For a working reference clone https://github.com/connectrpc/connect-es
 * and follow its quick-start. The point of this stub is to show the
 * minimum HTTP surface and explain why it exists.
 */
import express from "express";
import { Store } from "../_shared/store.js";

const app = express();
app.use(express.json());

// Connect serves RPCs at /<package>.<Service>/<Method>
app.post("/todo.TodoService/List", (_req, res) => res.json({ items: Store.list() }));
app.post("/todo.TodoService/Get", (req, res) => {
  const t = Store.get(req.body?.id);
  return t ? res.json(t) : res.status(404).json({ code: "not_found" });
});
app.post("/todo.TodoService/Create", (req, res) =>
  res.json(Store.create(req.body?.title ?? "")));
app.post("/todo.TodoService/Update", (req, res) =>
  res.json(Store.update(req.body?.id, req.body)));
app.post("/todo.TodoService/Delete", (req, res) => {
  Store.remove(req.body?.id);
  res.json({});
});

const PORT = process.env.PORT || 4007;
app.listen(PORT, () =>
  console.log(`[connect] listening on http://localhost:${PORT} (gRPC-compatible JSON only)`));
