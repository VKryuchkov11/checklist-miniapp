let tg = window.Telegram.WebApp;
tg.expand();

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let streak = JSON.parse(localStorage.getItem("streak")) || 0;
let lastCompleteDate = localStorage.getItem("lastCompleteDate");
let currentFilter = "all";

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("streak", JSON.stringify(streak));
}

function addTask() {
    const text = document.getElementById("taskInput").value.trim();
    if (!text) return;

    tasks.push({text, done:false});
    document.getElementById("taskInput").value = "";
    save();
    render();
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;

    if (tasks[index].done) updateStreak();

    save();
    render();
}

function deleteTask(index) {
    const taskElements = document.querySelectorAll(".task");
    taskElements[index].classList.add("removing");

    setTimeout(() => {
        tasks.splice(index,1);
        save();
        render();
    }, 300);
}

function setFilter(filter) {
    currentFilter = filter;
    render();
}

function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(t=>t.done).length;

    document.getElementById("counter").innerText = `${total} задач`;
    const percent = total ? Math.round(done/total*100) : 0;
    document.getElementById("percent").innerText = percent + "%";
    document.getElementById("progressFill").style.width = percent + "%";
}

function updateStreak() {
    const today = new Date().toDateString();

    if (lastCompleteDate !== today) {
        streak++;
        lastCompleteDate = today;
        localStorage.setItem("lastCompleteDate", today);
    }

    document.getElementById("streak").innerText = streak;
}

function render() {
    const container = document.getElementById("tasks");
    container.innerHTML = "";

    let filtered = tasks.filter(t=>{
        if(currentFilter==="active") return !t.done;
        if(currentFilter==="done") return t.done;
        return true;
    });

    filtered.forEach((task,index)=>{
        container.innerHTML += `
            <div class="task">
                <div onclick="toggleTask(${index})">
                    ${task.done ? "✅" : "⬜"} ${task.text}
                </div>
                <button onclick="deleteTask(${index})">🗑</button>
            </div>
        `;
    });

    updateStats();
    document.getElementById("streak").innerText = streak;
}

render();
new Sortable(document.getElementById("tasks"), {
    animation: 150,
    onEnd: function (evt) {
        const movedItem = tasks.splice(evt.oldIndex, 1)[0];
        tasks.splice(evt.newIndex, 0, movedItem);
        save();
    }
});