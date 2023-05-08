// all dom element
let wrapper = document.getElementById("wrapper");
let input = document.getElementById("get-todo");
let ul = document.getElementById("js-tasks");
let totaltask = document.getElementById("total-task");
let toast = document.getElementById('toast');
let allTasks = document.getElementById('all-tasks');
let unComplete = document.getElementById('uncomplete');
let complete = document.getElementById('complete');

// toast message
let checkInterval = false;
function clearToast () {
  if(checkInterval == true) {
    return;
  }
  if(toast.childElementCount > 0){
    checkInterval = true;
    let intervalId = setInterval(()=>{
      toast.removeChild(toast.lastChild);
      if(toast.childElementCount == 0){
        clearInterval(intervalId);
        console.log("interval clear");
        checkInterval = false;
      }
    }, 800);
  }
}

function showToast (error) {
  let li = document.createElement('li');
  li.innerText = error;
  toast.insertBefore(li, toast.firstChild);
  clearToast();
}

// function to get all todos from the local storage
function getStorageTask() {
  let tasks = localStorage.getItem("tasks") || [];
  if (tasks.length !== 0) {
    return JSON.parse(tasks);
  }
  return tasks;
}

// function to store todos in localstorage
function setStorageTask(tasks) {
    if(tasks.length === 0) {
        localStorage.clear();
    } else {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    render();
}

// function to count all uncompleted completed task
function totalTasks(size) {
    totaltask.innerText = `${size} task`
}

// to render the tasks in browser
function render(tasks = getStorageTask()) {
  ul.innerHTML = "";
  let totaltask = tasks.length;
  totalTasks(totaltask);

  for (let item = 0; item < totaltask; item++) {
    let todo = tasks[item];
    let li = document.createElement("li");
    li.setAttribute("id", todo.id);
    li.innerHTML = `<input type="checkbox" ${todo.isComplete ? "checked" : "unchecked"} data-id=${todo.id} />
                    ${
                        todo.isComplete
                        ? `<del>${todo.todo}</del>`
                        : `${todo.todo}`
                    }
                    <i class="fa-regular fa-circle-xmark" data-id=${todo.id}></i>`;
    ul.appendChild(li);
  }
}
render();

// to get input text and add it to localstorage
function addTodo() {
  let text = input.value;
  if (text === "") {
    alert("can not add empty task");
    return;
  }
  let id = Date.now();
  let task = {
    id: id,
    todo: text,
    isComplete: false,
  };
  let tasks = getStorageTask();
  tasks.push(task);
  setStorageTask(tasks);
  showToast('Task Added');
  input.value = "";
}

// delete todo from storage
function deleteTodo(e) {
  let targetNode = e.target.parentNode.id;
  let tasks = getStorageTask();
  let newTasks = tasks.filter((todo) => {
    if (todo.id != targetNode) {
      return todo;
    }
  });
  setStorageTask(newTasks);
  showToast('Task Deleted');
}

// check which todo is remaining to complete
function checkCompleted(e) {
  let targetNode = e.target.parentNode.id;
  let tasks = getStorageTask();
  let newTasks = tasks.map((todo) => {
    if (todo.id == targetNode) {
      todo.isComplete = !todo.isComplete;
    }
    return todo;
  });
  setStorageTask(newTasks);
}

// function to mark all task is completed
function markAllTaskComplete() {
    let tasks = getStorageTask();
    if(tasks.length < 1) {
        return;
    }
    let newTasks = tasks.map((todo) => {
        todo.isComplete = true;
        return todo;
    })
    setStorageTask(newTasks);
    showToast('All task completed');
}

// function to delete all completed todo on click
function deleteCompletedTask() {
    let tasks = getStorageTask();
    if(tasks < 1) {
        return;
    }
    let newTasks = tasks.filter((todo) => {
        if(todo.isComplete !== true) {
            return todo;
        }
    })
    setStorageTask(newTasks);
    showToast('All completed tasks deleted');
}

// to show only uncompleted todos on browser
function uncompleteTasks() {
    let uncompletedTasks = getStorageTask().filter((todo) => {
        if(todo.isComplete === false) {
            return todo;
        }
    })
    render(uncompletedTasks);
}

// show only completed todo on browser
function completedTasks() {
    let completedTasks = getStorageTask().filter((todo) => {
        if(todo.isComplete === true) {
            return todo;
        }
    })
    render(completedTasks);
}

// function to highlight (all uncompleted completed) todo section on click
function addActiveClass(node) {
    allTasks.classList.remove('active');
    unComplete.classList.remove('active');
    complete.classList.remove('active');

    node.classList.add('active');
}

input.addEventListener('keyup',(e)=>{
    if(e.key == 'Enter') {
        console.log("enter");
        addTodo();
    }
})


// event delegation to perform an event on specific task
wrapper.addEventListener("click", (e) => {
  if (e.target.id === "addtodo-btn") {
    addTodo();
  } else if (e.target.classList.contains("fa-circle-xmark")) {
    deleteTodo(e);
  } else if (e.target.getAttribute("type") === "checkbox") {
    checkCompleted(e);
  } else if(e.target.id === "complete-all-task") {
    markAllTaskComplete();
  } else if(e.target.id === "clear-completed") {
    deleteCompletedTask();
  } else if(e.target.id === "all-tasks") {
    addActiveClass(allTasks);
    render();
  } else if(e.target.id === "uncomplete") {
    addActiveClass(unComplete);
    uncompleteTasks()
  } else if(e.target.id === "complete") {
    addActiveClass(complete);
    completedTasks();
  }
});
