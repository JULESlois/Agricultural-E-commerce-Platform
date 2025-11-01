# Token测试示例

## 1. 先登录获取token
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login_identifier": "your_username",
    "password": "your_password"
  }'
```

## 2. 使用token测试API

### 获取待审核列表
```bash
curl -X GET http://localhost:3002/api/cert/admin/pending \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 获取用户信息
```bash
curl -X GET http://localhost:3002/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 审核通过申请
```bash
curl -X POST http://localhost:3002/api/cert/admin/applications/1/approve \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "audit_remark": "审核通过",
    "cert_expire_time": "2024-12-31"
  }'
```

## 使用步骤：
1. 运行登录命令，复制返回的token
2. 将 `YOUR_TOKEN_HERE` 替换为实际的token
3. 运行需要认证的API命令