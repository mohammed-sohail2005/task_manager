/* ==========================================================================
   TaskPulse OS - Executive 3D Glassmorphism Dashboard Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'taskpulse_os_tasks_v3';

    // --- DOM Elements ---
    const glassCard = document.getElementById('glassCard');
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const emptyTitle = document.getElementById('emptyTitle');
    const emptySubtitle = document.getElementById('emptySubtitle');

    // Sidebar Nav Items
    const navItems = document.querySelectorAll('.nav-item');
    const navCountAll = document.getElementById('navCountAll');
    const navCountHigh = document.getElementById('navCountHigh');
    const navCountWork = document.getElementById('navCountWork');
    const navCountPersonal = document.getElementById('navCountPersonal');
    const navCountCompleted = document.getElementById('navCountCompleted');

    // Toolbar Elements
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const sortSelect = document.getElementById('sortSelect');
    const viewBtns = document.querySelectorAll('.view-btn');
    const catFilterPills = document.querySelectorAll('.cat-pill');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    // Hero & Metrics Displays
    const greetingHeading = document.getElementById('greetingHeading');
    const currentDate = document.getElementById('currentDate');
    const progressRingCircle = document.getElementById('progressRingCircle');
    const progressPercentage = document.getElementById('progressPercentage');
    const productivityGrade = document.getElementById('productivityGrade');

    const metricTotal = document.getElementById('metricTotal');
    const metricPending = document.getElementById('metricPending');
    const metricHigh = document.getElementById('metricHigh');
    const metricRate = document.getElementById('metricRate');
    const taskStatsSummary = document.getElementById('taskStatsSummary');

    // Toast Elements
    const undoToast = document.getElementById('undoToast');
    const undoBtn = document.getElementById('undoBtn');

    // --- State Variables ---
    let tasks = loadTasksFromStorage();
    let activeNavView = 'dashboard';
    let activeCategoryFilter = 'all';
    let activeViewMode = 'grid';
    let currentSort = 'date-desc';
    let searchQuery = '';
    let editingTaskId = null;
    let lastDeletedTask = null;
    let undoTimeout = null;

    // First Time Executive Demo Data
    if (tasks.length === 0 && !localStorage.getItem('taskpulse_os_visited')) {
        tasks = [
            { id: '1', text: 'Review quarterly cloud architecture & scalability 📊', category: 'work', priority: 'high', completed: false, createdAt: Date.now() },
            { id: '2', text: 'Deploy production v3.0 dashboard release', category: 'urgent', priority: 'high', completed: true, createdAt: Date.now() - 1000 },
            { id: '3', text: 'Conduct executive sync & sprint alignment meeting', category: 'work', priority: 'medium', completed: false, createdAt: Date.now() - 2000 },
            { id: '4', text: 'Daily fitness & personal wellness routine 🏃', category: 'personal', priority: 'low', completed: false, createdAt: Date.now() - 3000 },
            { id: '5', text: 'Finalize enterprise API security specs', category: 'project', priority: 'medium', completed: false, createdAt: Date.now() - 4000 }
        ];
        localStorage.setItem('taskpulse_os_visited', 'true');
        saveTasksToStorage();
    }

    // --- Initialize Date Header ---
    function initDateDisplay() {
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        const today = new Date().toLocaleDateString('en-US', options);
        currentDate.textContent = `${today} • Enterprise Focus Suite`;
    }

    // --- LocalStorage & Schema Migration ---
    function loadTasksFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('taskpulse_pro_tasks_v2') || localStorage.getItem('taskpulse_tasks_v1');
            if (!stored) return [];
            const parsed = JSON.parse(stored);
            return parsed.map(t => ({
                id: t.id || Date.now().toString(),
                text: t.text || '',
                completed: !!t.completed,
                category: t.category || 'work',
                priority: t.priority || 'medium',
                createdAt: t.createdAt || Date.now()
            }));
        } catch (e) {
            console.error('Failed to load tasks from storage', e);
            return [];
        }
    }

    function saveTasksToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error('Failed to save tasks', e);
        }
    }

    // --- Sorting Engine ---
    function sortTasks(taskListArray) {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return [...taskListArray].sort((a, b) => {
            if (currentSort === 'date-desc') return b.createdAt - a.createdAt;
            if (currentSort === 'date-asc') return a.createdAt - b.createdAt;
            if (currentSort === 'priority') return priorityOrder[b.priority] - priorityOrder[a.priority];
            if (currentSort === 'alpha') return a.text.localeCompare(b.text);
            return 0;
        });
    }

    // --- Main Task Renderer ---
    function renderTasks() {
        taskList.innerHTML = '';
        taskList.className = `task-list ${activeViewMode}-view`;

        const filtered = tasks.filter(task => {
            // Sidebar Navigation Filter
            if (activeNavView === 'high' && task.priority !== 'high') return false;
            if (activeNavView === 'work' && task.category !== 'work' && task.category !== 'project') return false;
            if (activeNavView === 'personal' && task.category !== 'personal') return false;
            if (activeNavView === 'completed' && !task.completed) return false;

            // Toolbar Category Filter
            if (activeCategoryFilter !== 'all' && task.category !== activeCategoryFilter) return false;

            // Search Keyword Filter
            if (searchQuery.trim() !== '') {
                return task.text.toLowerCase().includes(searchQuery.toLowerCase());
            }

            return true;
        });

        const sorted = sortTasks(filtered);

        if (sorted.length === 0) {
            emptyState.classList.remove('hidden');
            if (searchQuery.trim() !== '') {
                emptyTitle.textContent = 'No matching tasks found';
                emptySubtitle.textContent = `No tasks match search "${searchQuery}". Try a different keyword!`;
            } else if (activeNavView === 'high') {
                emptyTitle.textContent = 'No High Priority Tasks';
                emptySubtitle.textContent = 'Awesome! You have no urgent high priority items remaining.';
            } else {
                emptyTitle.textContent = 'No tasks in this view';
                emptySubtitle.textContent = 'Add a new task above or select another view from the sidebar.';
            }
        } else {
            emptyState.classList.add('hidden');
            sorted.forEach(task => {
                const card = createTaskElement(task);
                taskList.appendChild(card);
            });
        }

        updateMetricsAndProgress();
    }

    // --- Create Task Card DOM Element ---
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        const timeStr = formatTimeAgo(task.createdAt);

        if (editingTaskId === task.id) {
            // Inline Editing Form Mode
            li.innerHTML = `
                <div class="edit-input-wrapper">
                    <input type="text" class="edit-input" value="${escapeHTML(task.text)}" maxlength="140" id="editInput_${task.id}">
                    <div class="edit-actions">
                        <button class="edit-save-btn" title="Save changes (Enter)">✓</button>
                        <button class="edit-cancel-btn" title="Cancel (Esc)">✕</button>
                    </div>
                </div>
            `;

            setTimeout(() => {
                const input = li.querySelector('.edit-input');
                if (input) {
                    input.focus();
                    input.select();
                }
            }, 50);

            const saveBtn = li.querySelector('.edit-save-btn');
            const cancelBtn = li.querySelector('.edit-cancel-btn');
            const inputEl = li.querySelector('.edit-input');

            saveBtn.addEventListener('click', () => saveInlineEdit(task.id, inputEl.value));
            cancelBtn.addEventListener('click', cancelInlineEdit);

            inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') saveInlineEdit(task.id, inputEl.value);
                if (e.key === 'Escape') cancelInlineEdit();
            });

            return li;
        }

        // Standard Task Card Display Mode
        li.innerHTML = `
            <div class="task-top-row">
                <div class="task-left">
                    <div class="custom-checkbox" role="checkbox" aria-checked="${task.completed}" tabindex="0" title="Toggle completion">
                        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div class="task-content-box">
                        <span class="task-text"></span>
                        <div class="task-badges-row">
                            <span class="badge-tag ${task.category}">${task.category}</span>
                            <span class="badge-tag task-priority-badge ${task.priority}">${task.priority}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="task-bottom-row">
                <span class="task-meta">${timeStr}</span>
                <div class="task-actions">
                    <button class="action-icon-btn edit-btn" title="Edit task (Double click text)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="action-icon-btn delete-btn" title="Delete task">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        `;

        const textSpan = li.querySelector('.task-text');
        textSpan.textContent = task.text;
        textSpan.addEventListener('dblclick', () => startInlineEdit(task.id));

        const checkbox = li.querySelector('.custom-checkbox');
        checkbox.addEventListener('click', () => toggleTask(task.id));
        checkbox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTask(task.id);
            }
        });

        li.querySelector('.edit-btn').addEventListener('click', () => startInlineEdit(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id, li));

        return li;
    }

    // --- Formatters ---
    function formatTimeAgo(timestamp) {
        const diffMinutes = Math.floor((Date.now() - timestamp) / (1000 * 60));
        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // --- Task Actions ---
    function addTask(text, category, priority) {
        const trimmed = text.trim();
        if (!trimmed) return;

        const newTask = {
            id: Date.now().toString(),
            text: trimmed,
            category: category || 'work',
            priority: priority || 'medium',
            completed: false,
            createdAt: Date.now()
        };

        tasks.unshift(newTask);
        saveTasksToStorage();
        renderTasks();

        taskInput.value = '';
        taskInput.focus();
    }

    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        task.completed = !task.completed;
        saveTasksToStorage();

        const item = taskList.querySelector(`[data-id="${id}"]`);
        if (item) {
            item.classList.toggle('completed', task.completed);
        }

        updateMetricsAndProgress();
    }

    function startInlineEdit(id) {
        editingTaskId = id;
        renderTasks();
    }

    function saveInlineEdit(id, text) {
        const trimmed = text.trim();
        if (trimmed) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.text = trimmed;
                saveTasksToStorage();
            }
        }
        editingTaskId = null;
        renderTasks();
    }

    function cancelInlineEdit() {
        editingTaskId = null;
        renderTasks();
    }

    function deleteTask(id, element) {
        const index = tasks.findIndex(t => t.id === id);
        if (index === -1) return;

        lastDeletedTask = { task: tasks[index], index };

        if (element) {
            element.classList.add('deleting');
            setTimeout(() => {
                tasks.splice(index, 1);
                saveTasksToStorage();
                renderTasks();
                showUndoToast();
            }, 320);
        } else {
            tasks.splice(index, 1);
            saveTasksToStorage();
            renderTasks();
            showUndoToast();
        }
    }

    function undoLastDelete() {
        if (!lastDeletedTask) return;

        tasks.splice(lastDeletedTask.index, 0, lastDeletedTask.task);
        saveTasksToStorage();
        lastDeletedTask = null;

        if (undoTimeout) clearTimeout(undoTimeout);
        undoToast.classList.remove('show');

        renderTasks();
    }

    function showUndoToast() {
        if (undoTimeout) clearTimeout(undoTimeout);

        undoToast.classList.remove('show');
        void undoToast.offsetWidth;
        undoToast.classList.add('show');

        undoTimeout = setTimeout(() => {
            undoToast.classList.remove('show');
            lastDeletedTask = null;
        }, 3800);
    }

    function clearCompleted() {
        const completedElements = taskList.querySelectorAll('.task-item.completed');
        if (completedElements.length === 0) return;

        completedElements.forEach(el => el.classList.add('deleting'));

        setTimeout(() => {
            tasks = tasks.filter(t => !t.completed);
            saveTasksToStorage();
            renderTasks();
        }, 320);
    }

    // --- Executive Metrics & Productivity Score Calculation ---
    function updateMetricsAndProgress() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const active = total - completed;
        const highCount = tasks.filter(t => t.priority === 'high' && !t.completed).length;

        // Sidebar Nav Badges
        navCountAll.textContent = total;
        navCountHigh.textContent = tasks.filter(t => t.priority === 'high').length;
        navCountWork.textContent = tasks.filter(t => t.category === 'work' || t.category === 'project').length;
        navCountPersonal.textContent = tasks.filter(t => t.category === 'personal').length;
        navCountCompleted.textContent = completed;

        // Hero Metric Cards
        metricTotal.textContent = total;
        metricPending.textContent = active;
        metricHigh.textContent = highCount;

        const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
        metricRate.textContent = `${rate}%`;
        progressPercentage.textContent = `${rate}%`;

        // Productivity Grade Score
        let grade = 'A+';
        if (rate < 40) grade = 'D';
        else if (rate < 60) grade = 'C';
        else if (rate < 75) grade = 'B';
        else if (rate < 90) grade = 'A';
        else grade = 'A+';
        productivityGrade.textContent = total === 0 ? 'N/A' : grade;

        // SVG Progress Ring (r = 32, circumference = 2 * PI * 32 = 201.06)
        const circumference = 201.06;
        const offset = circumference - (rate / 100) * circumference;
        progressRingCircle.style.strokeDashoffset = offset;

        taskStatsSummary.textContent = `${active} active deliverable${active === 1 ? '' : 's'} remaining`;
    }

    // --- 3D Parallax Tilt Effect ---
    function init3DTilt() {
        let bounds;

        function updateBounds() {
            bounds = glassCard.getBoundingClientRect();
        }

        document.addEventListener('mousemove', (e) => {
            if (!bounds) updateBounds();

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const cardCenterX = bounds.left + bounds.width / 2;
            const cardCenterY = bounds.top + bounds.height / 2;

            const deltaX = (mouseX - cardCenterX) / (window.innerWidth / 2);
            const deltaY = (mouseY - cardCenterY) / (window.innerHeight / 2);

            const rotateX = (-deltaY * 8).toFixed(2);
            const rotateY = (deltaX * 8).toFixed(2);

            glassCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            const shineX = ((mouseX - bounds.left) / bounds.width) * 100;
            const shineY = ((mouseY - bounds.top) / bounds.height) * 100;
            glassCard.style.setProperty('--mouse-x', `${shineX}%`);
            glassCard.style.setProperty('--mouse-y', `${shineY}%`);
        });

        window.addEventListener('resize', updateBounds);
        document.addEventListener('mouseleave', () => {
            glassCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }

    // --- Event Listeners ---
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.querySelector('input[name="categoryOption"]:checked')?.value || 'work';
        const priority = document.querySelector('input[name="priorityOption"]:checked')?.value || 'medium';
        addTask(taskInput.value, category, priority);
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            activeNavView = item.dataset.nav;

            // Update Header Title based on Nav Selection
            const titles = {
                dashboard: 'Executive Dashboard',
                high: 'High Priority Vault',
                work: 'Work & Projects',
                personal: 'Personal Focus',
                completed: 'Completed Archive'
            };
            greetingHeading.textContent = titles[activeNavView] || 'Executive Dashboard';

            renderTasks();
        });
    });

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeViewMode = btn.dataset.view;
            renderTasks();
        });
    });

    catFilterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            catFilterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeCategoryFilter = pill.dataset.catFilter;
            renderTasks();
        });
    });

    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderTasks();
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        clearSearchBtn.classList.toggle('hidden', searchQuery === '');
        renderTasks();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        renderTasks();
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);
    undoBtn.addEventListener('click', undoLastDelete);

    // --- Init ---
    initDateDisplay();
    init3DTilt();
    renderTasks();
});
