const Database = require('better-sqlite3');
const db = new Database(':memory:');

db.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    studios TEXT NOT NULL,
    producers TEXT NOT NULL,
    winner INTEGER ,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);


db.exec(`
  CREATE TABLE IF NOT EXISTS movies_producers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    studios TEXT NOT NULL,
    producers TEXT NOT NULL,
    winner INTEGER ,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS producers_multi_winners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL,
    producers TEXT NOT NULL,
    previousWin INTEGER,
    followingWin INTEGER,
    interval INTEGER,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('Ambiente - Banco Conectado sql lite.');

module.exports = db;