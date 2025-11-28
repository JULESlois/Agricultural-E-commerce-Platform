## 总览
- 目标：把 `frontend/smart-main` 改造成“可登录、可下单、可管理地址、可查看订单、可浏览社区与金融产品”的实际可用前端。
- 对接后端：
  - 市场服务 `http://localhost:3001/api`（登录、购物车、订单、地址、类目等）
  - 社区服务 `http://localhost:3003/api/community`（内容列表、详情、评论/点赞）
  - 融资服务 `http://localhost:8082/finance/api`（贷款产品、申请、银行审批）
  - 认证服务 `http://localhost:3002/api`（备用：通用注册登录）
- 方法：新增统一请求层、按页面渐进替换 mock 数据为真实 API；私有路由加权限守卫；保留 mock 作为离线兜底。

## 依赖与配置
- 使用原生 `fetch` 封装请求（项目未安装 axios）。
- 新增环境变量（不破坏现有）：`VITE_MARKET_BASE`, `VITE_COMMUNITY_BASE`, `VITE_FINANCE_BASE`, `VITE_AUTH_BASE`。
- Vite 通过 `import.meta.env` 读取；若环境变量缺失则回退到默认端口。

## 网络层设计
- 新增 `src/api/http.ts`：
  - `request(path, options, { base })`：自动附加 `Authorization`（从 `localStorage.token`），统一 JSON 解析与错误处理。
  - 401/403 时清理 token 并跳转登录（可在 Layout 层拦截）。
- 新增域服务：
  - `src/api/market.ts`：`login`, `me`, `products`, `cart` 系列、`orders` 系列、`addresses` 系列。
  - `src/api/community.ts`：`listContent`, `contentDetail`, `comments`, `like`, `collect`。
  - `src/api/finance.ts`：`listLoanTypes`, `loanTypeDetail`, `createApplication`, `myApplications`。
  - `src/api/auth.ts`：与认证服务的通用注册登录（可选）。

## 状态与鉴权
- 新增 `src/store/auth.ts`（不引入 Redux，使用 Context）：
  - `auth.user`, `auth.token`, `auth.role`；持久化到 `localStorage`。
  - `login(login_identifier, password)` 调用市场服务 `/api/auth/login`（backend/market/routes/auth.js:10）。
- 路由守卫：
  - 在 `components/Layouts.tsx` 的 `DashboardLayout` 进入时检查 `token`；无 token 则重定向到 `/auth/login`。
  - 依据 `role` 决定默认工作台（农户/买家/银行/专家）。

## 页面对接清单
- 登录页 `pages/Auth.tsx`：
  - 替换模拟延迟为真实登录：`POST /api/auth/login`（参数：`login_identifier`, `password`），成功后保存 `token`、`user_type` 并跳转（买家→订单；卖家→工作台）。
- 商城首页 `pages/Mall.tsx`：
  - 用 `GET /api/market/products`（backend/market/index.js:78）替换 `MOCK_PRODUCTS` 列表展示；取不到时回退 mock。
- 购物车 `pages/Cart.tsx`：
  - `GET /api/cart`、`POST /api/cart/add`、`PUT /api/cart/:cart_id`、`DELETE /api/cart/:cart_id`（backend/market/routes/cart.js）。
- 下单/收银台 `pages/Checkout.tsx` 与 `pages/PaymentResult.tsx`：
  - 创建订单：`POST /api/orders`，支付：`POST /api/orders/:order_id/pay`，结果页读取订单详情：`GET /api/orders/:order_id`（backend/market/routes/order.js）。
- 买家地址 `pages/BuyerAddress.tsx`：
  - `GET /api/addresses`、`POST /api/addresses`、`PUT /api/addresses/:id`、`DELETE /api/addresses/:id`、设默认 `PATCH /api/addresses/:id/default`（backend/market/routes/addresses.js）。
- 买家订单列表与详情 `pages/BuyerOrders.tsx`、`pages/BuyerOrderDetail.tsx`：
  - `GET /api/orders`、`GET /api/orders/:order_id`、确认收货 `POST /api/buyer/orders/:order_id/confirm-receipt`（backend/market/routes/order.js）。
- 社区 `pages/Community.tsx`：
  - 列表：`GET /api/community/content`，详情：`GET /api/community/content/:content_id`，评论：`GET/POST /api/community/content/:content_id/comments`，点赞/收藏：`POST/DELETE /api/community/content/:content_id/like|collect`（backend/community/routes/content.js）。
- 金融 `pages/Finance.tsx`、`pages/FinanceFarmer.tsx`、`pages/FinanceBanker.tsx`：
  - 贷款产品列表/详情：`GET /finance/api/financing/loan-types` 与 `GET /finance/api/financing/loan-types/{id}`（backend/finance/api.md）。
  - 农户创建申请：`POST /finance/api/farmer/financing/applications`（需要 `Authorization`）。
  - 我的申请列表：`GET /finance/api/farmer/financing/applications`。
  - 银行审批页：`GET /finance/api/bank/financing/applications`、`GET /finance/api/bank/financing/applications/{id}`、`POST /finance/api/bank/financing/applications/{id}/review`。

## 渐进替换策略
- 第 1 批（至少可用）：登录、商品列表、购物车、地址管理、订单列表与详情、收银台。
- 第 2 批：社区浏览与互动（已登录用户评论/点赞/收藏）、金融产品浏览。
- 第 3 批：融资申请与银行审批交互；卖家工作台数据对接（货源、订单发货）。

## 错误处理与兜底
- 请求失败统一 toast/提示；对列表类页面保留 `MOCK_*` 作为回退。
- 401/403：清空登录状态并回到 `/auth/login`。
- 空数据态：列表/详情页提供占位视图。

## 安全与跨域
- 所有请求仅附加 `Authorization: Bearer ${token}`；不在控制台打印敏感信息。
- 后端已启用 CORS（market/community 有；auth 若需要再视部署调整）。

## 代码位置说明（现有结构）
- 路由入口：`frontend/smart-main/App.tsx:106-208`。
- 布局与导航：`frontend/smart-main/components/Layouts.tsx:397-446`、`534-560`。
- 模型类型：`frontend/smart-main/types.ts`；mock 数据集中在 `frontend/smart-main/constants.ts`。

## 验证步骤
- 启动后端：market(3001)、community(3003)、auth(3002)、finance(8082/finance)。
- 前端 `npm run dev` 后：
  - 登录：输入已存在的手机号与密码（market 用户库）。
  - 商城：看到真实产品列表；可加购物车、改数量、删条目。
  - 地址：增删改查与设默认。
  - 订单：创建→支付→查看详情→确认收货流程贯通。
  - 社区：能浏览内容与详情；登录后可评论/点赞。
  - 金融：可浏览贷款产品；登录为农户可提交申请并在“我的申请”看到记录。

如同意此计划，我将按“第 1 批”开始实现：新增请求层与市场域对接，并把相关页面替换为实际数据。