const pool = require('./db')

async function testConnection() {
    try {
        const res = await pool.query('SELECT * FROM users;')
        console.log(res.rows);
    } catch (err) {
        console.error('Error executing query', err.stack)
    } finally {
        await pool.end()
    }
}
testConnection()