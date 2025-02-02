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
                    <td><button class="btn btn-sm btn-success" onclick="editTask(${task.id})"> <i class="bi bi-pencil-square"></i></button></td>
                    <td><button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})"><i class="bi bi-trash"></i></button></td>
                </tr>
            `;
            taskList.innerHTML += row;
        });
}

// Add Task function
function addTask(taskName, status) {
    const tasks = getTasks();
    const newTask = {
        id: Date.now(),
        taskName: taskName,
        status: status
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
        document.getElementById("taskId").value = task.id;
        myModal.show();
    }
}

// Update Task function
function updateTask(taskId, taskName, status) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].taskName = taskName;
        tasks[taskIndex].status = status;
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

// Initial render
renderTasks();

// Event listener for form submission
document.getElementById("taskForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const taskId = document.getElementById("taskId").value;
    const taskName = document.getElementById("taskName").value;
    const taskStatus = document.getElementById("taskStatus").value;
    if (taskId) {
        updateTask(Number(taskId), taskName, taskStatus);
    } else {
        addTask(taskName, taskStatus);
    }
    myModal.hide();
    document.getElementById("taskForm").reset();
});

// Event listener for search input
document.querySelector('input[type="search"]').addEventListener("input", function(event) {
    const searchQuery = event.target.value;
    renderTasks(searchQuery);
});