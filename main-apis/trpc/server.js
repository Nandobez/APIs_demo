/**
 * tRPC — typed RPC for TypeScript codebases.
 *
 * No codegen: the client imports the server's router *type* directly and
 * gets end-to-end autocomplete + type safety. JSON over HTTP under the
 * hood; the magic is at the type level.
 */
import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { Store } from "../_shared/store.js";

const t = initTRPC.create();
const router = t.router({
  list:   t.procedure.query(() => Store.list()),
  get:    t.procedure.input((v) => Number(v)).query(({ input }) => Store.get(input)),
  create: t.procedure.input((v) => String(v)).mutation(({ input }) => Store.create(input)),
  update: t.procedure
    .input((v) => v)
    .mutation(({ input }) => Store.update(input.id, input)),
  remove: t.procedure
    .input((v) => Number(v))
    .mutation(({ input }) => Store.remove(input)),
});

// In a TypeScript project you would re-export `typeof router` so the client
// can `import type { AppRouter } from './server'` and get full inference.

const PORT = process.env.PORT || 4006;
createHTTPServer({ router }).listen(PORT);
console.log(`[trpc]    listening on http://localhost:${PORT}`);
