## 现状综述
- 统一后端响应格式：多数后端模块（认证/市场/社区/金融）使用 `{ code, message, data }`。
- 特例：市场模块 `GET /api/market/products` 有 `{ success, data }` 变体；前端已做兼容（Mall 页面对 `r?.data || (r?.success ? r.data : null)`）。
- 认证模块字段：登录返回 `data.token` 与 `data.user_info`；用户信息返回 `data: user`。前端已兼容登录数据的两种字段名，并且 `marketMe` 走 `/api/users/me`。
- 金融模块：`ApiResponse` 明确定义 `{ code, message, data }` 并有 `201 created`；前端金融 API 基础路径与子路径匹配。

## 核查清单（逐项比对字段与格式）
1. 认证
- 登录：后端 `POST /api/auth/login` → `{ code, message, data: { token, user_info } }`
- 我方期望：`token`，`user.user_type`；兼容 `data.user` 与 `data.user_info`
- 用户信息：后端 `GET /api/users/me` → `{ code, message, data: user }`
- 前端使用：`r.data` 作为用户对象

2. 市场
- 产品列表：`GET /api/market/products` → `{ success, data: Product[] }`
- 购物车/地址/订单：控制器遵循 `{ code, message, data }`
- 前端使用：一般读取 `r.data`；产品列表已同时容忍 `success` 变体
- 订单创建：返回 `data.order_id`；前端在 Checkout 对应多键兼容提取（`order_id | orderId | id`）

3. 社区
- 内容/评论/点赞/收藏：均为 `{ code, message, data }`
- 前端使用：`r.data` 数组或对象

4. 金融
- 贷款类型/农户申请/银行审批：统一 `{ code, message, data }`，部分创建为 `201` created
- 前端使用：直接读取 `r.data`

## 验证步骤（只读）
- 通过浏览器或脚本检查接口返回字段：
  - 认证：登录与 `users/me` 是否包含上述字段；`user_type` 是否存在。
  - 市场：产品列表是否返回 `data`（或 `success` 变体）；购物车/地址/订单返回 `data`。
  - 社区：`/api/community/content` 返回 `data` 数组。
  - 金融：`/finance/api/financing/loan-types` 返回 `data`。
- 记录任何字段名差异（如大小写、嵌套层级、命名不同）。

## 若发现不匹配的处理策略
- 前端优先适配：在 API 层做最小兼容（例如容忍多键提取、标准化 `data`）。
- 后端建议统一：将个别 `{ success, data }` 端点改为 `{ code, message, data }`（可选，非必须，因前端已兼容）。

## 交付内容
- 输出按模块整理的“字段匹配报告”，列出每个关键接口的实际返回字段与前端读取方式。
- 如存在不匹配，给出具体修正项列表（前端/后端哪一处、改动点）。

如确认执行，我将按以上清单进行逐项检查并生成报告；若发现不匹配会同步提交前端最小兼容修正。