// Variable Declaration
const myModalElement = document.getElementById("MyModal");
const myModal = new bootstrap.Modal(myModalElement);

// Get data from localStorage
function getTasks() {
    let tasks = [];
    if (localStorage.getItem("tasks")) {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    return tasks;
}

// Save Task details in localStorage
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render Task details in Table Format
function renderTasks(searchQuery = "") {
    const tasks = getTasks();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks
        .filter(task => task.taskName.toLowerCase().includes(searchQuery.toLowerCase()))
        .forEach((task, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${task.taskName}</td>
                    <td>${task.status}</td>
                    <td>${task.priority}</td>
                    <td>${task.dueDate}</td>
                    <td><button class="btn btn-sm btn-success" onclick="editTask(${task.id})"> <i class="bi bi-pencil-square"></i></button></td>
                    <td><button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})"><i class="bi bi-trash"></i></button></td>
                </tr>
            `;
            taskList.innerHTML += row;
        });
    updateProgress();
}

// Add Task function
function addTask(taskName, status, priority, dueDate) {
    const tasks = getTasks();
    const newTask = {
        id: Date.now(),
        taskName: taskName,
        status: status,
        priority: priority,
        dueDate: dueDate
    };
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
}

// Edit Task function
function editTask(taskId) {
    const tasks = getTasks();
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        document.getElementById("taskName").value = task.taskName;
        document.getElementById("taskStatus").value = task.status;
        document.getElementById("taskPriority").value = task.priority;
        document.getElementById("taskDueDate").value = task.dueDate;
        document.getElementById("taskId").value = task.id;
        myModal.show();
    }
}

// Update Task function
function updateTask(taskId, taskName, status, priority, dueDate) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].taskName = taskName;
        tasks[taskIndex].status = status;
        tasks[taskIndex].priority = priority;
        tasks[taskIndex].dueDate = dueDate;
        saveTasks(tasks);
        renderTasks();
    }
}

// Delete Task function
function deleteTask(taskId) {
    if (confirm("Are you sure to delete.")) {
        const tasks = getTasks();
        const updatedTasks = tasks.filter((task) => task.id != taskId);
        saveTasks(updatedTasks);
        renderTasks();
    }
}

// Update Progress function
function updateProgress() {
    const tasks = getTasks();
    const completedTasks = tasks.filter(task => task.status === "completed").length;
    const progress = tasks.length ? (completedTasks / tasks.length) * 100 : 0;
    const progressBar = document.getElementById("taskProgress");
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute("aria-valuenow", progress);
    progressBar.textContent = `${Math.round(progress)}%`;
}

// Initial render
renderTasks();

// Event listener for form submission
document.getElementById("taskForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const taskId = document.getElementById("taskId").value;
    const taskName = document.getElementById("taskName").value;
    const taskStatus = document.getElementById("taskStatus").value;
    const taskPriority = document.getElementById("taskPriority").value;
    const taskDueDate = document.getElementById("taskDueDate").value;
    if (taskId) {
        updateTask(Number(taskId), taskName, taskStatus, taskPriority, taskDueDate);
    } else {
        addTask(taskName, taskStatus, taskPriority, taskDueDate);
    }
    myModal.hide();
    document.getElementById("taskForm").reset();
});

// Event listener for search input
document.querySelector('input[type="search"]').addEventListener("input", function(event) {
    const searchQuery = event.target.value;
    renderTasks(searchQuery);
});