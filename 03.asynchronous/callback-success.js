import { createRequire } from "module";

const require = createRequire(import.meta.url);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:", () => {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      db.run("INSERT INTO books (title) VALUES (?)", "title1", () => {
        db.each("SELECT * FROM books", (err, row) => {
          console.log("record id: " + row.id);
          console.log("record : " + row);
          db.close();
        });
      });
    },
  );
});
