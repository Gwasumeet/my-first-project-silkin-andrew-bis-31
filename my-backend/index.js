const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users ORDER BY id DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка базы данных' });
        }
        res.json(rows);
    });
});

app.post('/api/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Необходимо передать name и email' });
    }

    db.run(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [name, email],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
                }
                return res.status(500).json({ error: 'Ошибка базы данных' });
            }
            res.status(201).json({ id: this.lastID, name, email });
        }
    );
});

app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Ошибка базы данных' });
        }
        res.status(204).send();
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});;