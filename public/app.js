// 智能任务管理 - 前端直连 Supabase
const SUPABASE_URL = 'https://cicolrgljvsltconotff.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_04WSy2GR_L1VTuxGi5MXKQ_xkKHIQaA';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskCount = document.getElementById('taskCount');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

// 中文优先级 -> CSS 样式类名
const priorityClass = { '高': 'high', '中': 'medium', '低': 'low' };

// 加载任务
async function loadTasks() {
  try {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (currentFilter !== 'all') {
      query = query.eq('priority', currentFilter);
    }

    const { data, error } = await query;
    if (error) throw error;
    renderTasks(data || []);
  } catch (err) {
    alert('加载任务失败：' + err.message);
  }
}

// 渲染任务列表
function renderTasks(tasks) {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    emptyState.style.display = 'block';
    taskCount.textContent = '';
    return;
  }
  emptyState.style.display = 'none';
  taskCount.textContent = `共 ${tasks.length} 项`;

  tasks.forEach((task) => {
    const cssClass = priorityClass[task.priority] || 'medium';
    const li = document.createElement('li');
    li.className = `task-item priority-${cssClass}${task.completed ? ' completed' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <span class="priority-badge ${cssClass}">${task.priority}</span>
      <span class="task-title"></span>
      <button class="toggle-btn">${task.completed ? '已完成' : '标记完成'}</button>
      <button class="delete-btn">删除</button>
    `;
    li.querySelector('.task-title').textContent = task.title;

    // 切换完成状态
    li.querySelector('.toggle-btn').addEventListener('click', async () => {
      await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', task.id);
      loadTasks();
    });

    // 删除
    li.querySelector('.delete-btn').addEventListener('click', async () => {
      if (confirm('确定删除这条任务吗？')) {
        await supabase.from('tasks').delete().eq('id', task.id);
        loadTasks();
      }
    });

    taskList.appendChild(li);
  });
}

// 添加任务
async function addTask() {
  const title = taskInput.value.trim();
  const priority = prioritySelect.value;
  if (!title) {
    taskInput.focus();
    return;
  }
  await supabase.from('tasks').insert([{ title, priority, completed: false }]);
  taskInput.value = '';
  taskInput.focus();
  loadTasks();
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

// 筛选
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.remove('active');
    btn.classList.add('active');
    currentFilter = btn.dataset.priority;
    loadTasks();
  });
});

// 初始化
loadTasks();
