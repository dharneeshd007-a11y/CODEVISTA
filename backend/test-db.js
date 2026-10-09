const mysql = require('mysql2/promise');

async function testDb() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '12345',
      database: 'infopilot_ai'
    });
    console.log('Connected to infopilot_ai!');
    const [rows, fields] = await connection.execute('SHOW TABLES;');
    console.log('Tables:', rows);
    
    const [cols] = await connection.execute('DESCRIBE documents;');
    console.log('Documents columns:', cols);
    
    await connection.end();
  } catch (err) {
    console.error('Error:', err);
  }
}
testDb();
