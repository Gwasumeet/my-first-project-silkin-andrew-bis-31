const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'mydb.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
    } else {
        console.log('Успешное подключение к базе данных SQLite.');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        )
    `);
});

module.exports = db;