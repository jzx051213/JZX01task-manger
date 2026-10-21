-- 智能任务管理系统 - Supabase 数据库初始化脚本
-- 在 Supabase 项目的 SQL Editor 中执行以下语句

-- 创建任务表
CREATE TABLE IF NOT EXISTS tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('高', '中', '低')),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 开启行级安全性
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 允许匿名读取
CREATE POLICY "允许匿名读取任务" ON tasks
  FOR SELECT USING (true);

-- 允许匿名插入
CREATE POLICY "允许匿名新增任务" ON tasks
  FOR INSERT WITH CHECK (true);

-- 允许匿名更新
CREATE POLICY "允许匿名更新任务" ON tasks
  FOR UPDATE USING (true);

-- 允许匿名删除
CREATE POLICY "允许匿名删除任务" ON tasks
  FOR DELETE USING (true);

-- 索引
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks (priority);
