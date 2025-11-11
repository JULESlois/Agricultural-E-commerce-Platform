# 智农链社区前端

基于 React + TypeScript + Vite 构建的社区模块前端应用。

## 技术栈

- React 19.2.0
- TypeScript 5.8.2
- Vite 6.2.0
- React Router 6.22.0
- Axios 1.6.7
- Zustand 4.5.0

## 设计风格

采用莫兰迪色系配色方案：
- 主色：深绿 (#5F7367)
- 辅助色：砖红 (#A67C7C)、沙蓝 (#7B8FA3)、暗金 (#B8A57A)

## 功能模块

### 1. 内容浏览
- 首页内容列表（支持分类筛选、排序）
- 内容详情页
- 评论互动

### 2. 内容发布
- 支持三种类型：经验分享、求助、问题咨询
- 分类选择
- 标签搜索和添加
- 悬赏问答

### 3. 社交互动
- 点赞、收藏
- 评论、回复
- 关注用户
- 采纳最佳答案

### 4. 用户功能
- 个人主页
- 关注/粉丝列表
- 我的内容

## 项目结构

```
src/
├── api/              # API 接口
│   ├── content.ts    # 内容相关
│   ├── follow.ts     # 关注相关
│   ├── qa.ts         # 问答相关
│   └── report.ts     # 举报相关
├── components/       # 组件
│   ├── Layout/       # 布局组件
│   ├── ContentCard.tsx
│   └── CommentItem.tsx
├── pages/            # 页面
│   ├── Home.tsx
│   ├── ContentDetail.tsx
│   └── Publish.tsx
├── store/            # 状态管理
│   └── userStore.ts
├── styles/           # 样式
│   ├── colors.ts     # 配色方案
│   └── global.css    # 全局样式
├── types/            # 类型定义
│   └── index.ts
├── utils/            # 工具函数
│   └── request.ts    # HTTP 请求封装
├── App.tsx           # 应用入口
└── main.tsx          # 主文件
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5174 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## API 对接

后端 API 地址配置在 `vite.config.ts` 中：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3003',
      changeOrigin: true,
    },
  },
}
```

## 环境要求

- Node.js >= 18
- npm >= 9

## 注意事项

1. 确保后端服务已启动（端口 3003）
2. 需要配置有效的 JWT token 才能访问需要认证的接口
3. 图片上传功能需要配置 OSS 或其他存储服务
