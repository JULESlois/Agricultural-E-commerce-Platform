# 售后与统计 API 文档

## 概述
本文档描述了农业电商平台的售后服务和统计分析相关API接口，包括售后申请、审核、收藏管理和价格走势统计等功能。

## API 列表

### 10.1 (买家)申请售后

**功能**: 买家对已收货的订单发起退款等售后请求。

- **HTTP 方法**: POST
- **Endpoint**: `/api/orders/{order_id}/aftersale/apply`
- **权限**: 买家用户 (userType = 2)

**请求头**:
```
Authorization: Bearer {buyer_token}
```

**路径参数**:
- `order_id`: 订单ID

**请求体**:
```json
{
  "aftersale_type": 1,
  "apply_amount": 500.00,
  "reason": "部分小麦有发霉迹象，申请部分退款。",
  "proof_images": "[\"https://.../proof1.jpg\", \"https://.../proof2.jpg\"]"
}
```

**响应**:
```json
{
  "code": 201,
  "message": "售后申请已提交，等待平台审核。",
  "data": {
    "aftersale_id": 601
  }
}
```

**功能特性**:
- 只有已完成的订单才能申请售后
- 每个订单只能申请一次售后
- 支持上传证明图片
- 自动记录申请时间和用户

---

### 10.2 (管理员)审核售后申请

**功能**: 平台管理员介入处理买家的售后请求。

- **HTTP 方法**: POST
- **Endpoint**: `/api/admin/aftersale/{aftersale_id}/review`
- **权限**: 管理员用户 (userType = 3)

**请求头**:
```
Authorization: Bearer {admin_token}
```

**路径参数**:
- `aftersale_id`: 售后申请ID

**请求体**:
```json
{
  "audit_status": 1,
  "audit_remark": "情况属实，同意退款申请。"
}
```

**响应**:
```json
{
  "code": 200,
  "message": "售后审核操作成功。"
}
```

**功能特性**:
- 只有管理员可以审核售后申请
- 支持通过(1)或驳回(2)操作
- 记录审核时间和审核人
- 可添加审核备注

---

### 10.3 添加收藏

**功能**: 用户收藏一个货源或求购信息。

- **HTTP 方法**: POST
- **Endpoint**: `/api/my/collections`
- **权限**: 任何已登录用户

**请求头**:
```
Authorization: Bearer {user_token}
```

**请求体**:
```json
{
  "collection_type": 1,
  "source_id": 10001
}
```

**响应**:
```json
{
  "code": 201,
  "message": "收藏成功。",
  "data": {
    "collection_id": 701
  }
}
```

**功能特性**:
- 支持收藏货源(type=1)或求购(type=2)
- 防止重复收藏同一项目
- 自动获取收藏对象名称
- 记录收藏时间

---

### 10.4 取消收藏

**功能**: 用户取消一个收藏。

- **HTTP 方法**: DELETE
- **Endpoint**: `/api/my/collections/{collection_id}`
- **权限**: 任何已登录用户

**请求头**:
```
Authorization: Bearer {user_token}
```

**路径参数**:
- `collection_id`: 收藏ID

**响应**:
- **成功 (HTTP 204 No Content)**: 无响应体

**功能特性**:
- 软删除机制（标记为无效）
- 只能取消自己的收藏
- 记录取消时间

---

### 10.5 获取我的收藏列表

**功能**: 用户查看自己收藏的所有货源或求购。

- **HTTP 方法**: GET
- **Endpoint**: `/api/my/collections?type=1`
- **权限**: 任何已登录用户

**请求头**:
```
Authorization: Bearer {user_token}
```

**查询参数**:
- `type`: 收藏类型 (1=货源, 2=求购) - 可选，不传则返回所有类型

**响应**:
```json
{
  "code": 200,
  "message": "查询成功。",
  "data": [
    {
      "collection_id": 701,
      "collection_type": 1,
      "source_id": 10001,
      "collection_name": "2025新产冬小麦（有机认证）",
      "collection_time": "2025-10-26T15:00:00Z"
    }
  ]
}
```

**功能特性**:
- 支持按类型筛选
- 按收藏时间倒序排列
- 只显示有效的收藏记录

---

### 10.6 获取产品价格走势

**功能**: 供前端展示某个品类在一段时间内的价格变化曲线。

- **HTTP 方法**: GET
- **Endpoint**: `/api/stats/price-trends?category_id=101&start_date=2025-09-01&end_date=2025-09-30`
- **权限**: 公开接口（无需认证）

**查询参数**:
- `category_id`: 品类ID (必需)
- `start_date`: 开始日期 (必需，ISO格式)
- `end_date`: 结束日期 (必需，ISO格式)

**响应**:
```json
{
  "code": 200,
  "message": "查询成功。",
  "data": {
    "category_name": "小麦",
    "trends": [
      {
        "stat_date": "2025-09-25",
        "avg_price": "2.85",
        "max_price": "3.00",
        "min_price": "2.70",
        "price_trend": 2
      },
      {
        "stat_date": "2025-09-26",
        "avg_price": "2.84",
        "max_price": "2.98",
        "min_price": "2.70",
        "price_trend": 2
      }
    ]
  }
}
```

**功能特性**:
- 按日期范围查询价格统计
- 包含平均价、最高价、最低价
- 显示价格趋势（0=持平, 1=上涨, 2=下跌）
- 按日期升序排列

## 数据库表结构

### 订单售后表 (mall_order_aftersale)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| aftersale_id | BIGSERIAL | 售后ID（主键） |
| order_id | VARCHAR(32) | 订单ID |
| item_id | BIGINT | 订单明细ID |
| aftersale_type | SMALLINT | 售后类型（1=退款, 2=退货退款） |
| apply_amount | DECIMAL(12,2) | 申请金额 |
| reason | VARCHAR(500) | 申请原因 |
| proof_images | VARCHAR(500) | 证明图片 |
| apply_user | BIGINT | 申请用户ID |
| apply_time | TIMESTAMP | 申请时间 |
| audit_status | SMALLINT | 审核状态（0=待审核, 1=通过, 2=驳回） |
| audit_user | BIGINT | 审核用户ID |
| audit_time | TIMESTAMP | 审核时间 |
| audit_remark | VARCHAR(500) | 审核备注 |

### 用户收藏表 (mall_user_collection)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| collection_id | BIGSERIAL | 收藏ID（主键） |
| user_id | BIGINT | 用户ID |
| collection_type | SMALLINT | 收藏类型（1=货源, 2=求购） |
| source_id | BIGINT | 货源ID |
| demand_id | BIGINT | 求购ID |
| collection_name | VARCHAR(100) | 收藏对象名称 |
| collection_time | TIMESTAMP | 收藏时间 |
| is_valid | SMALLINT | 是否有效（0=否, 1=是） |
| cancel_time | TIMESTAMP | 取消时间 |

### 产品价格统计表 (mall_product_price_stat)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| stat_id | BIGSERIAL | 统计ID（主键） |
| category_id | INTEGER | 品类ID |
| product_name | VARCHAR(50) | 产品名称 |
| stat_date | DATE | 统计日期 |
| avg_price | DECIMAL(10,2) | 平均价格 |
| max_price | DECIMAL(10,2) | 最高价格 |
| min_price | DECIMAL(10,2) | 最低价格 |
| price_trend | SMALLINT | 价格趋势（0=持平, 1=上涨, 2=下跌） |
| trend_rate | DECIMAL(5,2) | 趋势幅度 |
| supply_quantity | DECIMAL(15,2) | 供应量 |
| demand_quantity | DECIMAL(15,2) | 需求量 |

## 售后状态说明

### 售后类型 (aftersale_type)
- **1**: 仅退款
- **2**: 退货退款

### 审核状态 (audit_status)
- **0**: 待审核
- **1**: 审核通过
- **2**: 审核驳回

### 售后状态 (aftersale_status)
- **0**: 已关闭
- **1**: 进行中
- **2**: 已完成

## 价格趋势说明

### 价格趋势 (price_trend)
- **0**: 持平
- **1**: 上涨
- **2**: 下跌

## 错误处理

所有API都包含统一的错误处理机制：

- **400**: 请求参数错误
- **403**: 权限不足
- **404**: 资源不存在
- **500**: 服务器内部错误

错误响应格式：
```json
{
  "code": 400,
  "message": "错误描述",
  "error": "详细错误信息"
}
```

## 安全特性

1. **权限验证**: 售后申请需要买家权限，审核需要管理员权限
2. **数据隔离**: 用户只能操作自己的收藏和售后申请
3. **业务规则**: 严格的售后申请条件检查
4. **防重复操作**: 防止重复收藏和重复售后申请
5. **数据验证**: 使用Joi进行严格的参数验证

## 业务逻辑

### 售后申请流程
1. 买家对已完成订单申请售后
2. 系统检查订单状态和权限
3. 记录售后申请信息
4. 管理员审核申请
5. 根据审核结果处理退款

### 收藏功能
- 支持收藏货源和求购信息
- 防重复收藏机制
- 软删除保护数据

### 价格统计
- 定期统计各品类价格数据
- 计算价格趋势和变化幅度
- 提供历史价格查询

## 测试

使用 `test-aftersale-stats-api.js` 文件可以测试所有售后与统计相关API功能。需要先设置有效的token。

```bash
node test-aftersale-stats-api.js
```

## 扩展功能建议

1. **售后流程优化**: 增加卖家参与的协商环节
2. **智能收藏**: 基于用户行为推荐收藏内容
3. **价格预测**: 基于历史数据预测价格走势
4. **统计报表**: 提供更丰富的数据分析报表