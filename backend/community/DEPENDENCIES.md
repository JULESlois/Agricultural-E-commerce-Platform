# 社区模块依赖清单

## 生产依赖 (dependencies)

### 1. express (^4.18.2)
- **用途**: Web应用框架
- **功能**: 提供HTTP服务器、路由、中间件等核心功能
- **使用场景**: 所有API接口的基础框架

### 2. pg (^8.11.3)
- **用途**: PostgreSQL数据库驱动
- **功能**: 连接和操作PostgreSQL数据库，支持Promise API
- **使用场景**: 所有数据库操作（查询、插入、更新、删除）

### 3. jsonwebtoken (^9.0.2)
- **用途**: JWT令牌处理
- **功能**: 验证用户身份令牌
- **使用场景**: 用户认证中间件，验证请求的合法性

### 4. dotenv (^16.3.1)
- **用途**: 环境变量管理
- **功能**: 从.env文件加载环境变量
- **使用场景**: 数据库配置、JWT密钥等敏感信息管理

### 5. cors (^2.8.5)
- **用途**: 跨域资源共享
- **功能**: 处理跨域请求
- **使用场景**: 允许前端应用跨域访问API

## 开发依赖 (devDependencies)

### 1. nodemon (^3.0.2)
- **用途**: 开发热重载工具
- **功能**: 监听文件变化自动重启服务
- **使用场景**: 开发环境下提高开发效率

## 安装说明

### 安装所有依赖
```bash
cd backend/community
npm install
```

### 仅安装生产依赖
```bash
npm install --production
```

### 单独安装某个依赖
```bash
npm install express
npm install mysql2
npm install jsonwebtoken
npm install dotenv
npm install cors
```

### 安装开发依赖
```bash
npm install --save-dev nodemon
```

## 依赖版本说明

- 使用 `^` 符号表示兼容版本更新
- 例如 `^4.18.2` 表示可以自动更新到 `4.x.x` 的最新版本，但不会更新到 `5.0.0`

## 注意事项

1. **mysql2**: 需要确保MySQL服务器已安装并运行
2. **jsonwebtoken**: JWT_SECRET必须与认证服务保持一致
3. **cors**: 生产环境建议配置具体的允许域名，而非使用通配符
4. **nodemon**: 仅用于开发环境，生产环境使用 `node index.js` 启动

## 与其他模块的依赖关系

社区模块的依赖已在 `backend/package.json` 中统一管理，但实际依赖安装在各自模块目录下：

- `backend/auth` - 认证模块
- `backend/market` - 市场模块
- `backend/community` - 社区模块（当前模块）

每个模块独立管理自己的依赖，互不干扰。
