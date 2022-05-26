const taskInput = document.querySelector(".userinput"),
filters = document.querySelectorAll(".filters span"),
clearAll= document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box"),
addButton = document.querySelector(".new-task-submit");

let editId;
let isEditedTask = false;

// getting localstorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {
    let li = "";
    if(todos) {
        todos.forEach((todo, id) => {
            // if todo status is completed, set the isCompleted value to checked
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                li += `<li class="task">
    
            <label for="${id}">
                <input type="checkbox" onclick="updateStatus(this)" id="${id}" ${isCompleted}>
                <p class="${isCompleted}">${todo.name}</p>
            </label>
    
            <div class="actions">
                    <button class="edit" onclick="editTask(${id}, '${todo.name}')">Edit</button>
                    <button class="delete" onclick="deleteTask(${id})">Delete</button>
                </div>
    
        </li>`;
            }
            
        });
    }
    // if li is not empty, insert this value inside taskbox else insert span
    taskBox.innerHTML = li || `<span style = "color: #adb5bd;">No task here.</span>`;
}
showTodo("all");

function editTask(taskId, taskName) {
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}

function deleteTask(deleteId) {
    // removing selected task from array/todos
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

clearAll.addEventListener("click", () => {
    // removing all tasks from array/todos
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
});

function updateStatus(selectedTask) {
    // getting paragraph that contains task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        // updating the status of selected task to completed
        todos[selectedTask.id].status = "completed";
    } else{
        taskName.classList.remove("checked");
        // updating the status of selected task to pending
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}


function check(userTask) {
    if(!isEditedTask) { // if isEditedTask isn't true
        if(!todos){ // if todos doesn't exist, pass an empty array to todos
            todos = [];
        }
        let taskInfo = {name: userTask, status: "pending"};
        todos.push(taskInfo); //adding new task to todos
    } else {
        isEditedTask = false;
        todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

addButton.addEventListener("click", () => {
    let userTask = taskInput.value.trim();
    if(userTask){
        check(userTask);
    }
});

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask){
        check(userTask);
    }
});