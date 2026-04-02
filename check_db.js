const mysql = require('mysql2/promise');

async function check() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root'
        });
        const [dbs] = await connection.query('SHOW DATABASES');
        console.log(dbs);
        await connection.end();
    } catch (err) {
        console.error('CONNECTION ERROR:', err.message);
    }
}

check();
