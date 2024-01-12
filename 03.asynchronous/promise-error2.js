import { newDb, createDb, insertDb, selectDb, closeDb } from "./db-promises.js";

newDb()
  .then((db) =>
    createDb(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    ),
  )
  .then((db1) => insertDb(db1, "data1"))
  .then((db2) => selectDb(db2, "SELECT id, title, content FROM books"))
  .then((db3) => closeDb(db3))
  .catch((err) => console.error(err));
