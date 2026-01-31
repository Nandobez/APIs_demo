/**
 * RSocket TCP server — exposes a `todos` route as a request-stream.
 * Uses the official ``rsocket-core`` + ``rsocket-tcp-server`` packages.
 *
 * Note: rsocket-js APIs vary by version — install matching versions:
 *   npm i rsocket-core rsocket-tcp-server
 */
import { RSocketServer } from "rsocket-core";
import TcpServerTransport from "rsocket-tcp-server";
import { Store } from "../../../main-apis/_shared/store.js";

const server = new RSocketServer({
  transport: new TcpServerTransport({ host: "0.0.0.0", port: 4040 }),
  acceptor: () => ({
    requestStream: () => ({
      subscribe: (subscriber) => {
        let cancelled = false;
        let seq = 0;
        const tick = () => {
          if (cancelled) return;
          subscriber.onNext({
            data: JSON.stringify({ seq: ++seq, ts: Date.now(), todos: Store.list().length }),
            metadata: "",
          });
          setTimeout(tick, 500);
        };
        tick();
        return { cancel: () => (cancelled = true) };
      },
    }),
  }),
});
server.start();
console.log("[rsocket] tcp listening on 4040");
