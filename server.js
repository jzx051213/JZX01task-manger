// 智能任务管理系统 - 后端服务
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase 配置
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️  警告：未配置 SUPABASE_URL 或 SUPABASE_ANON_KEY，请在 .env 中填写');
}

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// ============ API 路由 ============

// 获取任务列表（支持按优先级筛选，按创建时间倒序）
app.get('/api/tasks', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: '数据库未配置' });

    const { priority } = req.query;
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (priority && priority !== 'all') {
      query = query.eq('priority', priority);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 添加任务
app.post('/api/tasks', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: '数据库未配置' });

    const { title, priority } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: '任务标题不能为空' });
    }
    if (!['高', '中', '低'].includes(priority)) {
      return res.status(400).json({ error: '优先级必须为 高/中/低' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title: title.trim(), priority, completed: false }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 切换完成状态
app.patch('/api/tasks/:id/toggle', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: '数据库未配置' });

    const { id } = req.params;
    // 先查当前状态
    const { data: current, error: fetchErr } = await supabase
      .from('tasks')
      .select('completed')
      .eq('id', id)
      .single();
    if (fetchErr) throw fetchErr;

    const { data, error } = await supabase
      .from('tasks')
      .update({ completed: !current.completed })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 删除任务
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: '数据库未配置' });

    const { id } = req.params;
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 仅在本地运行时启动监听；Vercel 部署时导出 app
const isLocal = process.env.NODE_ENV !== 'production' && !process.env.VERCEL;
if (isLocal) {
  app.listen(PORT, () => {
    console.log(`✅ 服务器运行在 http://localhost:${PORT}`);
  });
}

export default app;
