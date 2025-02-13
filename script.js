document.addEventListener("DOMContentLoaded", function () {
    const calendarDays = document.getElementById("calendarDays");
    const currentMonthElement = document.getElementById("currentMonth");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    const monthSelect = document.getElementById("monthSelect");
    const yearInput = document.getElementById("yearInput");
    const todoInput = document.getElementById("todoInput");
    const addTodoBtn = document.getElementById("addTodo");
    const todoList = document.getElementById("todoList");
    const selectedDateElement = document.getElementById("selectedDate");
    const noteInput = document.getElementById("noteInput");
    const addNoteBtn = document.getElementById("addNote");
    const notesList = document.getElementById("notesList");
    const notesDateElement = document.getElementById("notesDate");
    let selectedDate = null;
    let tasks = {};
    let notes = {};

    let currentDate = new Date();
    
    function renderCalendar() {
        calendarDays.innerHTML = "";
        
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth();
        let firstDay = new Date(year, month, 1).getDay();
        let lastDate = new Date(year, month + 1, 0).getDate();

        currentMonthElement.textContent = currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
        });

        // Populate month dropdown
        if (!monthSelect.options.length) {
            for (let i = 0; i < 12; i++) {
                const monthName = new Date(year, i).toLocaleString('default', { month: 'long' });
                monthSelect.innerHTML += `<option value="${i}">${monthName}</option>`;
            }
        }
        monthSelect.value = month;
        yearInput.value = year;

        for (let i = 0; i < firstDay; i++) {
            calendarDays.innerHTML += `<div></div>`;
        }

        for (let day = 1; day <= lastDate; day++) {
            const dayDate = new Date(year, month, day);
            const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
            let dayClass = "p-2 text-center rounded-lg cursor-pointer";
            
            let today = new Date();
            
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayClass += " bg-blue-600/60 text-white shadow-lg shadow-blue-500/20";
            } else {
                dayClass += " text-slate-200/80 hover:bg-slate-800/20";
            }

            if (isWeekend) {
                dayClass += " bg-purple-600/20 text-purple-300/80";
            }

            if (selectedDate && dayDate.getTime() === selectedDate.getTime()) {
                dayClass += " bg-emerald-600/60 text-white shadow-lg shadow-emerald-500/20";
            }

            calendarDays.innerHTML += `<div class="${dayClass} transition-all duration-300 p-3 rounded-xl backdrop-blur-sm" 
                data-day="${day}">${day}</div>`;
        }
    }

    function displayTasks() {
        todoList.innerHTML = "";
        if (!selectedDate) return;
        
        const dateKey = selectedDate.toISOString().split('T')[0];
        (tasks[dateKey] || []).forEach((task, index) => {
            const taskElement = document.createElement("div");
            taskElement.className = `flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 ${task.completed ? 'opacity-60' : ''}`;
            taskElement.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                       class="checkbox checkbox-sm border-slate-600/80 bg-slate-800/30">
                <span class="flex-1 text-slate-200/80 ${task.completed ? 'line-through' : ''}">${task.text}</span>
                <button class="btn btn-xs btn-ghost text-red-400/80 hover:text-red-400">✕</button>
            `;
            
            const checkbox = taskElement.querySelector('input[type="checkbox"]');
            const deleteBtn = taskElement.querySelector('button');
            
            checkbox.addEventListener('change', () => toggleTask(dateKey, index));
            deleteBtn.addEventListener('click', () => deleteTask(dateKey, index));
            
            todoList.appendChild(taskElement);
        });
    }

    function addTask() {
        if (!selectedDate || !todoInput.value.trim()) return;
        const dateKey = selectedDate.toISOString().split('T')[0];
        tasks[dateKey] = [...(tasks[dateKey] || []), { text: todoInput.value.trim(), completed: false }];
        todoInput.value = "";
        displayTasks();
    }

    function toggleTask(dateKey, index) {
        tasks[dateKey][index].completed = !tasks[dateKey][index].completed;
        displayTasks();
    }

    function deleteTask(dateKey, index) {
        tasks[dateKey].splice(index, 1);
        displayTasks();
    }

    function displayNotes() {
        notesList.innerHTML = "";
        if (!selectedDate) return;
        
        const dateKey = selectedDate.toISOString().split('T')[0];
        (notes[dateKey] || []).forEach((note, index) => {
            const noteElement = document.createElement("div");
            noteElement.className = "group relative p-4 rounded-lg bg-slate-800/30 border border-slate-700/30";
            noteElement.innerHTML = `
                <p class="text-slate-200/80 whitespace-pre-wrap">${note}</p>
                <button class="absolute -top-2 -right-2 btn btn-circle btn-xs btn-ghost text-red-400/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    ✕
                </button>
            `;
            
            noteElement.querySelector('button').addEventListener('click', () => deleteNote(dateKey, index));
            notesList.appendChild(noteElement);
        });
    }

    function addNote() {
        if (!selectedDate || !noteInput.value.trim()) return;
        const dateKey = selectedDate.toISOString().split('T')[0];
        notes[dateKey] = [...(notes[dateKey] || []), noteInput.value.trim()];
        noteInput.value = "";
        displayNotes();
    }

    function deleteNote(dateKey, index) {
        notes[dateKey].splice(index, 1);
        displayNotes();
    }

    prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    monthSelect.addEventListener("change", () => {
        currentDate.setMonth(monthSelect.value);
        renderCalendar();
    });

    yearInput.addEventListener("change", () => {
        currentDate.setFullYear(yearInput.value);
        renderCalendar();
    });

    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('liveClock').textContent = timeString;
    }

    setInterval(updateClock, 1000);
    updateClock(); // Initial call

    calendarDays.addEventListener("click", (e) => {
        if (e.target.dataset.day) {
            selectedDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                e.target.dataset.day
            );
            const dateString = selectedDate.toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
            });
            selectedDateElement.textContent = dateString;
            notesDateElement.textContent = dateString;
            renderCalendar();
            displayTasks();
            displayNotes();
        }
    });

    addTodoBtn.addEventListener("click", addTask);
    todoInput.addEventListener("keypress", (e) => e.key === 'Enter' && addTask());
    addNoteBtn.addEventListener("click", addNote);

    renderCalendar();
});

// In renderCalendar function, update dayClass to:
let dayClass = "p-1 sm:p-2 text-center rounded-lg cursor-pointer";