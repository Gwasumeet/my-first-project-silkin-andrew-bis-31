const db = new sqlite3.Database(path.join(__dirname, 'mydb.sqlite'), (err) => {
 if (err) {
 console.error('Ошибка подключения к БД:', err.message);
 } else {
 console.log('Подключено к SQLite базе данных.');
 // Создаём таблицу users, если она не существует
 db.run(`
 CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 email TEXT UNIQUE NOT NULL
 )
 `, (err) => {
 if (err) {
 console.error('Ошибка создания таблицы:', err.message);
 } else {
 console.log('Таблица users готова.');
 }
 });
 }
});
module.exports = db;