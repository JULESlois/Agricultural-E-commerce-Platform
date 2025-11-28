## 访问与环境
- 打开 Chrome，访问 `http://localhost:3002/`（当前开发端口）。若需使用 `3000` 端口，可将 `vite.config.ts` 设置 `server.port = 3000` 后重启。
- 启用 DevTools（F12），开启响应式设计模式并显示布局边界（Layout 面板）。

## 界面交互与切换检查
- 门户与导航：检查首页、顶部导航滚动隐藏/展示、移动端底部导航切换。
- 商城：
  - 交互：切换“综合/价格高到低/价格低到高”，瀑布流滚动触底加载与“加载更多”按钮。
  - 卡片：悬浮阴影、图片 `object-cover`、标签叠加、长标题 `line-clamp`。
- 买家：筛选标签与搜索框输入回车触发，分页稳定与错误态提示。
- 金融与知识：加载骨架、错误重试、卡片信息与对比度。

## 布局修改目标
- Masonry 列间距与列宽：
  - `index.css` 调整 `.masonry { column-gap }` 与断点 `columns-2/3/4` 以适配 360–1920px。
  - 卡片加 `break-inside-avoid mb-4` 保证列内不拆分。
- 排序栏与统计：将分页统计改为“已加载/总数”，保持右侧对齐与不溢出。
- 图片与文本：统一图片高宽与 `object-cover`，标题 `line-clamp-2` 防止溢出。
- 安全区与留白：移动端使用 `safe-area-pb`，统一容器 `max-w` 与 `px-4`。

## 性能与可用性优化
- IntersectionObserver 触底加载：观察哨兵高度与触发频率，避免多次并发加载。
- 骨架屏数量按列数调整，减少视觉抖动；错误态不覆盖已加载内容。
- 可选：在卡片容器添加 `content-visibility: auto; contain-intrinsic-size: 240px;` 提升滚动性能。
- 无障碍：按钮触达区≥44px、hover/focus 态一致、文本对比度≥4.5。

## 代码与样式变更（获得确认后执行）
- 将商城分页网格替换为 Masonry 与滚动加载（已初步接入）；微调 `sentinel` 哨兵触发条件与加载按钮文案。
- 调整 `index.css` 的 `.masonry` 与 `.break-inside-avoid`，补充 `content-visibility` 优化类。
- 统一卡片与图片样式：边框、圆角、阴影与悬浮态；保证响应式列数与间距逻辑一致。
- 如需固定端口 `3000`，在 `vite.config.ts` 增加 `server.port = 3000`。

## 验证与回归
- 在 Chrome DevTools 的 Network 面板模拟 Slow 3G，验证加载态与错误态。
- 在 Layout 面板查看列与卡片的断裂情况与重排频率；性能面板观察滚动时 CPU 与帧率。
- 断点覆盖：320/375/768/1024/1440/1920，确保列数切换平滑。

请确认以上计划，我将按照该方案在代码与样式层面落地，并用 Chrome 完成交互检查和布局微调。