const listsContainer = document.querySelector(".task-list")
const newListForm = document.querySelector(".new-list-form")
const newListInput = document.getElementById("new-list")
const deleteListButton = document.getElementById("delete-list-button")
const listDisplayContainer = document.getElementById("todo-list-display-container")
const listTitleElement = document.getElementById("data-list-title")
const listCountElement = document.getElementById("data-list-count")
const tasksContainer = document.getElementById("data-tasks")
const taskTemplate = document.getElementById("task-template")
const newTaskForm = document.getElementById("new-task-form")
const newTaskInput = document.getElementById("new-task-input")
const clearTaskListButton = document.getElementById("clear-task-list")
const uncheckListButton = document.getElementById("uncheck-list-button")

const LOCAL_STORAGE_LIST_KEY = "task.lists"
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId"

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

function createList(name){
    return { id: Date.now().toString(), name: name, tasks: []}
}

function createTask(name){
    return { id: Date.now().toString(), name: name, complete: false}
}

function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function getTaskCount(selectedList){
    const incompleteTasksCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTasksCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTasksCount} ${taskString} remaining`
}

function renderTasks(selectedList){
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true) // true lets us use the entire template
        const checkbox = taskElement.querySelector("input")
        const label = taskElement.querySelector("label")

        checkbox.id = task.id
        checkbox.checked = task.complete

        label.htmlFor = task.id // label for specific checkbox
        label.append(task.name) // add task name
        tasksContainer.appendChild(taskElement)
    })
}

function render(){
    clearElement(listsContainer)
    renderLists()

    const selectedList = lists.find(list => list.id === selectedListId)

    if (selectedListId == null){
        listDisplayContainer.style.display = "none"
    } else{
        listDisplayContainer.style.display = ""
        listTitleElement.innerText = selectedList.name
        getTaskCount(selectedList)
        clearElement(tasksContainer)
        renderTasks(selectedList)
    }
}

function renderLists(){
    lists.forEach(list => {
        // <li class="list-name">name</li>
        const listElement = document.createElement("li")
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name
        if (list.id === selectedListId){
            listElement.classList.add("active-list")
        }
        listsContainer.appendChild(listElement)
    })
}

function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
}

listsContainer.addEventListener("click", e => {
    // event listener for the list container
    if (e.target.tagName.toLowerCase() == "li"){
        selectedListId = e.target.dataset.listId
        save()
        render()
    }
})

tasksContainer.addEventListener("click", e=> {
    if(e.target.tagName.toLowerCase() === "input"){
        // clicked a check box
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        getTaskCount(selectedList)
    }
})

newListForm.addEventListener("submit", e => {
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName === "") return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    save()
    render()
})

newTaskForm.addEventListener("submit", e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if (taskName == null || taskName === "") return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    save()
    render()
})

clearTaskListButton.addEventListener("click", e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete) // return only not completed tasks
    save()
    render()
})

deleteListButton.addEventListener("click", e => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    save()
    render()
})

uncheckListButton.addEventListener("click", e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    for (let i = 0; i < selectedList.tasks.length; i++){
        selectedList.tasks[i].complete = false
    }
    save()
    render()
})


render()