const help = document.getElementById("helpIcon");
const cancel = document.getElementById("cancelIcon");

help.addEventListener("click", function(){
    document.getElementById("helpCard").style.display = 'block';
    document.getElementById('blurBackground').style.display = 'block';
});
cancel.addEventListener("click", function(){
    document.getElementById("helpCard").style.display = 'none';
    document.getElementById('blurBackground').style.display = 'none';
});
// ---------------------------------------------------------------------
const userInput = document.getElementById("inputBox");
const addBtn = document.getElementById("btn");
const container = document.getElementById("taskContainer");
const alertMessage = document.getElementById("alertMessage");

const iTask = document.getElementById("iTask");
const cTask = document.getElementById("cTask");
const dTask = document.getElementById("dTask");

const taskArray = []; 
let deletedTasks = 0;

// Function to create a new task element
function createTask(userInput, isCompleted, taskId){
	const newElement = document.createElement("div");
	newElement.innerText = userInput;

	newElement.setAttribute("id", taskId);

	if (isCompleted) {
		newElement.setAttribute("class","task completed");
	} else{
		newElement.setAttribute("class","task");
	}
	
	newElement.addEventListener("click", completeTask);
	newElement.addEventListener("dblclick", removeTask);

	container.append(newElement);

	updateStatistics();
}

// Function to mark a task as completed or incomplete
function completeTask(){
	this.classList.toggle("completed");

	const taskId = this.id.toString();

	for (let i = 0; i < taskArray.length; i++) {
		const taskObj = taskArray[i];
		if (taskObj.id.toString() === taskId) {
			taskObj.isCompleted = !taskObj.isCompleted;
		}
	}
	setTask();	// Update local storage with the modified task array

	updateStatistics();
}

// Function to remove a task
function removeTask(){
	const taskId = this.id.toString();

	for (let i = 0; i < taskArray.length; i++) {
		if (taskArray[i].id.toString() === taskId) {
			taskArray.splice(i, 1);
			deletedTasks++;
            break;
		}
	}
	setTask();	// Update local storage with the modified task array
	this.remove();

    localStorage.setItem("DeletedTasks", deletedTasks);

	updateStatistics();
}

// Function to retrieve deletedTasks count from local storage
function getDeletedTasksCount(){
    const count = localStorage.getItem("DeletedTasks");

    if(count) {
        deletedTasks = parseInt(count);
    }
}

// Function to update statistics
function updateStatistics() {
	let completedTasks = 0;
	let incompletedTasks = 0;

    taskArray.forEach(task => {
        if (task.isCompleted) {
            completedTasks++;
        } else {
            incompletedTasks++;
        }
    });

	const totalDeletedTasks = deletedTasks;

    document.getElementById("iTask").innerText = incompletedTasks;
    document.getElementById("cTask").innerText = completedTasks;
    document.getElementById("dTask").innerText = totalDeletedTasks;
}

// Function to save tasks to local storage
function setTask(){
	localStorage.setItem("Task", JSON.stringify(taskArray));
}

// Function to retrieve tasks from local storage
function getTask(){
	let Task = localStorage.getItem("Task");

	if(!Task) return;

	Task = JSON.parse(Task);

	for(index in Task){
		const taskObj = Task[index];
		createTask(taskObj.value, taskObj.isCompleted, taskObj.id);
		taskArray.push(Task[index]);
	}
}


// Function to add a new task
function addTask() {
	const userInput = inputBox.value.trim();

	if(userInput === "") {
		showAlert("Please Enter Text......");
		return;
	}
    const taskId = Math.random() + Date.now();

	const taskObj = {
        value: userInput,
        isCompleted: false,
        id: taskId
    };

	taskArray.push(taskObj);
	setTask();
	createTask(userInput, false, taskId);

	inputBox.value = "";
	inputBox.focus();

	updateStatistics();
}

// Function to handle "Enter" key press for adding a task
function clickEnter(e) {
	if (e.keyCode === 13) addTask();
}

// Function to show alert message
function showAlert(message) {
    alertMessage.innerText = message;
    setTimeout(() => {
        alertMessage.innerText = "";
    }, 2000);
}

addBtn.addEventListener("click", addTask);
inputBox.addEventListener("keyup", clickEnter);

getDeletedTasksCount();

getTask();
