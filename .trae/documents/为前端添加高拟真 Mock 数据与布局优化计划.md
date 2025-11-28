## 目标
- 全站页面尽可能使用逼真的 Mock 数据，覆盖商城、订单、物流、金融、知识、社区等模块。
- 在不引入新依赖的前提下，通过本地 Mock API 和轻量 Hook 模式模拟真实加载、空态、错误态与分页。
- 使用 Chrome DevTools 进行响应式与视觉细节检查，统一布局与设计规范，使页面美观、合理。

## 总体方案
- 保留现有 `constants.ts` 中的演示数据，新增更丰富的数据集与延伸字段，提高真实度。
- 新增 `src/mock/` 目录：集中管理更接近真实的 JSON/TS Mock 数据，按业务模块拆分。
- 新增 `src/mock/mockApi.ts`：封装 Promise 接口（含随机延迟、错误概率、分页参数），页面通过它“像调后端一样”取数。
- 提供 `useMockQuery` 轻量 Hook：统一加载、错误、刷新与分页状态，不依赖第三方库。
- 通过 `MockProvider` 或环境开关在开发态强制使用 Mock；保留直接引用常量的页面作为后备。

## Mock 数据扩充
- 扩充 `constants.ts`（路径：`frontend/smart-main/constants.ts`）中的数据体量与字段：
  - 商品：增加促销、库存预警、评分、月销量、运费模板、类目层级；构造 50～200 条商品。
  - 订单：补充订单列表、状态流转、对账字段、售后字段；构造买家/卖家各 100+ 条。
  - 物流：扩充冷链监测、线路节点、异常上报；增加多物流公司样本。
  - 发票：增加多类型发票、开票抬头、税号校验样例。
  - 金融：丰富贷款产品与申请记录，补充风控评分、征信简要字段。
  - 社区/知识：扩充文章、专家、问答与话题样本及互动数据（浏览、点赞、评论数）。
- 将大体量数据迁移到 `src/mock/*.ts`，`constants.ts` 仅保留少量示例并重导出，避免单文件过大。

## Mock API 与延迟模拟
- `mockApi.ts` 提供典型接口：
  - `getProducts({page,pageSize,keyword,category,sort})`
  - `getProductById(id)`
  - `getBuyerOrders({page,pageSize,status})`
  - `getOrderDetail(id)`
  - `getLogistics(trackingNo)`
  - `getInvoices({page,pageSize,status})`
  - `getLoans()`、`getLoanApplications()`
  - `getArticles({page,pageSize,tag})`、`getExpertById(id)`、`getQA({page})`
- 每个接口返回 Promise，内置：
  - 随机延迟 200–1200ms、可配置错误概率 3–5%。
  - 支持分页、筛选与排序；局部字段缺省以测试容错。

## 轻量数据 Hook
- `useMockQuery(fn, deps)`：管理 `data,isLoading,isError,retry`；支持 `params` 变化自动刷新。
- `usePagingQuery(fn, initialParams)`：统一分页状态 `page,pageSize,total,loadMore`。
- 优点：与现有 React 19、Tailwind（通过 CDN）兼容，无需新增依赖。

## 页面改造范围
- 商城：`Mall.tsx`、`ProductDetail.tsx`、`ShopProfile.tsx`、`MallMarketing.tsx`、`MallTools.tsx`。
- 买家：`BuyerDashboard.tsx`、`BuyerOrders.tsx`、`BuyerOrderDetail.tsx`、`BuyerAddress.tsx`、`PaymentManagement.tsx`、`BuyerReviews.tsx`、`BuyerRefund.tsx`、`OrderServices.tsx`（发票/物流）。
- 卖家：`SellerProduct.tsx`、`SellerOrders.tsx`、`SellerReviews.tsx`、`SellerSettings.tsx`。
- 金融：`Finance.tsx`、`FinanceFarmer.tsx`、`FinanceBanker.tsx`（含列表与详情）。
- 知识/社区：`Knowledge.tsx`、`ExpertPublic.tsx`、`ExpertWorkspace.tsx`、`ArticleDetail.tsx`、`Community.tsx`。
- 做法：将直读常量替换为 `mockApi` 调用 + Hook；为关键列表页增加分页与筛选。

## 布局与美观优化清单
- 容器规范：统一 `max-w-[1600px] mx-auto px-4`（已在 `components/Layouts.tsx` 中使用），保证一致对齐与留白。
- 头部与导航：
  - 固定头部滚动过渡优化，确保遮挡与抖动最小化（参考 `TopHeader` 与 `PortalNav`）。
  - 移动端底部导航对齐与触控半径优化，提升可用性。
- 列表与卡片：统一卡片阴影、圆角、分隔线；增强空态（插画+文案）、加载态（骨架屏）。
- 响应式：完善 `sm/md/lg/xl` 断点展示，减少文本溢出与图片变形；通用 `object-cover` 与 `line-clamp`。
- 颜色与字体：沿用 `constants.ts` 的 `COLORS`，统一主次文本与分隔线色；保持 Tailwind 工具类风格。
- 可用性：按钮触达区≥44px、可焦点元素态（hover/focus/active）、对比度≥4.5。

## Chrome DevTools 检查项
- 设备模拟与断点：使用响应式设计模式逐页检查 `320–1920px` 横纵屏表现。
- 性能：用 Performance 面板审查首屏绘制与长列表渲染；按需虚拟化或分页。
- 无障碍：检查对比度、可聚焦、键盘导航；必要处补 `aria-*` 与语义标签。
- 网络：在 Mock 延迟开启时观察 Loading 与错误态的时序与遮挡；确保交互不中断。

## 交付与验证
- 运行与预览：`npm run dev` 启动后逐页检查；提交可视链接用于预览。
- 页面清单验收：商城、买家、卖家、金融、知识、社区主路径均要有真实的列表与详情数据；滚动/筛选/分页能用。
- 代码结构：新文件位于 `src/mock/*`、Hook 于 `src/hooks/*`；旧页面最小改动。

## 风险与依赖说明
- 不新增外部依赖：充分利用 React 19、Tailwind（CDN）、`react-router-dom@7.9.6`。
- 数据量大时注意打包体积（开发态可用）；生产前可切换为真实后端或按需懒加载 Mock。

若确认该方案，我将开始新增 `src/mock` 与 Hook，并逐页接入与布局优化。