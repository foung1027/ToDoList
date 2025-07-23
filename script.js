const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const clearBtn = document.getElementById("clear-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach(function (todo) {
    const li = createTodoElement(todo.text, todo.completed);
    todoList.appendChild(li);
  });
  updateStats();
}

function createTodoElement(text, completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = text;

  span.addEventListener("click", function () {
    li.classList.toggle("completed");
    const index = Array.from(todoList.children).indexOf(li);
    todos[index].completed = li.classList.contains("completed");
    saveTodos();
    updateStats();
  });

  span.addEventListener("dblclick", function () {
    const newText = prompt("請輸入新的內容：", text);
    if (newText !== null && newText.trim() !== "") {
      span.textContent = newText.trim();
      const index = Array.from(todoList.children).indexOf(li);
      todos[index].text = newText.trim();
      saveTodos();
    }
  });

  const delBtn = document.createElement("button");
  delBtn.textContent = "✕";
  delBtn.className = "delete-btn";
  delBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    const index = Array.from(todoList.children).indexOf(li);
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  });

  li.appendChild(span);
  li.appendChild(delBtn);
  return li;
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo() {
  const text = input.value.trim();
  if (text !== "") {
    todos.push({ text: text, completed: false });
    saveTodos();
    renderTodos();
    input.value = ""; // ✅ 一定要有這行才會清空！
  }
}

addBtn.addEventListener("click", addTodo);

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addTodo();
  }
});

clearBtn.addEventListener("click", function () {
  if (confirm("確定要清除所有待辦事項嗎？")) {
    todos = [];
    saveTodos();
    renderTodos();
  }
});

function updateStats() {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const uncompleted = total - completed;
  document.getElementById("stats").textContent =
    `共 ${total} 項，完成 ${completed} 項，未完成 ${uncompleted} 項`;
}

window.addEventListener("DOMContentLoaded", function () {
  renderTodos();

  const noticeHeader = document.getElementById("notice-header");
  const noticeContent = document.getElementById("notice-content");

  noticeHeader.addEventListener("click", function () {
    const isVisible = noticeContent.style.display !== "none";
    noticeContent.style.display = isVisible ? "none" : "block";
    noticeHeader.textContent = isVisible ? "📌 使用導覽（展開）" : "📌 使用導覽（收合）";
  });
});
