/* ==========================================================================
   TaskPulse 3D - Modern JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- LocalStorage Key ---
    const STORAGE_KEY = 'taskpulse_tasks_v1';

    // --- DOM Elements ---
    const glassCard = document.getElementById('glassCard');
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    const progressRingCircle = document.getElementById('progressRingCircle');
    const progressPercentage = document.getElementById('progressPercentage');

    const countAll = document.getElementById('countAll');
    const countActive = document.getElementById('countActive');
    const countCompleted = document.getElementById('countCompleted');
    const taskStatsSummary = document.getElementById('taskStatsSummary');
    const currentDate = document.getElementById('currentDate');

    // --- Initial State ---
    let tasks = loadTasksFromStorage();
    let currentFilter = 'all';

    // Default demo tasks if first time user
    if (tasks.length === 0 && !localStorage.getItem('taskpulse_has_visited')) {
        tasks = [
            { id: '1', text: 'Welcome to TaskPulse 3D! 🚀', completed: false, createdAt: Date.now() },
            { id: '2', text: 'Click the checkmark to complete a task', completed: true, createdAt: Date.now() - 1000 },
            { id: '3', text: 'Hover over task cards to feel the 3D elevation', completed: false, createdAt: Date.now() - 2000 }
        ];
        localStorage.setItem('taskpulse_has_visited', 'true');
        saveTasksToStorage();
    }

    // --- Date Display ---
    function initDateDisplay() {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        const today = new Date().toLocaleDateString('en-US', options);
        currentDate.textContent = `${today} • Daily Focus`;
    }

    // --- LocalStorage Helpers ---
    function loadTasksFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load tasks from localStorage', e);
            return [];
        }
    }

    function saveTasksToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error('Failed to save tasks to localStorage', e);
        }
    }

    // --- Task Rendering Engine ---
    function renderTasks() {
        taskList.innerHTML = '';

        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true; // 'all'
        });

        if (filteredTasks.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            filteredTasks.forEach(task => {
                const taskElement = createTaskDOMElement(task);
                taskList.appendChild(taskElement);
            });
        }

        updateStatsAndProgress();
    }

    // --- Create Task Item DOM Element ---
    function createTaskDOMElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        li.innerHTML = `
            <div class="task-left">
                <div class="custom-checkbox" role="checkbox" aria-checked="${task.completed}" tabindex="0" title="Toggle task completion">
                    <svg viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <span class="task-text"></span>
            </div>
            <button class="delete-btn" title="Delete task" aria-label="Delete task">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        `;

        // Safely insert text content to prevent XSS
        li.querySelector('.task-text').textContent = task.text;

        // Toggle Checkbox Event Listener
        const checkbox = li.querySelector('.custom-checkbox');
        checkbox.addEventListener('click', () => toggleTask(task.id));
        checkbox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTask(task.id);
            }
        });

        // Delete Button Event Listener
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id, li));

        return li;
    }

    // --- Task Actions ---
    function addTask(text) {
        const trimmedText = text.trim();
        if (!trimmedText) return;

        const newTask = {
            id: Date.now().toString(),
            text: trimmedText,
            completed: false,
            createdAt: Date.now()
        };

        tasks.unshift(newTask);
        saveTasksToStorage();

        // Render with entry animation
        renderTasks();

        taskInput.value = '';
        taskInput.focus();
    }

    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        task.completed = !task.completed;
        saveTasksToStorage();

        const taskItem = taskList.querySelector(`[data-id="${id}"]`);
        if (taskItem) {
            taskItem.classList.toggle('completed', task.completed);
            const checkbox = taskItem.querySelector('.custom-checkbox');
            checkbox.setAttribute('aria-checked', task.completed);
        }

        // Re-render if in active or completed filter view to maintain filter integrity
        if (currentFilter !== 'all') {
            setTimeout(renderTasks, 200);
        } else {
            updateStatsAndProgress();
        }
    }

    function deleteTask(id, element) {
        // Trigger 3D slide-out exit animation
        if (element) {
            element.classList.add('deleting');
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== id);
                saveTasksToStorage();
                renderTasks();
            }, 320);
        } else {
            tasks = tasks.filter(t => t.id !== id);
            saveTasksToStorage();
            renderTasks();
        }
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

    // --- Stats & 3D Progress Ring Calculation ---
    function updateStatsAndProgress() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const active = total - completed;

        // Update Counter Badges
        countAll.textContent = total;
        countActive.textContent = active;
        countCompleted.textContent = completed;

        // Footer Text
        taskStatsSummary.textContent = `${active} task${active === 1 ? '' : 's'} remaining`;

        // Progress Percentage
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        progressPercentage.textContent = `${percentage}%`;

        // SVG Ring Dashoffset Calculation (r = 28, circumference = 2 * PI * 28 = 175.929)
        const circumference = 175.929;
        const offset = circumference - (percentage / 100) * circumference;
        progressRingCircle.style.strokeDashoffset = offset;
    }

    // --- 3D Glass Card Tilt Effect ---
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
        });

        window.addEventListener('resize', updateBounds);
        document.addEventListener('mouseleave', () => {
            glassCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }

    // --- Event Listeners ---
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value);
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);

    // --- Initialize App ---
    initDateDisplay();
    init3DTilt();
    renderTasks();
});
