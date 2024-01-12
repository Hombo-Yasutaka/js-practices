import { newDb, createDb, insertDb, selectDb, closeDb } from "./db-promises.js";

async function operateDb() {
  try {
    const db = await newDb();
    await createDb(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );
    await insertDb(db, "data1");
    await selectDb(db, "SELECT id, title, content FROM books");
    await closeDb(db);
  } catch (err) {
    console.log(err);
  }
}

operateDb();
