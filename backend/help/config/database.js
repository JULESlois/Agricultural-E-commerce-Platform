const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || '82.157.154.143',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'agri',
    user: process.env.DB_USER || 'agri_root',
    password: process.env.DB_PASSWORD || 'agri_root',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
    console.log('✅ PostgreSQL 数据库连接成功');
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL 数据库错误:', err);
});

// 包装查询方法以统一接口
class Database {
    constructor(pool) {
        this.pool = pool;
    }

    async query(text, params = []) {
        const result = await this.pool.query(text, params);
        return result;
    }

    async getConnection() {
        const client = await this.pool.connect();
        return {
            query: async (text, params = []) => {
                return await client.query(text, params);
            },
            beginTransaction: async () => {
                await client.query('BEGIN');
            },
            commit: async () => {
                await client.query('COMMIT');
            },
            rollback: async () => {
                await client.query('ROLLBACK');
            },
            release: () => {
                client.release();
            }
        };
    }
}

const db = new Database(pool);
module.exports = db;
