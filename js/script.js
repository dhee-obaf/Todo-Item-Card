let dueDate = new Date(document.getElementById("due").dateTime);
let status = "Pending";

const el = id => document.getElementById(id);

// Expand / Collapse
const toggleBtn = document.querySelector('[data-testid="test-todo-expand-toggle"]');
const desc = el("desc");

toggleBtn.onclick = () => {
  const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
  toggleBtn.setAttribute("aria-expanded", !expanded);
  toggleBtn.textContent = expanded ? "Expand" : "Collapse";
  desc.style.display = expanded ? "none" : "block";
};
desc.style.display = "none";

// Time Logic
function updateTime() {
  if (status === "Done") {
    el("time").textContent = "Completed";
    return;
  }

  const diff = dueDate - new Date();
  const mins = Math.floor(Math.abs(diff)/60000);
  const hrs = Math.floor(mins/60);
  const days = Math.floor(hrs/24);

  let text = "";

  if (diff > 0) {
    text = days ? `Due in ${days} days` :
           hrs ? `Due in ${hrs} hours` :
           `Due in ${mins} minutes`;
    el("overdue").textContent = "";
  } else {
    text = days ? `Overdue by ${days} days` :
           hrs ? `Overdue by ${hrs} hours` :
           `Overdue by ${mins} minutes`;
    el("overdue").textContent = "Overdue";
  }

  el("time").textContent = text;
}
setInterval(updateTime, 60000);
updateTime();

// Status Sync
const checkbox = el("checkbox");
const statusControl = el("statusControl");

function syncStatus(newStatus) {
  status = newStatus;
  el("status").textContent = status;
  checkbox.checked = status === "Done";
}

checkbox.onchange = () => syncStatus(checkbox.checked ? "Done" : "Pending");
statusControl.onchange = () => syncStatus(statusControl.value);

// Edit Mode
const form = el("form");
const editBtn = el("editBtn");

editBtn.onclick = () => {
  form.hidden = false;
  editBtn.focus();
};

el("cancel").onclick = () => form.hidden = true;

form.onsubmit = (e) => {
  e.preventDefault();
  el("title").textContent = el("editTitle").value;
  desc.textContent = el("editDesc").value;
  el("priority").textContent = el("editPriority").value;
  dueDate = new Date(el("editDue").value);
  form.hidden = true;
};

const addBtn = document.getElementById("addBtn");
let savedCard = null;

// DELETE (with confirmation)
document.querySelector('[data-testid="test-todo-delete-button"]')
  .addEventListener("click", () => {
    const confirmDelete = confirm("Do you want to delete this task?"); // confirm dialog

    if (confirmDelete) {
      const card = document.querySelector('[data-testid="test-todo-card"]');
      savedCard = card.cloneNode(true); // save copy
      card.remove(); // delete from DOM
      addBtn.style.display = "block"; // show add button
    }
  });

// ADD (restore card)
addBtn.addEventListener("click", () => {
  if (savedCard) {
    document.body.appendChild(savedCard.cloneNode(true));
    addBtn.style.display = "none";

    // reattach delete event after restoring
    document
      .querySelector('[data-testid="test-todo-delete-button"]')
      .addEventListener("click", () => {
        if (confirm("Do you want to delete this task?")) {
          const card = document.querySelector('[data-testid="test-todo-card"]');
          savedCard = card.cloneNode(true);
          card.remove();
          addBtn.style.display = "block";
        }
      });
  }
});


// Priority Indicator
function updatePriorityUI(p) {
  const indicator = el("priorityIndicator");
  indicator.style.borderLeft = p === "High" ? "6px solid red" :
                               p === "Medium" ? "6px solid orange" :
                               "6px solid green";
}
updatePriorityUI("High");