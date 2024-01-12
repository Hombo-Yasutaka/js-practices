import { createRequire } from "module";

const require = createRequire(import.meta.url);
const sqlite3 = require("sqlite3").verbose();

export function newDb() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(":memory:", (err) => {
      if (err) reject(err);
      else resolve(db);
    });
  });
}

export function createDb(db, sql_create_table) {
  return new Promise((resolve, reject) => {
    db.run(sql_create_table, (err) => {
      if (err) reject(err);
      else resolve(db);
    });
  });
}

export function insertDb(db, inserted_data) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO books (title) VALUES (?)", inserted_data, (err) => {
      if (err) reject(err);
      else resolve(db);
    });
  });
}

export function selectDb(db, sql_select_data) {
  return new Promise((resolve, reject) => {
    db.each(sql_select_data, (err, row) => {
      if (err) reject(err);
      else {
        console.log("record title:", row.title);
        resolve(db);
      }
    });
  });
}

export function closeDb(db) {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
