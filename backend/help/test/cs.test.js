// New tests/cs.test.js

const request = require('supertest');
const app = require('../app');

describe('CS API', () => {
    it('GET /api/cs-info?type=official should return cs info', async () => {
        const res = await request(app).get('/api/cs-info?type=official');
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
        expect(res.body.data).toHaveProperty('cs_id');
    });

    // Add more tests for other endpoints...
});