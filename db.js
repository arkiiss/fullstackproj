const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'portfolio_project',
    password: 'dk311005',
    port: '5432',
});
module.exports = pool;