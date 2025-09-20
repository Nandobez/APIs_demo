/**
 * Shared in-memory Todo store used by every MainAPI implementation so that
 * comparisons are like-for-like: the data model and operations are the same
 * (list, get, create, update, delete) and only the wire protocol differs.
 */
let _id = 0;
const todos = new Map();

const create = (title) => {
  const t = { id: ++_id, title, done: false, createdAt: Date.now() };
  todos.set(t.id, t);
  return t;
};

create("buy duck food");
create("write protocol comparison");
create("ship MultiProtocolAPIs");

export const Store = {
  list: () => Array.from(todos.values()),
  get: (id) => todos.get(Number(id)) ?? null,
  create: (title) => create(title),
  update: (id, patch) => {
    const t = todos.get(Number(id));
    if (!t) return null;
    Object.assign(t, patch, { id: t.id });
    return t;
  },
  remove: (id) => todos.delete(Number(id)),
};
