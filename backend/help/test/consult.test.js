// Update tests/consult.test.js (add for new endpoints)
const request = require('supertest');
const app = require('../app');

describe('Consult API', () => {
    // Previous tests...

    it('POST /api/consult/records/1/pay should generate payment', async () => {
        const res = await request(app)
            .post('/api/consult/records/1/pay')
            .set('Authorization', 'Bearer user_token');
        expect(res.status).toBe(200); // or 404 if no data
    });

    it('POST /api/consult/records/1/evaluate should submit eval', async () => {
        const res = await request(app)
            .post('/api/consult/records/1/evaluate')
            .set('Authorization', 'Bearer user_token')
            .send({ eval_score: 5, /* ... */ });
        expect(res.status).toBe(201); // or 409 if exist
    });
});