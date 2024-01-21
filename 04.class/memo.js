import { createRequire } from "module";

const require = createRequire(import.meta.url);
const sqlite3 = require("sqlite3").verbose();
const readline = require("readline");
const { Select } = require("enquirer");

class Db {
  db;
  constructor() {
    this.newDb();
    this.createTable();
    this.records = [];
  }
  async newDb() {
    return await new Promise((resolve, reject) => {
      this.db = new sqlite3.Database("memo.db", (err) => {
        if (err) reject(err);
        else resolve(this.db);
      });
    });
  }
  async createTable() {
    // execute only at once
    return await new Promise((resolve, reject) => {
      this.db.run(
        "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)",
        (err) => {
          if (err) reject(err);
          else resolve(this.db);
        }
      );
    });
  }
  insertIntoTable(content) {
    return new Promise((resolve, reject) => {
      this.db.run("INSERT INTO memos (content) VALUES (?)", content, (err) => {
        if (err) reject(err);
        else resolve(this.db);
      });
    });
  }
  getAllRecords() {
    const query = "SELECT * FROM memos";
    return new Promise((resolve, reject) => {
      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          this.records = rows;
          resolve(this.db);
        }
      });
    });
  }
  deleteRecords(id) {
    const query = "DELETE FROM memos WHERE id = ?";
    return new Promise((resolve, reject) => {
      this.db.run(query, [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

class Memo extends Db {
  content;
  constructor(content) {
    super();
    this.content = content;
  }
  insertIntoDb() {
    this.insertIntoTable(this.content);
  }
}

async function executeMemoCli() {
  const memo = await new Memo();
  const argv = require("minimist")(process.argv.slice(2));

  if (process.stdin.isTTY) {
    // not exist standard input
    await memo.getAllRecords();
    const memoList = memo.records.map((record) => ({
      name: record.id.toString(),
      message: record.content.split("\n")[0],
      value: record.content,
    }));
    if (argv["l"]) {
      memo.records.forEach((record) => {
        console.log(record.content.split("\n")[0]);
      });
    } else if (argv["r"]) {
      const prompt = new Select({
        name: "selectedMemo",
        message: "Select a memo:",
        choices: memoList,
      });
      prompt
        .run()
        .then((selectedMemo) => {
          const targetMemo = memo.records.find(
            (record) => record.id.toString() === selectedMemo
          );
          console.log(targetMemo.content);
        })
        .catch((err) => console.error(err))
        .finally(() => {
          memo.db.close();
        });
    } else if (argv["d"]) {
      const prompt = new Select({
        name: "deletedMemo",
        message: "Select a memo you want to delete:",
        choices: memoList,
      });
      prompt
        .run()
        .then((selectedMemo) => {
          memo.deleteRecords(selectedMemo);
          console.log("delete completed");
        })
        .catch((err) => console.error(err))
        .finally(() => {
          memo.db.close();
        });
    } else {
      console.log("set arguments");
    }
  } else {
    // exist standard input
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    let input = "";

    rl.on("line", (line) => {
      input += line + "\n";
    });

    rl.on("close", () => {
      memo.content = input;
      memo.insertIntoDb();
    });
  }
}

executeMemoCli();
