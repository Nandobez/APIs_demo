/**
 * REST (HTTP/1.1 + JSON).
 *
 * The most common API style. Resource per URL, verb per HTTP method.
 * No schema, no codegen — just JSON over plain HTTP. Cache-friendly because
 * `GET` semantics are well understood by every proxy.
 */
import express from "express";
import { Store } from "../_shared/store.js";

const app = express();
app.use(express.json());

app.get("/todos", (_req, res) => res.json(Store.list()));
app.get("/todos/:id", (req, res) => {
  const t = Store.get(req.params.id);
  return t ? res.json(t) : res.status(404).end();
});
app.post("/todos", (req, res) => res.status(201).json(Store.create(req.body?.title ?? "")));
app.patch("/todos/:id", (req, res) => {
  const t = Store.update(req.params.id, req.body);
  return t ? res.json(t) : res.status(404).end();
});
app.delete("/todos/:id", (req, res) => {
  Store.remove(req.params.id);
  res.status(204).end();
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`[rest]    listening on http://localhost:${PORT}`));
