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
    const notesList = document.getElementById("notesList");
    let selectedDate = new Date();
    let tasks = {};

    let currentDate = new Date();

    const TIMELINE_START = new Date(2025, 2, 1); // March 1 2025
    const TIMELINE_END = new Date(2027, 0, 29); // January 29 2027
    const MILESTONES = [
        { 
            date: new Date(2025, 4, 31), // May 31 2025
            title: "Front-end Development Mastery",
            description: "Complete front-end web development with full English proficiency (HTML, CSS, JavaScript, React) - Inshallah"
        },
        { 
            date: new Date(2025, 5, 1), // June 1 2025
            title: "Front-end Job Preparation Phase",
            description: "Intensive preparation for front-end developer positions (June 1-30 2025) - Resume, portfolio, interviews practice - Inshallah"
        },
        { 
            date: new Date(2025, 6, 1), // July 1 2025
            title: "Secure Front-end Position",
            description: "Obtain full-time front-end developer role with competitive salary - Inshallah"
        },
        { 
            date: new Date(2025, 5, 1), // June 1 2025
            title: "Full Stack Development Journey",
            description: "Begin full stack development studies (Node.js, Databases, APIs) through November 30 2025 - Inshallah"
        },
        { 
            date: new Date(2025, 10, 30), // November 30 2025
            title: "Full Stack Mastery Achieved",
            description: "Complete advanced full stack development curriculum - Inshallah"
        },
        { 
            date: new Date(2025, 11, 1), // December 1 2025
            title: "Full Stack Job Preparation",
            description: "December 2025 intensive job search preparation for full stack roles - Inshallah"
        },
        { 
            date: new Date(2026, 0, 1), // January 1 2026
            title: "Secure Full Stack Position",
            description: "Begin full-time full stack developer role with architecture responsibilities - Inshallah"
        },
        { 
            date: new Date(2026, 0, 1), // January 1 2026
            title: "AI Engineering Launch",
            description: "Start AI/ML engineering studies alongside professional work - Continuous learning path - Inshallah"
        },
        { 
            date: new Date(2026, 0, 1), // January 1 2026
            title: "AI Product Development",
            description: "Begin building AI-powered SaaS products and intelligent agents - Inshallah"
        },
        { 
            date: new Date(2027, 0, 1), // January 1 2027
            title: "AI Startup Launch",
            description: "Official launch of AI startup solving real-world problems with revenue potential - Inshallah"
        },
        { 
            date: new Date(2027, 0, 29), // January 29 2027
            title: "Important",
            description: "Inshallah"
        }
    ];

    function renderCalendar() {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        calendarDays.innerHTML = "";
        
        let year = currentYear;
        let month = currentMonth;
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
            let dayClass = "p-2 text-center rounded-lg cursor-pointer relative overflow-hidden";
            
            let today = new Date();
            
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayClass += " text-white shadow-lg shadow-blue-500/40";
            } else {
                dayClass += " text-slate-200/80 hover:bg-slate-800/20";
            }

            if (isWeekend) {
                dayClass += " bg-purple-600/20 text-purple-300/80";
            }

            if (selectedDate && dayDate.getTime() === selectedDate.getTime()) {
                dayClass += " bg-gradient-to-br from-emerald-600/60 to-cyan-600/60 shadow-lg shadow-emerald-500/30";
            }

            // Timeline highlighting
            if (dayDate >= TIMELINE_START && dayDate <= TIMELINE_END) {
                dayClass += " bg-gradient-to-br from-purple-500/20 to-pink-500/20";
            }

            // Add cross symbol for end date
            let dayContent = `${day}`;
            if (dayDate.getTime() === TIMELINE_END.getTime()) {
                dayContent += '<span class="absolute top-0 right-0 text-red-500/80 text-xs">✕</span>';
            }

            // Add milestone tooltips
            const milestone = MILESTONES.find(m => 
                m.date.getFullYear() === dayDate.getFullYear() &&
                m.date.getMonth() === dayDate.getMonth() &&
                m.date.getDate() === dayDate.getDate()
            );

            if (milestone) {
                dayClass += " relative group";
                dayContent += `
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block
                                bg-slate-900/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs
                                border border-cyan-500/20 w-48 text-center z-10">
                        <div class="text-cyan-400/80 font-medium">${milestone.title}</div>
                    </div>
                `;
            }

            calendarDays.innerHTML += `
                <div class="${dayClass}" data-day="${day}">
                    ${dayContent}
                </div>`;
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
        if (!todoInput.value.trim()) return;
        const dateKey = selectedDate.toISOString().split('T')[0];
        tasks[dateKey] = [...(tasks[dateKey] || []), { text: todoInput.value.trim(), completed: false }];
        todoInput.value = "";
        displayTasks();
        
        // Add animation feedback
        todoInput.animate([
            { transform: 'translateY(0)', opacity: 1 },
            { transform: 'translateY(-5px)', opacity: 0.5 },
            { transform: 'translateY(0)', opacity: 1 }
        ], { duration: 300 });
    }

    function toggleTask(dateKey, index) {
        tasks[dateKey][index].completed = !tasks[dateKey][index].completed;
        displayTasks();
    }

    function deleteTask(dateKey, index) {
        tasks[dateKey].splice(index, 1);
        displayTasks();
    }

    function displayImportantDates() {
        notesList.innerHTML = MILESTONES.map(milestone => `
            <div class="milestone-item bg-gradient-to-r from-slate-800/40 to-slate-900/40 p-4 rounded-xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all">
                <div class="flex items-start">
                    <div class="w-1 bg-emerald-400 h-full rounded-full mr-3"></div>
                    <div class="flex-1">
                        <div class="text-emerald-400/90 font-semibold text-sm">🌟 ${milestone.title}</div>
                        <div class="text-slate-400/80 text-xs mt-1">
                            ${milestone.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div class="text-slate-300/70 text-xs mt-2 leading-relaxed">
                            ${milestone.description}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

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
            // Add selection animation
            e.target.animate([
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(0.95)', opacity: 0.8 },
                { transform: 'scale(1)', opacity: 1 }
            ], { duration: 300, easing: 'ease-out' });
            
            selectedDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                e.target.dataset.day
            );
            const dateString = selectedDate.toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
            });
            
            selectedDateElement.textContent = dateString;
            renderCalendar();
            displayTasks();
            displayImportantDates();
        }
    });

    addTodoBtn.addEventListener("click", addTask);
    todoInput.addEventListener("keypress", (e) => e.key === 'Enter' && addTask());

    prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    monthSelect.addEventListener("change", () => {
        currentDate.setMonth(parseInt(monthSelect.value));
        renderCalendar();
    });

    yearInput.addEventListener("change", () => {
        const newYear = parseInt(yearInput.value);
        if (!isNaN(newYear) && newYear > 0) {
            currentDate.setFullYear(newYear);
            renderCalendar();
        }
    });

    renderCalendar();
    displayImportantDates();

    function updateTimeline() {
        const now = new Date();
        
        // Calculate time differences
        const totalMs = TIMELINE_END - TIMELINE_START;
        const elapsedMs = Math.max(0, now - TIMELINE_START);
        const remainingMs = Math.max(0, TIMELINE_END - now);

        // Calculate years, months, and days
        const years = Math.floor(remainingMs / (1000 * 60 * 60 * 24 * 365.25));
        const months = Math.floor((remainingMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
        const days = Math.floor((remainingMs % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        
        // Calculate total values
        const totalDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const remainingDays = totalDays % 7;
        const totalMonths = Math.floor(totalDays / 30.44);
        const monthDays = Math.floor(totalDays % 30.44);

        // Update the metrics
        document.getElementById('yearsMetric').textContent = 
            `${years} years ${months} months ${days} days`;
        document.getElementById('monthsMetric').textContent = 
            `${totalMonths} months ${monthDays} days`;
        document.getElementById('weeksMetric').textContent = 
            `${totalWeeks} weeks ${remainingDays} days`;
        document.getElementById('totalDaysMetric').textContent = 
            `${totalDays} days`;
    }

    updateTimeline(); // Initial call
    setInterval(updateTimeline, 1000 * 60); // Update every minute
});