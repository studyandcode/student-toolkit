let tasks = JSON.parse(localStorage.getItem("studyPlannerTasks")) || [];

let dailyGoal =
    parseFloat(localStorage.getItem("studyPlannerGoal")) || 0;

let customization =
    JSON.parse(localStorage.getItem("studyPlannerCustomization")) || {
        theme: "pink",
        sticker: "🎀"
    };

let editingTaskId = null;


/* -------------------------
   INITIAL SETUP
------------------------- */

document.addEventListener("DOMContentLoaded", function () {

    applyCustomization();

    loadDailyGoal();

    setTodayDate();

    renderAll();

    document
        .getElementById("taskForm")
        .addEventListener("submit", handleTaskSubmit);

    document
        .getElementById("taskFilter")
        .addEventListener("change", renderAllTasks);

    document
        .getElementById("themeButton")
        .addEventListener("click", toggleCustomization);

});


/* -------------------------
   CUSTOMIZATION
------------------------- */

function toggleCustomization() {

    const panel =
        document.getElementById("customizationPanel");

    panel.classList.toggle("hidden");
}


function saveCustomization() {

    const theme =
        document.getElementById("themeColor").value;

    const sticker =
        document.getElementById("plannerSticker").value;


    customization = {
        theme: theme,
        sticker: sticker
    };


    localStorage.setItem(
        "studyPlannerCustomization",
        JSON.stringify(customization)
    );


    applyCustomization();

    document
        .getElementById("customizationPanel")
        .classList.add("hidden");
}


function applyCustomization() {

    document.body.className =
        "theme-" + customization.theme;


    document.getElementById("currentSticker").textContent =
        customization.sticker;


    document.getElementById("themeColor").value =
        customization.theme;


    document.getElementById("plannerSticker").value =
        customization.sticker;
}


/* -------------------------
   DAILY GOAL
------------------------- */

function saveDailyGoal() {

    const input =
        document.getElementById("dailyGoal");

    const value =
        parseFloat(input.value);


    if (isNaN(value) || value < 0) {

        alert("Please enter a valid study goal.");

        return;
    }


    dailyGoal = value;


    localStorage.setItem(
        "studyPlannerGoal",
        dailyGoal
    );


    updateDailyProgress();
}


function loadDailyGoal() {

    document.getElementById("dailyGoal").value =
        dailyGoal || "";
}


/* -------------------------
   DATE
------------------------- */

function setTodayDate() {

    const today =
        new Date().toISOString().split("T")[0];


    document.getElementById("taskDate").value =
        today;
}


/* -------------------------
   TASK FORM
------------------------- */

function handleTaskSubmit(event) {

    event.preventDefault();


    const subject =
        document.getElementById("subject").value.trim();

    const taskName =
        document.getElementById("taskName").value.trim();

    const date =
        document.getElementById("taskDate").value;

    const studyTime =
        parseFloat(
            document.getElementById("taskTime").value
        );

    const priority =
        document.getElementById("priority").value;

    const sticker =
        document.getElementById("taskSticker").value;

    const color =
        document.getElementById("taskColor").value;


    if (
        !subject ||
        !taskName ||
        !date ||
        isNaN(studyTime) ||
        studyTime <= 0
    ) {

        alert("Please complete all required fields.");

        return;
    }


    if (editingTaskId !== null) {

        const task =
            tasks.find(
                task => task.id === editingTaskId
            );


        if (task) {

            task.subject = subject;
            task.name = taskName;
            task.date = date;
            task.studyTime = studyTime;
            task.priority = priority;
            task.sticker = sticker;
            task.color = color;
        }


        editingTaskId = null;


        document.querySelector(
            "#taskForm .add-task-button"
        ).textContent =
            "+ Add Study Task";

    } else {

        const newTask = {

            id: Date.now(),

            subject: subject,

            name: taskName,

            date: date,

            studyTime: studyTime,

            priority: priority,

            sticker: sticker,

            color: color,

            completed: false
        };


        tasks.push(newTask);
    }


    saveTasks();

    document.getElementById("taskForm").reset();

    setTodayDate();

    document.getElementById("taskColor").value =
        "#f7b6d2";


    renderAll();
}


/* -------------------------
   SAVE TASKS
------------------------- */

function saveTasks() {

    localStorage.setItem(
        "studyPlannerTasks",
        JSON.stringify(tasks)
    );
}


/* -------------------------
   RENDER EVERYTHING
------------------------- */

function renderAll() {

    renderTodayTasks();

    renderAllTasks();

    renderWeeklyOverview();

    renderSubjectProgress();

    updateDailyProgress();

    updateStreak();
}


/* -------------------------
   TODAY'S TASKS
------------------------- */

function renderTodayTasks() {

    const today =
        new Date().toISOString().split("T")[0];


    const todayTasks =
        tasks.filter(
            task => task.date === today
        );


    const container =
        document.getElementById("todayTasks");


    document.getElementById("todayTaskCount").textContent =
        todayTasks.length +
        (todayTasks.length === 1 ? " task" : " tasks");


    if (todayTasks.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                No tasks for today yet.
            </p>
        `;

        return;
    }


    container.innerHTML =
        todayTasks
            .sort(sortTasks)
            .map(createTaskHTML)
            .join("");
}


/* -------------------------
   ALL TASKS
------------------------- */

function renderAllTasks() {

    const container =
        document.getElementById("allTasks");


    const filter =
        document.getElementById("taskFilter").value;


    let filteredTasks = [...tasks];


    if (filter === "pending") {

        filteredTasks =
            filteredTasks.filter(
                task => !task.completed
            );
    }


    if (filter === "completed") {

        filteredTasks =
            filteredTasks.filter(
                task => task.completed
            );
    }


    filteredTasks.sort(sortTasks);


    if (filteredTasks.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                No study tasks found.
            </p>
        `;

        return;
    }


    container.innerHTML =
        filteredTasks
            .map(createTaskHTML)
            .join("");
}


/* -------------------------
   SORT TASKS
------------------------- */

function sortTasks(a, b) {

    if (a.completed !== b.completed) {

        return a.completed ? 1 : -1;
    }


    if (a.date !== b.date) {

        return a.date.localeCompare(b.date);
    }


    const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3
    };


    return (
        priorityOrder[a.priority] -
        priorityOrder[b.priority]
    );
}


/* -------------------------
   TASK HTML
------------------------- */

function createTaskHTML(task) {

    const priorityClass =
        "priority-" +
        task.priority.toLowerCase();


    const completedClass =
        task.completed ? "completed" : "";


    const buttonText =
        task.completed
            ? "↩ Undo"
            : "✓ Complete";


    return `

        <div
            class="task-card ${completedClass}"
            style="border-left-color: ${task.color};"
        >

            <div class="task-main">


                <div class="task-title-area">

                    <span class="task-sticker">
                        ${task.sticker}
                    </span>


                    <div>

                        <p class="task-name">
                            ${escapeHTML(task.name)}
                        </p>

                        <p class="task-subject">
                            ${escapeHTML(task.subject)}
                        </p>

                    </div>

                </div>


                <div class="task-actions">

                    <button
                        class="complete-button"
                        onclick="toggleTask(${task.id})"
                    >
                        ${buttonText}
                    </button>

                    <button
                        class="edit-button"
                        onclick="editTask(${task.id})"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteTask(${task.id})"
                    >
                        🗑 Delete
                    </button>

                </div>

            </div>


            <div class="task-details">

                <span class="task-tag">
                    📅 ${formatDate(task.date)}
                </span>

                <span class="task-tag">
                    ⏱ ${task.studyTime} hour${task.studyTime === 1 ? "" : "s"}
                </span>

                <span class="task-tag ${priorityClass}">
                    ${task.priority} Priority
                </span>

            </div>

        </div>

    `;
}


/* -------------------------
   COMPLETE / UNDO
------------------------- */

function toggleTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) {
        return;
    }


    task.completed =
        !task.completed;


    saveTasks();

    renderAll();
}


/* -------------------------
   EDIT TASK
------------------------- */

function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) {
        return;
    }


    document.getElementById("subject").value =
        task.subject;

    document.getElementById("taskName").value =
        task.name;

    document.getElementById("taskDate").value =
        task.date;

    document.getElementById("taskTime").value =
        task.studyTime;

    document.getElementById("priority").value =
        task.priority;

    document.getElementById("taskSticker").value =
        task.sticker;

    document.getElementById("taskColor").value =
        task.color;


    editingTaskId = id;


    document.querySelector(
        "#taskForm .add-task-button"
    ).textContent =
        "Save Changes";


    document
        .getElementById("taskForm")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* -------------------------
   DELETE TASK
------------------------- */

function deleteTask(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) {
        return;
    }


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    renderAll();
}


/* -------------------------
   DAILY PROGRESS
------------------------- */

function updateDailyProgress() {

    const today =
        new Date().toISOString().split("T")[0];


    const completedToday =
        tasks
            .filter(
                task =>
                    task.date === today &&
                    task.completed
            )
            .reduce(
                (total, task) =>
                    total + task.studyTime,
                0
            );


    let percentage = 0;


    if (dailyGoal > 0) {

        percentage =
            (completedToday / dailyGoal) * 100;

        percentage =
            Math.min(percentage, 100);
    }


    document.getElementById("progressPercentage").textContent =
        percentage.toFixed(0) + "%";


    document.getElementById("dailyProgress").style.width =
        percentage + "%";


    document.getElementById("progressText").textContent =
        completedToday.toFixed(1) +
        " / " +
        dailyGoal.toFixed(1) +
        " hours completed";
}


/* -------------------------
   WEEKLY OVERVIEW
------------------------- */

function renderWeeklyOverview() {

    const container =
        document.getElementById("weeklyOverview");


    const today =
        new Date();


    const dayOfWeek =
        today.getDay();


    const mondayOffset =
        dayOfWeek === 0
            ? -6
            : 1 - dayOfWeek;


    const monday =
        new Date(today);


    monday.setDate(
        today.getDate() + mondayOffset
    );


    const days = [];


    for (let i = 0; i < 7; i++) {

        const date =
            new Date(monday);


        date.setDate(
            monday.getDate() + i
        );


        days.push(date);
    }


    container.innerHTML =
        days
            .map(createDayCard)
            .join("");
}


function createDayCard(date) {

    const dateString =
        formatDateForInput(date);


    const dayTasks =
        tasks.filter(
            task => task.date === dateString
        );


    const completed =
        dayTasks.filter(
            task => task.completed
        ).length;


    const dayName =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "short"
            }
        );


    return `

        <div class="day-card">

            <div class="day-name">
                ${dayName}
            </div>

            <div class="day-number">
                ${date.getDate()}
            </div>

            <div class="day-info">
                ${dayTasks.length} task${dayTasks.length === 1 ? "" : "s"}<br>
                ${completed} completed
            </div>

        </div>

    `;
}


/* -------------------------
   SUBJECT PROGRESS
------------------------- */

function renderSubjectProgress() {

    const container =
        document.getElementById("subjectProgress");


    if (tasks.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                Add study tasks to see subject progress.
            </p>
        `;

        return;
    }


    const subjects = {};


    tasks.forEach(task => {

        const subject =
            task.subject.trim();


        if (!subjects[subject]) {

            subjects[subject] = {
                total: 0,
                completed: 0
            };
        }


        subjects[subject].total++;


        if (task.completed) {

            subjects[subject].completed++;
        }

    });


    container.innerHTML =
        Object.keys(subjects)
            .sort()
            .map(subject => {

                const data =
                    subjects[subject];


                const percentage =
                    data.total > 0
                        ? (data.completed / data.total) * 100
                        : 0;


                return `

                    <div class="subject-progress">

                        <div class="subject-header">

                            <span>
                                ${escapeHTML(subject)}
                            </span>

                            <strong>
                                ${percentage.toFixed(0)}%
                            </strong>

                        </div>


                        <div class="subject-bar-background">

                            <div
                                class="subject-bar"
                                style="width: ${percentage}%"
                            ></div>

                        </div>

                    </div>

                `;

            })
            .join("");
}


/* -------------------------
   STUDY STREAK
------------------------- */

function updateStreak() {

    const completedDates =
        [
            ...new Set(
                tasks
                    .filter(task => task.completed)
                    .map(task => task.date)
            )
        ]
        .sort()
        .reverse();


    let streak = 0;


    let currentDate =
        new Date();


    currentDate.setHours(0, 0, 0, 0);


    while (true) {

        const dateString =
            formatDateForInput(currentDate);


        if (completedDates.includes(dateString)) {

            streak++;

            currentDate.setDate(
                currentDate.getDate() - 1
            );

        } else {

            break;
        }
    }


    document.getElementById("streakCount").textContent =
        streak +
        (streak === 1 ? " day" : " days");
}


/* -------------------------
   RESET PLANNER
------------------------- */

function resetPlanner() {

    const confirmed =
        confirm(
            "This will delete all study tasks, goals, and customization settings. Continue?"
        );


    if (!confirmed) {
        return;
    }


    tasks = [];

    dailyGoal = 0;

    customization = {
        theme: "pink",
        sticker: "🎀"
    };

    editingTaskId = null;


    localStorage.removeItem(
        "studyPlannerTasks"
    );

    localStorage.removeItem(
        "studyPlannerGoal"
    );

    localStorage.removeItem(
        "studyPlannerCustomization"
    );


    document.getElementById("taskForm").reset();

    setTodayDate();

    document.getElementById("dailyGoal").value = "";

    document.getElementById("taskColor").value =
        "#f7b6d2";


    document.querySelector(
        "#taskForm .add-task-button"
    ).textContent =
        "+ Add Study Task";


    applyCustomization();

    renderAll();
}


/* -------------------------
   HELPER FUNCTIONS
------------------------- */

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}


function formatDateForInput(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;
}


function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
