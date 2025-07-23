const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const clearBtn = document.getElementById("clear-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

// 渲染所有任務
function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach(function (todo) {
    const li = createTodoElement(todo.text, todo.completed);
    todoList.appendChild(li);
  });
  updateStats();
}

// 建立單一任務項目元素
function createTodoElement(text, completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = text;

  // 點一下切換完成狀態
  span.addEventListener("click", function () {
    li.classList.toggle("completed");
    const index = Array.from(todoList.children).indexOf(li);
    todos[index].completed = li.classList.contains("completed");
    saveTodos();
    updateStats();
  });

  // 雙擊編輯任務
  span.addEventListener("dblclick", function () {
    const newText = prompt("請輸入新的內容：", text);
    if (newText !== null && newText.trim() !== "") {
      span.textContent = newText.trim();
      const index = Array.from(todoList.children).indexOf(li);
      todos[index].text = newText.trim();
      saveTodos();
    }
  });

  // 刪除按鈕
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

  li.setAttribute("draggable", true);
  li.addEventListener("dragstart", dragStart);
  li.addEventListener("dragover", dragOver);
  li.addEventListener("drop", drop);

  return li;
}

// 儲存任務
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// 新增任務
function addTodo(event) {
  event.preventDefault(); // 防止表單送出
  const text = input.value.trim();
  if (text !== "") {
    todos.push({ text: text, completed: false });
    saveTodos();
    renderTodos();
    input.value = "";
  }
}

// 新增按鈕事件
addBtn.addEventListener("click", addTodo);

// Enter 鍵新增
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addTodo(event);
  }
});

// 全部清除按鈕
clearBtn.addEventListener("click", function () {
  if (confirm("確定要清除所有待辦事項嗎？")) {
    todos = [];
    saveTodos();
    renderTodos();
  }
});

// 拖曳排序
let draggedItem = null;

function dragStart(e) {
  draggedItem = e.target;
}

function dragOver(e) {
  e.preventDefault();
  const target = e.target.closest("li");
  if (target && target !== draggedItem) {
    const children = Array.from(todoList.children);
    const draggedIndex = children.indexOf(draggedItem);
    const targetIndex = children.indexOf(target);

    if (draggedIndex < targetIndex) {
      todoList.insertBefore(draggedItem, target.nextSibling);
    } else {
      todoList.insertBefore(draggedItem, target);
    }

    todos = Array.from(todoList.children).map(li => {
      const text = li.querySelector("span").textContent;
      const completed = li.classList.contains("completed");
      return { text, completed };
    });
    saveTodos();
  }
}

function drop() {
  draggedItem = null;
}

// 更新統計數字
function updateStats() {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const uncompleted = total - completed;
  document.getElementById("stats").textContent =
    `共 ${total} 項，完成 ${completed} 項，未完成 ${uncompleted} 項`;
}

// 導覽區的展開與收合
window.addEventListener("DOMContentLoaded", function () {
  renderTodos();

  const noticeHeader = document.getElementById("notice-header");
  const noticeContent = document.getElementById("notice-content");

  noticeHeader.addEventListener("click", function () {
    const isVisible = noticeContent.style.display !== "none";
    noticeContent.style.display = isVisible ? "none" : "block";
    noticeHeader.textContent = isVisible
      ? "📌 使用導覽（展開）"
      : "📌 使用導覽（收合）";
  });
});
