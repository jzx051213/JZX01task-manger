# 智能任务管理系统

基于 **Node.js (Express) + Supabase** 的简洁任务管理应用，支持优先级标记、完成状态切换和优先级筛选。

## 功能特性

- ✅ 输入框 + 优先级下拉（高 / 中 / 低）添加任务
- ✅ 任务列表显示标题、优先级徽章、完成状态
- ✅ 每条任务支持「完成 / 未完成」一键切换
- ✅ 支持删除任务（带确认弹窗）
- ✅ 按优先级筛选（全部 / 高 / 中 / 低）
- ✅ 任务按创建时间倒序排列
- ✅ 已完成任务自动加删除线、置灰
- ✅ 中文界面，简洁美观，响应式布局

## 项目结构

```
task-manager/
├── server.js              # Express 后端 API
├── package.json
├── .env.example           # 环境变量示例
├── supabase_schema.sql    # Supabase 建表 SQL
└── public/
    ├── index.html         # 前端页面
    ├── style.css          # 样式
    └── app.js             # 前端逻辑
```

## 快速开始

### 1. 准备 Supabase 数据库

1. 登录 [Supabase](https://supabase.com/)，新建一个项目。
2. 进入项目的 **SQL Editor**，复制 `supabase_schema.sql` 中的内容并执行，创建 `tasks` 表。
3. 进入 **Settings → API**，复制：
   - `Project URL`
   - `anon public` key

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```env
SUPABASE_URL=你的项目URL
SUPABASE_ANON_KEY=你的anon_key
PORT=3000
```

### 3. 安装依赖并启动

```bash
npm install
npm start
```

打开浏览器访问 http://localhost:3000 即可使用。

## API 接口

| 方法   | 路径                       | 说明                     |
| ------ | -------------------------- | ------------------------ |
| GET    | `/api/tasks?priority=high` | 获取任务列表（可筛选）   |
| POST   | `/api/tasks`               | 新增任务                 |
| PATCH  | `/api/tasks/:id/toggle`    | 切换完成状态             |
| DELETE | `/api/tasks/:id`           | 删除任务                 |

## 技术栈

- **后端**：Node.js + Express
- **数据库**：Supabase（PostgreSQL）
- **前端**：原生 HTML / CSS / JavaScript
