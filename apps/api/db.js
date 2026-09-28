const { Pool } = require('pg')
const pool = new Pool({
    user: 'akshatpatil',
    host: 'localhost',
    database: 'baanto',
    port: 5432,

});
module.exports= pool;