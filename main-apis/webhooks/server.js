/**
 * Webhooks — server-initiated HTTP POST callbacks.
 *
 * Clients *register* a callback URL; whenever a Todo changes, the server
 * fires a POST at every registered URL with the new state. Async by design,
 * one-way (no response needed beyond 2xx).
 *
 * A demo "subscriber" is also bundled — it listens on /receive and prints
 * the body so you can verify deliveries from one terminal.
 */
import express from "express";
import { Store } from "../_shared/store.js";

const app = express();
app.use(express.json());

const subscribers = new Set();

app.post("/subscribe", (req, res) => {
  const url = req.body?.url;
  if (!url) return res.status(400).json({ error: "url required" });
  subscribers.add(url);
  return res.status(201).json({ subscribers: [...subscribers] });
});
app.post("/unsubscribe", (req, res) => {
  subscribers.delete(req.body?.url);
  return res.json({ subscribers: [...subscribers] });
});
app.get("/subscribers", (_req, res) => res.json([...subscribers]));

// CRUD operations also fire webhooks.
function fire(event, payload) {
  for (const url of subscribers) {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Event": event },
      body: JSON.stringify(payload),
    }).catch(() => subscribers.delete(url));
  }
}

app.post("/todos", (req, res) => {
  const t = Store.create(req.body?.title ?? "");
  fire("todo.created", t);
  res.status(201).json(t);
});

// Demo subscriber endpoint
app.post("/receive", (req, res) => {
  console.log("[webhook recv]", req.header("X-Event"), JSON.stringify(req.body));
  res.status(204).end();
});

const PORT = process.env.PORT || 4008;
app.listen(PORT, () =>
  console.log(`[webhooks] listening on http://localhost:${PORT}`));
