
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'naprendszer',
    port: 3307
});


app.get('/api/bolygok', async (req, res) => {
    try {
        const [rows] = await (await db).query(`
            SELECT bolygok.*, bolygo_tipusok.tipus_neve
            FROM bolygok
            LEFT JOIN bolygo_tipusok
            ON bolygok.tipus_id = bolygo_tipusok.tipus_id
            ORDER BY bolygok.bolygo_id
        `);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Adatbázis hiba!' });
    }
});


app.delete('/api/torles/:id', async (req, res) => {
    try {
        const [result] = await (await db).query(
            'DELETE FROM bolygok WHERE bolygo_id = ?',
            [req.params.id]
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Adatbázis hiba!' });
    }
});


app.post('/api/ujbolygo', async (req, res) => {
    try {
        const [result] = await (await db).query(`
            INSERT INTO bolygok
            (neve, tipus_id, tomeg, egyenlitori_sugar, holdak_szama,
            nap_tavolsag, fold_tavolsag, leiras, url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            req.body.neve,
            req.body.tipus_id,
            req.body.tomeg,
            req.body.egyenlitori_sugar,
            req.body.holdak_szama,
            req.body.nap_tavolsag,
            req.body.fold_tavolsag,
            req.body.leiras,
            req.body.url
        ]);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Adatbázis hiba!' });
    }
});


app.get('/api/tipusok', async (req, res) => {
    try {
        const [rows] = await (await db).query(`
            SELECT tipus_id, tipus_neve
            FROM bolygo_tipusok
            ORDER BY tipus_id
        `);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Adatbázis hiba!' });
    }
});


app.listen(3000, () => {
    console.log('Szerver fut: http://localhost:3000');
});
