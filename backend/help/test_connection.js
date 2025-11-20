require('dotenv').config();
const db = require('./config/database');

async function testConnection() {
    try {
        console.log('正在测试数据库连接...');
        const success = await db.testConnection();

        if (success) {
            console.log('✅ 连接成功！');
            process.exit(0);
        } else {
            console.log('❌ 连接失败！');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ 连接错误:', error);
        process.exit(1);
    }
}

testConnection();