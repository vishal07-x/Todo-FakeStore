const TodoApp = (() => {
  const STORAGE_KEY = "js-assignment-todos";
  let todos = [];
  let editingId = null;

  const els = {};

  function init() {
    els.form = document.querySelector("#todo-form");
    els.input = document.querySelector("#todo-input");
    els.list = document.querySelector("#todo-list");
    els.empty = document.querySelector("#empty-todos");
    els.count = document.querySelector("#todo-count");
    els.message = document.querySelector("#todo-message");
    els.modal = document.querySelector("#edit-modal");
    els.editForm = document.querySelector("#edit-form");
    els.editInput = document.querySelector("#edit-input");

    loadTodos();
    bindEvents();
    render();
  }

  function bindEvents() {
    els.form.addEventListener("submit", handleAdd);
    els.list.addEventListener("click", handleListClick);
    els.editForm.addEventListener("submit", handleEditSave);
    document.querySelector("#close-modal").addEventListener("click", closeModal);
    document.querySelector("#cancel-edit").addEventListener("click", closeModal);
    els.modal.addEventListener("click", (event) => {
      if (event.target === els.modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !els.modal.classList.contains("hidden")) closeModal();
    });
  }

  function handleAdd(event) {
    event.preventDefault();

    const raw = els.input.value.trim();
    if (!raw) {
      showMessage("Please enter a task.", "error");
      els.input.focus();
      return;
    }

    const parsed = parseTaskInput(raw);
    const newTodos = Array.from({ length: parsed.count }, () => ({
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      title: parsed.title,
      updateCount: 0
    }));

    todos.push(...newTodos);
    saveTodos();
    render();
    els.input.value = "";
    showMessage(`${parsed.count} task${parsed.count === 1 ? "" : "s"} added.`, "success");
  }

  function parseTaskInput(input) {
    const match = input.match(/^(.*?)[\s]+(\d+)$/);

    if (!match) {
      return { title: input, count: 1 };
    }

    const title = match[1].trim();
    const count = Number(match[2]);

    if (!title) return { title: input, count: 1 };
    if (!Number.isInteger(count) || count < 1) return { title: input, count: 1 };

    return {
      title,
      count: Math.min(count, 20)
    };
  }

  function handleListClick(event) {
    const button = event.target.closest("button");
    if (!button) return;

    const item = button.closest(".todo-item");
    if (!item) return;

    const id = item.dataset.id;

    if (button.dataset.action === "edit") openEdit(id);
    if (button.dataset.action === "delete") deleteTodo(id);
  }

  function openEdit(id) {
    const todo = todos.find(item => item.id === id);
    if (!todo) return;

    editingId = id;
    els.editInput.value = todo.title;
    els.modal.classList.remove("hidden");
    requestAnimationFrame(() => els.editInput.focus());
  }

  function handleEditSave(event) {
    event.preventDefault();

    const newTitle = els.editInput.value.trim();
    if (!newTitle) {
      els.editInput.focus();
      return;
    }

    const todo = todos.find(item => item.id === editingId);
    if (!todo) return closeModal();

    todo.title = newTitle;
    todo.updateCount += 1;

    saveTodos();
    render();
    closeModal();
    showMessage("Task updated successfully.", "success");
  }

  function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    render();
    showMessage("Task deleted.", "success");
  }

  function render() {
    els.list.innerHTML = "";

    todos.forEach(todo => {
      const item = document.createElement("article");
      item.className = "todo-item";
      item.dataset.id = todo.id;

      const times = todo.updateCount === 1 ? "time" : "times";

      item.innerHTML = `
        <div class="todo-content">
          <div class="todo-title">${escapeHTML(todo.title)}</div>
          <div class="todo-meta">Updated ${todo.updateCount} ${times}</div>
        </div>
        <div class="todo-actions">
          <button class="icon-btn" data-action="edit" aria-label="Edit ${escapeHTML(todo.title)}">✏️ Edit</button>
          <button class="icon-btn danger-btn" data-action="delete" aria-label="Delete ${escapeHTML(todo.title)}">✕ Delete</button>
        </div>
      `;

      els.list.appendChild(item);
    });

    const count = todos.length;
    els.count.textContent = `${count} task${count === 1 ? "" : "s"}`;
    els.empty.classList.toggle("hidden", count !== 0);
  }

  function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function loadTodos() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      todos = Array.isArray(stored) ? stored : [];
    } catch {
      todos = [];
    }
  }

  function closeModal() {
    editingId = null;
    els.modal.classList.add("hidden");
  }

  function showMessage(message, type) {
    els.message.textContent = message;
    els.message.className = `message ${type}`;

    clearTimeout(showMessage.timer);
    showMessage.timer = setTimeout(() => {
      els.message.textContent = "";
      els.message.className = "message";
    }, 2500);
  }

  function escapeHTML(value) {
    return value.replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  return { init };
})();
