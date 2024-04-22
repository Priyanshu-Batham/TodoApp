// Global States
let taskList = []
let taskListHtml = document.getElementById("taskListHtml")

let editableMode = false
let taskBeingEdited
let inputField, editBtn, delBtn

//Initial Loading
function initialLoad() {
    taskList = Object.entries(localStorage)
    for (let i = 0; i < taskList.length; i++) {
        let [id, task] = taskList[i]
        addTaskHtml(id, task)
    }
    document.getElementById("clearAll").addEventListener("click", clearAll)
}
initialLoad()


// ADD Feature
document.getElementById("add").addEventListener("click", (e) => {
    // fetching data
    let taskElm = document.querySelector("#input")
    let task = taskElm.value
    if (task === "") return
    taskElm.value = ""
    let id = new Date().getTime()

    // adding to taskList and localStorage
    taskList.unshift([id, task])
    localStorage.setItem(id, task)

    //creating and adding task html element
    addTaskHtml(id, task)
})

//Helper Task Html adder
function addTaskHtml(id, task) {
    let newTaskElm = document.createElement("li")
    newTaskElm.innerHTML = `<input class="px-3 py-2 border-2 border-black" type="text" value="${task}" readonly>
    <button class="mx-2 bg-green-400 px-3 py-2 border-2 border-black font-medium hover:bg-green-700 hover:border-green-400 hover:text-white">EDIT</button>
    <button class="bg-red-400 px-3 py-2 border-2 lg:inline lg:mt-0 inline-block mt-1 border-black font-medium hover:bg-red-700 hover:border-red-400 hover:text-white">DELETE</button>`
    newTaskElm.classList.add("text-center")
    newTaskElm.classList.add("mb-5")
    newTaskElm.id = id
    newTaskElm.lastChild.addEventListener("click", delAndCancel)
    newTaskElm.querySelector(":nth-child(2)").addEventListener("click", edit)

    //appending in the taskListHtml
    taskListHtml.prepend(newTaskElm)
}
// ---------------------------------------------------------------------->>

// Delete Feature
function delAndCancel(e) {
    if (editableMode) {
        if (e.target.parentElement != taskBeingEdited) alert("Save or Cancel your active task first")
        else {
            editableMode = false
            inputField.readOnly = true
            editBtn.innerHTML = "EDIT"
            delBtn.innerHTML = "DELETE"
        }
    }
    else{
        taskHtmlElm = e.target.parentElement
        id = taskHtmlElm.id
        taskHtmlElm.remove()
        localStorage.removeItem(id)
        for (let i = 0; i < taskList.length; i++) if (taskList[i][0] == id) taskList.splice(i, 1)
    }
}
// ---------------------------------------------------------------------->>
// Edit Feature
function edit(e) {
    if (editableMode) {
        if (e.target.parentElement != taskBeingEdited) alert("Save or Cancel your active task first")
        else {
            editableMode = false
            let inputValue = inputField.value
            let id = taskBeingEdited.id
            inputField.readOnly = true
            editBtn.innerHTML = "EDIT"
            delBtn.innerHTML = "DELETE"

            for (let i = 0; i < taskList.length; i++) if (taskList[i][0] == id) taskList[i][1] = inputValue

            localStorage.removeItem(id)
            localStorage.setItem(id, inputValue)
        }
    }
    else {
        editableMode = true
        editBtn = e.target
        delBtn = editBtn.nextElementSibling
        taskBeingEdited = editBtn.parentElement
        inputField = taskBeingEdited.firstChild

        inputField.readOnly = false
        editBtn.innerText = "SAVE"
        delBtn.innerText = "CANCEL"
    }
}
// ---------------------------------------------------------------------->>
// Clear All Feature
function clearAll(e){
    taskList = []
    localStorage.clear()
    taskListHtml.innerHTML = ""
}