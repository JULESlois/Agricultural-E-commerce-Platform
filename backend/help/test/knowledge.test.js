// __tests__/knowledge.test.js
const request = require('supertest');
const app = require('../app');


const loginAsUser = async (agent) => {
    const res = await agent
        .post('/login')
        .send({
            phone: '13988888888',         // 改成你数据库里真实存在的测试账号
            password: '123456',           // 对应密码（明文或你项目用的默认密码）
            // 如果你项目用的是 username 或 email，就改成：
            // username: 'testuser',
            // password: '123456'
        });

    // 登录失败会直接抛错，方便你立刻看到账号不对
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(200);  // 你们项目统一返回格式
    return agent;
};

describe('专家模块全链路测试', () => {
    let agent;

    beforeEach(() => {
        agent = request.agent(app);  // 保持 cookie 登录态
    });

    // 测试1：申请成为专家（需要登录）
    it('POST /api/experts/apply 申请成为专家', async () => {
        await loginAsUser(agent);

        const res = await agent
            .post('/experts/apply')
            .send({
                userId: 'testuser2025',                    // 改成你测试账号真实的 userId（看登录返回或数据库）
                realName: '张三丰',
                idCard: '110101199003071888',
                expertise: '水稻病虫害防治',
                experience: '20年'
                // 其他必填字段
            });

        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
        expect(res.body.message).toContain('成功');
    });

    // 测试2：获取专家列表（公开接口，无需登录）
    it('GET /api/experts 获取专家列表 → 成功', async () => {
        const res = await request(app).get('/experts');  // 不是 /list！

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    // 测试3：创建咨询需求（需要登录）
    it('POST /api/consult/demands 创建咨询需求 → 成功', async () => {
        await loginAsUser(agent);

        const res = await agent
            .post('/api/consult/demands')
            .send({
                userId: 1,
                expertId: 2,                  // 随便填一个数据库里真实存在的专家ID
                title: '水稻叶子发黄怎么办',
                description: '最近田里水稻叶子大面积发黄，求指导'
            });

        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
    });
});