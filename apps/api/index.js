const express = require('express')
const app = express()
const pool = require('./db')

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        "message": "Baanto API"
    })
})

app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users;')
        res.json(result.rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ error: 'Database query failed' })
    }
})

app.get('/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        const result = await pool.query('SELECT * FROM users WHERE id = $1;', [userId])
        if (result.rows.length === 0) {
            return res.status(404).json({ "error": "User not found" })
        }
        res.json(result.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ error: 'Database query failed' })
    }
})

app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body
        if (!name || !email) {
            return res.status(400).json({ "error": "Name and email are required" })
        }
        const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *;', [name, email])
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ error: 'Database query failed' })
    }
})

app.patch('/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        const { name } = req.body
        if (!name) {
            return res.status(400).json({ "error": "Name is required to update" })
        }
        const result = await pool.query('UPDATE users SET name = $1 WHERE id = $2 RETURNING *', [name, userId])
        if (result.rows.length === 0) {
            return res.status(404).json( { "error": "User not found" })
        }
        res.json(result.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ error: 'Database query failed' })
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *;', [userId])

        if (result.rows.length === 0) {
            return res.status(404).json( { "error": "User not found" })
        }
        res.status(200).json({ "message": "User deleted successfully" })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ error: 'Database query failed' })
    }
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
    
});