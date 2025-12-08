const db = require('../config/db');

async function testQuery() {
  try {
    const [rows] = await db.query('SELECT VERSION() as version');
    
    console.log('Version query result:', rows[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);

    process.exit(1);
  }
}

testQuery();

