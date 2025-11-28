const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('./database');
const { registerSchema } = require('./utils/validation');

const app = express();
const PORT = process.env.PORT || 3050;
const USE_MOCK = process.env.USE_MOCK === '1';
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

const corsOptions = {
  origin: true,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Mini Auth Test API', status: 'running', timestamp: new Date().toISOString() });
});

app.get('/health', async (req, res) => {
  if (USE_MOCK) {
    return res.json({ status: 'healthy', database: 'mock', timestamp: new Date().toISOString() });
  }
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.json({ status: 'healthy', database: 'connected', timestamp: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: err.message });
  }
});

const mockUsers = new Map();
let mockIdSeq = 100000;
app.post('/api/auth/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ code: 400, message: '注册失败', error: error.details[0].message });
    }
    const { user_name, password, real_name, user_type, id_card, phone, email } = value;
    if (USE_MOCK) {
      for (const u of mockUsers.values()) {
        if (u.user_name === user_name) return res.status(409).json({ code: 409, message: '注册失败', error: `用户名 '${user_name}' 已存在` });
        if (u.phone === phone) return res.status(409).json({ code: 409, message: '注册失败', error: '该手机号已被注册' });
        if (u.id_card === id_card) return res.status(409).json({ code: 409, message: '注册失败', error: '该身份证号已被注册' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user_id = mockIdSeq++;
      mockUsers.set(user_id, { user_id, user_name, password: hashedPassword, real_name, user_type, id_card, phone, email: email || null, user_status: 1, cert_status: 0 });
      return res.status(201).json({ code: 201, message: '注册成功', data: { user_id } });
    }
    const existsUserName = await pool.query('SELECT user_id FROM sys_user WHERE user_name = $1', [user_name]);
    if (existsUserName.rows.length > 0) {
      return res.status(409).json({ code: 409, message: '注册失败', error: `用户名 '${user_name}' 已存在` });
    }
    const existsPhone = await pool.query('SELECT user_id FROM sys_user WHERE phone = $1', [phone]);
    if (existsPhone.rows.length > 0) {
      return res.status(409).json({ code: 409, message: '注册失败', error: '该手机号已被注册' });
    }
    const existsId = await pool.query('SELECT user_id FROM sys_user WHERE id_card = $1', [id_card]);
    if (existsId.rows.length > 0) {
      return res.status(409).json({ code: 409, message: '注册失败', error: '该身份证号已被注册' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const insert = await pool.query(
      'INSERT INTO sys_user (user_name, password, real_name, user_type, id_card, phone, email, user_status, cert_status, create_time, update_time) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW()) RETURNING user_id',
      [user_name, hashedPassword, real_name, user_type, id_card, phone, email || null, 1, 0]
    );
    res.status(201).json({ code: 201, message: '注册成功', data: { user_id: insert.rows[0].user_id } });
  } catch (err) {
    res.status(500).json({ code: 500, message: '注册失败', error: '服务器内部错误' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { login_identifier, password } = req.body || {};
    if (!login_identifier || !password) {
      return res.status(400).json({ code: 400, message: '登录失败', error: '用户名或手机号不能为空' });
    }
    if (USE_MOCK) {
      let user;
      for (const u of mockUsers.values()) {
        if (u.user_name === login_identifier || u.phone === login_identifier) { user = u; break; }
      }
      if (!user) {
        return res.status(401).json({ code: 401, message: '登录失败', error: '用户名或密码错误' });
      }
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        return res.status(401).json({ code: 401, message: '登录失败', error: '用户名或密码错误' });
      }
      const token = jwt.sign({ user_id: user.user_id, user_type: user.user_type }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      return res.json({ code: 200, message: '登录成功', data: { token, user_info: { user_id: user.user_id, user_name: user.user_name, real_name: user.real_name, user_type: user.user_type } } });
    }
    const userResult = await pool.query('SELECT * FROM sys_user WHERE (user_name = $1 OR phone = $1)', [login_identifier]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ code: 401, message: '登录失败', error: '用户名或密码错误' });
    }
    const user = userResult.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ code: 401, message: '登录失败', error: '用户名或密码错误' });
    }
    await pool.query('UPDATE sys_user SET last_login_time = NOW() WHERE user_id = $1', [user.user_id]);
    const token = jwt.sign({ user_id: user.user_id, user_type: user.user_type }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ code: 200, message: '登录成功', data: { token, user_info: { user_id: user.user_id, user_name: user.user_name, real_name: user.real_name, user_type: user.user_type } } });
  } catch (err) {
    res.status(500).json({ code: 500, message: '登录失败', error: '服务器内部错误' });
  }
});

app.get('/api/users/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ code: 401, message: '未登录' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (USE_MOCK) {
      const user = mockUsers.get(decoded.user_id);
      if (!user) return res.status(404).json({ code: 404, message: '用户不存在' });
      const { password: _, ...info } = user;
      return res.json({ code: 200, message: '查询成功', data: info });
    }
    const r = await pool.query('SELECT user_id, user_name, real_name, user_type, phone, email, avatar, user_status, cert_status FROM sys_user WHERE user_id = $1', [decoded.user_id]);
    if (r.rows.length === 0) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }
    res.json({ code: 200, message: '查询成功', data: r.rows[0] });
  } catch (err) {
    res.status(401).json({ code: 401, message: 'Token无效或已过期' });
  }
});

app.listen(PORT, () => {
  const base = `http://localhost:${PORT}`;
  console.log('[测试认证服务] 已启动');
  console.log(`端口: ${PORT}`);
  console.log(`基础URL: ${base}`);
  console.log('路由: /api/auth/register, /api/auth/login, /api/users/me');
  console.log(USE_MOCK ? '数据库: 模拟' : '数据库: 远程PostgreSQL');
});

