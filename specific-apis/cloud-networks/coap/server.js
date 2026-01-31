/**
 * CoAP — Constrained Application Protocol (RFC 7252).
 *
 * REST-like API over UDP, designed for low-power IoT (6LoWPAN, Thread,
 * Sigfox). Tiny 4-byte headers + DTLS for security. Verbs and response
 * codes mirror HTTP intentionally.
 */
import coap from "coap";
import { Store } from "../../../main-apis/_shared/store.js";

const server = coap.createServer();

server.on("request", (req, res) => {
  const [, resource, idStr] = req.url.split("/");
  const id = idStr && Number(idStr);
  if (resource !== "todos") return res.code = "4.04", res.end();

  switch (req.method) {
    case "GET":
      if (id) {
        const t = Store.get(id);
        if (!t) return (res.code = "4.04"), res.end();
        return res.end(JSON.stringify(t));
      }
      return res.end(JSON.stringify(Store.list()));
    case "POST": {
      const body = req.payload?.toString() || "{}";
      const { title } = JSON.parse(body);
      res.code = "2.01";
      return res.end(JSON.stringify(Store.create(title)));
    }
    case "DELETE":
      Store.remove(id);
      res.code = "2.02";
      return res.end();
    default:
      res.code = "4.05";
      res.end();
  }
});

const PORT = Number(process.env.PORT) || 5683;
server.listen(PORT, () => console.log(`[coap]    listening on coap://localhost:${PORT}`));
