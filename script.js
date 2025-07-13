const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const createSelect = document.getElementById("category-select"); // 取得類別下拉選單

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function createTodoElement(text, completed = false, category = "") {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const categoryTag = document.createElement("small");
  categoryTag.textContent = `[${category}]`;
  categoryTag.style.marginRight = "0.5rem";

  const span = document.createElement("span");
  span.textContent = text;

  li.appendChild(categoryTag);
  li.appendChild(span);
}


// 拖曳排序功能
new Sortable(todoList, {
  animation: 150,
  onEnd: function () {
    const newTodos = Array.from(todoList.children).map(li => {
      const text = li.querySelector("span").textContent;
      const completed = li.classList.contains("completed");
      const category = li.querySelector("small")?.textContent.replace(/\[|\]/g, "") || "";
      return { text, completed, category };
    });
    todos = newTodos;
    saveTodos();
  }
});

// 建立一個代辦項目元素
function createTodoElement(text, completed = false, category = "") {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  // 類別標籤
  const categoryTag = document.createElement("small");
  categoryTag.textContent = `[${category}]`;
  categoryTag.style.marginRight = "0.5rem";

  const span = document.createElement("span");
  span.textContent = text;

  li.appendChild(categoryTag); // 類別放在最前
  li.appendChild(span);

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

  li.appendChild(delBtn);

  li.setAttribute("draggable", true);
  li.addEventListener("dragstart", dragStart);
  li.addEventListener("dragover", dragOver);
  li.addEventListener("drop", drop);

  return li;
}

// 儲存至 localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// 新增任務
function addTodo() {
  const text = input.value.trim();
  const category = createSelect.value;

  if (text !== "") {
    todos.push({ text, completed: false, category }); // ✅ 加入 category
    saveTodos();
    renderTodos();
    input.value = "";
  }
}

addBtn.addEventListener("click", function (e) {
  e.preventDefault(); // 防止表單提交
  addTodo();
});

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addTodo();
  }
});

// 全部清除
const clearBtn = document.getElementById("clear-btn");
clearBtn.addEventListener("click", function () {
  if (confirm("確定要清除所有待辦事項嗎？")) {
    todos = [];
    saveTodos();
    renderTodos();
  }
});

// 拖曳處理
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
      const category = li.querySelector("small")?.textContent.replace(/\[|\]/g, "") || "";
      return { text, completed, category };
    });
    saveTodos();
  }
}

function drop() {
  draggedItem = null;
}

// 更新統計資訊
function updateStats() {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const uncompleted = total - completed;
  document.getElementById("stats").textContent =
    `共 ${total} 項，完成 ${completed} 項，未完成 ${uncompleted} 項`;
}

// 導覽摺疊功能
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
