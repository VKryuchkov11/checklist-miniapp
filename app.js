<<<<<<< HEAD
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {

    let input = document.getElementById("taskInput");

    if (input.value.trim() === "") return;

    tasks.push({
        text: input.value,
        done: false
    });

    input.value = "";

    saveTasks();
    renderTasks();
    updateStats();
}

function toggleTask(index) {

    tasks[index].done = !tasks[index].done;

    saveTasks();
    renderTasks();
    updateStats();
}

function deleteTask(index) {

    tasks.splice(index, 1);

    saveTasks();
    renderTasks();
    updateStats();
}

function setFilter(type) {

    filter = type;

    renderTasks();
}

function renderTasks() {

    let container = document.getElementById("tasks");

    container.innerHTML = "";

    let filtered = tasks.filter(task => {

        if (filter === "active") return !task.done;
        if (filter === "done") return task.done;

        return true;
    });

    filtered.forEach((task, i) => {

        let realIndex = tasks.indexOf(task);

        let div = document.createElement("div");
        div.className = "task";

        if (task.done) div.classList.add("done");

        div.innerHTML = `
        <span onclick="toggleTask(${realIndex})">
        ${task.done ? "✅" : "⬜"} ${task.text}
        </span>
        <button onclick="deleteTask(${realIndex})">🗑</button>
        `;

        container.appendChild(div);

    });

}

function updateStats() {

    let done = tasks.filter(t => t.done).length;
    let total = tasks.length;

    let percent = total === 0 ? 0 : Math.round(done / total * 100);

    document.getElementById("counter").innerText = total + " задач";
    document.getElementById("percent").innerText = percent + "%";

    document.getElementById("progressFill").style.width = percent + "%";

    if (percent === 100 && total > 0) {

        let streak = Number(localStorage.getItem("streak") || 0);
        streak++;

        localStorage.setItem("streak", streak);

        document.getElementById("streak").innerText = streak;

    } else {

        document.getElementById("streak").innerText =
            localStorage.getItem("streak") || 0;

    }

}

renderTasks();
updateStats();

new Sortable(tasks, {
    animation: 150