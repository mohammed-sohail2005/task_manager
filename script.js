/* ==========================================================================
   TaskPulse Pro 3D - Modern JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'taskpulse_pro_tasks_v2';

    // --- DOM Elements ---
    const glassCard = document.getElementById('glassCard');
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const emptyTitle = document.getElementById('emptyTitle');
    const emptySubtitle = document.getElementById('emptySubtitle');

    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const sortSelect = document.getElementById('sortSelect');

    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    const progressRingCircle = document.getElementById('progressRingCircle');
    const progressPercentage = document.getElementById('progressPercentage');

    // Metric Displays
    const metricTotal = document.getElementById('metricTotal');
    const metricPending = document.getElementById('metricPending');
    const metricHigh = document.getElementById('metricHigh');
    const metricCompleted = document.getElementById('metricCompleted');

    const countAll = document.getElementById('countAll');
    const countActive = document.getElementById('countActive');
    const countCompleted = document.getElementById('countCompleted');
    const countHighFilter = document.getElementById('countHighFilter');
    const taskStatsSummary = document.getElementById('taskStatsSummary');
    const currentDate = document.getElementById('currentDate');

    // Undo Toast Elements
    const undoToast = document.getElementById('undoToast');
    const undoBtn = document.getElementById('undoBtn');

    // --- State Variables ---
    let tasks = loadTasksFromStorage();
    let currentFilter = 'all';
    let currentSort = 'date-desc';
    let searchQuery = '';
    let editingTaskId = null;
    let lastDeletedTask = null;
    let undoTimeout = null;

    // Default Demo Tasks for First-time Users
    if (tasks.length === 0 && !localStorage.getItem('taskpulse_pro_visited')) {
        tasks = [
            { id: '1', text: 'Review quarterly architecture proposal 📊', priority: 'high', completed: false, createdAt: Date.now() },
            { id: '2', text: 'Deploy production v2.4 build to server', priority: 'high', completed: true, createdAt: Date.now() - 1000 },
            { id: '3', text: 'Conduct team sync & sprint planning', priority: 'medium', completed: false, createdAt: Date.now() - 2000 },
            { id: '4', text: 'Update project documentation & API specs', priority: 'low', completed: false, createdAt: Date.now() - 3000 }
        ];
        localStorage.setItem('taskpulse_pro_visited', 'true');
        saveTasksToStorage();
    }

    // --- Initialize Date Header ---
    function initDateDisplay() {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        const today = new Date().toLocaleDateString('en-US', options);
        currentDate.textContent = `${today} • Executive Productivity`;
    }

    // --- LocalStorage Persistence & Schema Migration ---
    function loadTasksFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('taskpulse_tasks_v1');
            if (!stored) return [];
            const parsed = JSON.parse(stored);
            // Schema migration: default missing priority to 'medium'
            return parsed.map(task => ({
                id: task.id || Date.now().toString(),
                text: task.text || '',
                completed: !!task.completed,
                priority: task.priority || 'medium',
                createdAt: task.createdAt || Date.now()
            }));
        } catch (e) {
            console.error('Failed to load tasks', e);
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
    function sortTaskList(taskListArray) {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return [...taskListArray].sort((a, b) => {
            if (currentSort === 'date-desc') return b.createdAt - a.createdAt;
            if (currentSort === 'date-asc') return a.createdAt - b.createdAt;
            if (currentSort === 'priority') return priorityOrder[b.priority] - priorityOrder[a.priority];
            if (currentSort === 'alpha') return a.text.localeCompare(b.text);
            return 0;
        });
    }

    // --- Task Rendering Engine ---
    function renderTasks() {
        taskList.innerHTML = '';

        let filtered = tasks.filter(task => {
            // Priority & Status Filters
            if (currentFilter === 'active' && task.completed) return false;
            if (currentFilter === 'completed' && !task.completed) return false;
            if (currentFilter === 'high' && task.priority !== 'high') return false;

            // Search Query Filter
            if (searchQuery.trim() !== '') {
                return task.text.toLowerCase().includes(searchQuery.toLowerCase());
            }

            return true;
        });

        const sortedAndFiltered = sortTaskList(filtered);

        if (sortedAndFiltered.length === 0) {
            emptyState.classList.remove('hidden');
            if (searchQuery.trim() !== '') {
                emptyTitle.textContent = 'No matching tasks found';
                emptySubtitle.textContent = `No tasks match your search "${searchQuery}". Try a different keyword!`;
            } else if (currentFilter === 'high') {
                emptyTitle.textContent = 'No High Priority Tasks';
                emptySubtitle.textContent = 'Great job! You have no urgent high priority items pending.';
            } else if (currentFilter === 'completed') {
                emptyTitle.textContent = 'No Completed Tasks';
                emptySubtitle.textContent = 'Completed tasks will appear here once you check them off.';
            } else {
                emptyTitle.textContent = 'All tasks completed!';
                emptySubtitle.textContent = 'You have no tasks pending right now. Add a task above to stay productive!';
            }
        } else {
            emptyState.classList.add('hidden');
            sortedAndFiltered.forEach(task => {
                const taskCard = createTaskCardElement(task);
                taskList.appendChild(taskCard);
            });
        }

        updateMetricsAndProgress();
    }

    // --- Create Task Card Element ---
    function createTaskCardElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        const timeString = formatFormattedDate(task.createdAt);

        if (editingTaskId === task.id) {
            // Render Inline Editing Form State
            li.classList.add('editing-state');
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
            const editInput = li.querySelector('.edit-input');

            saveBtn.addEventListener('click', () => saveInlineEdit(task.id, editInput.value));
            cancelBtn.addEventListener('click', cancelInlineEdit);

            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') saveInlineEdit(task.id, editInput.value);
                if (e.key === 'Escape') cancelInlineEdit();
            });

            return li;
        }

        // Standard Task Card Display State
        li.innerHTML = `
            <div class="task-left">
                <div class="custom-checkbox" role="checkbox" aria-checked="${task.completed}" tabindex="0" title="Toggle completion">
                    <svg viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <div class="task-content-box">
                    <div class="task-header-row">
                        <span class="task-text"></span>
                        <span class="task-priority-badge ${task.priority}">${task.priority}</span>
                    </div>
                    <span class="task-meta">Added ${timeString}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="action-icon-btn edit-btn" title="Edit task (Double-click text)" aria-label="Edit task">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="action-icon-btn delete-btn" title="Delete task" aria-label="Delete task">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;

        // Prevent XSS
        const textSpan = li.querySelector('.task-text');
        textSpan.textContent = task.text;

        // Double Click to Edit
        textSpan.addEventListener('dblclick', () => startInlineEdit(task.id));

        // Checkbox Click
        const checkbox = li.querySelector('.custom-checkbox');
        checkbox.addEventListener('click', () => toggleTask(task.id));
        checkbox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTask(task.id);
            }
        });

        // Edit Button
        const editBtn = li.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => startInlineEdit(task.id));

        // Delete Button
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id, li));

        return li;
    }

    // --- Helper Formatters ---
    function formatFormattedDate(timestamp) {
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
    function addTask(text, priority) {
        const trimmed = text.trim();
        if (!trimmed) return;

        const newTask = {
            id: Date.now().toString(),
            text: trimmed,
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

        if (currentFilter !== 'all') {
            setTimeout(renderTasks, 200);
        } else {
            updateMetricsAndProgress();
        }
    }

    function startInlineEdit(id) {
        editingTaskId = id;
        renderTasks();
    }

    function saveInlineEdit(id, newText) {
        const trimmed = newText.trim();
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

        const taskToDelete = tasks[index];
        lastDeletedTask = { task: taskToDelete, index };

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

    // --- Executive Metrics & 3D Progress Ring Calculation ---
    function updateMetricsAndProgress() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const active = total - completed;
        const highPriorityCount = tasks.filter(t => t.priority === 'high' && !t.completed).length;

        // Metric Cards
        metricTotal.textContent = total;
        metricPending.textContent = active;
        metricHigh.textContent = highPriorityCount;
        metricCompleted.textContent = completed;

        // Counter Badges
        countAll.textContent = total;
        countActive.textContent = active;
        countCompleted.textContent = completed;
        countHighFilter.textContent = tasks.filter(t => t.priority === 'high').length;

        taskStatsSummary.textContent = `${active} focus task${active === 1 ? '' : 's'} remaining`;

        // 3D Progress Ring (r = 30, circumference = 2 * PI * 30 = 188.495)
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        progressPercentage.textContent = `${percentage}%`;

        const circumference = 188.495;
        const offset = circumference - (percentage / 100) * circumference;
        progressRingCircle.style.strokeDashoffset = offset;
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

            const rotateX = (-deltaY * 10).toFixed(2);
            const rotateY = (deltaX * 10).toFixed(2);

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
        const selectedPriority = document.querySelector('input[name="priorityOption"]:checked')?.value || 'medium';
        addTask(taskInput.value, selectedPriority);
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
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
