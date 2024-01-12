import { createRequire } from "module";

const require = createRequire(import.meta.url);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:", () => {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      db.run("INSERT INTO books (title) VALUES (?)", "title1", (err) => {
        if (err) {
          db.close();
        } else {
          db.run("SELECT undefined_column FROM books", (err, row) => {
            if (err) {
              console.log(err);
            } else {
              console.log("record id: " + row.id);
              console.log("record : " + row);
            }
            db.close();
          });
        }
      });
    },
  );
});
