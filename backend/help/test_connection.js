const db = require('./config/db');

async function testConnection() {
    try {
        console.log("正在测试数据库连接...");

        const result = await db.query('SELECT 1;');

        console.log("✅ 数据库连接成功:", result.rows);
    } catch (err) {
        console.error("❌ 连接错误:", err.message);
    }
}

testConnection();
