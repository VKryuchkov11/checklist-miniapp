let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || ["Общее"];
let currentCategory = "all";

function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("categories", JSON.stringify(categories));
}

function addCategory() {

    let input = document.getElementById("categoryInput");
    let name = input.value.trim();

    if (name === "") return;

    if (categories.includes(name)) {
        alert("Такая категория уже существует");
        return;
    }

    categories.push(name);

    input.value = "";

    saveData();
    renderCategories();
    renderCategorySelect();
}

function deleteCategory(cat) {

    if (!confirm("Удалить категорию?")) return;

    categories = categories.filter(c => c !== cat);

    tasks = tasks.map(task => {
        if (task.category === cat) {
            task.category = "Общее";
        }
        return task;
    });

    saveData();
    renderCategories();
    renderCategorySelect();
    renderTasks();
}

function editCategory(cat) {

    let newName = prompt("Новое имя категории:", cat);

    if (!newName || newName.trim() === "") return;

    if (categories.includes(newName)) {
        alert("Такая категория уже есть");
        return;
    }

    categories = categories.map(c => c === cat ? newName : c);

    tasks = tasks.map(task => {
        if (task.category === cat) {
            task.category = newName;
        }
        return task;
    });

    saveData();
    renderCategories();
    renderCategorySelect();
    renderTasks();
}

function renderCategories() {

    let container = document.getElementById("categories");
    container.innerHTML = "";

    let allBtn = document.createElement("button");
    allBtn.innerText = "Все";
    allBtn.onclick = () => {
        currentCategory = "all";
        renderTasks();
    };

    container.appendChild(allBtn);

    categories.forEach(cat => {

        let btn = document.createElement("button");

        btn.innerHTML = `
        ${cat}
        <span onclick="editCategory('${cat}')">✏️</span>
        <span onclick="deleteCategory('${cat}')">❌</span>
        `;

        btn.onclick = () => {
            currentCategory = cat;
            renderTasks();
        };

        container.appendChild(btn);

    });

}

function renderCategorySelect() {

    let select = document.getElementById("categorySelect");

    select.innerHTML = "";

    categories.forEach(cat => {

        let option = document.createElement("option");

        option.value = cat;
        option.textContent = cat;

        select.appendChild(option);

    });

}

function addTask() {

    let input = document.getElementById("taskInput");
    let category = document.getElementById("categorySelect").value;

    if (input.value.trim() === "") return;

    tasks.push({
        text: input.value,
        done: false,
        category: category
    });

    input.value = "";

    saveData();
    renderTasks();
    updateStats();
}

function toggleTask(index) {

    tasks[index].done = !tasks[index].done;

    saveData();
    renderTasks();
    updateStats();
}

function deleteTask(index) {

    if (!confirm("Удалить задачу?")) return;

    tasks.splice(index, 1);

    saveData();
    renderTasks();
    updateStats();
}

function editTask(index) {

    let newText = prompt("Редактировать задачу:", tasks[index].text);

    if (!newText || newText.trim() === "") return;

    tasks[index].text = newText;

    saveData();
    renderTasks();
}

function renderTasks() {

    let container = document.getElementById("tasks");

    container.innerHTML = "";

    let filtered = tasks.filter(task => {

        if (currentCategory === "all") return true;

        return task.category === currentCategory;

    });

    filtered.forEach(task => {

        let realIndex = tasks.indexOf(task);

        let div = document.createElement("div");

        div.className = "task";

        if (task.done) div.classList.add("done");

        div.innerHTML = `
        <span onclick="toggleTask(${realIndex})">
        ${task.done ? "✅" : "⬜"} ${task.text}
        </span>

        <small>${task.category}</small>

        <div>
        <button onclick="editTask(${realIndex})">✏️</button>
        <button onclick="deleteTask(${realIndex})">🗑</button>
        </div>
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

}

document.getElementById("taskInput").addEventListener("keypress", function(e) {

    if (e.key === "Enter") {
        addTask();
    }

});

document.getElementById("categoryInput").addEventListener("keypress", function(e) {

    if (e.key === "Enter") {
        addCategory();
    }

});

renderCategories();
renderCategorySelect();
renderTasks();
updateStats();