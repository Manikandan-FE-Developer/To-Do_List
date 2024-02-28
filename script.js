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

const userInput = document.getElementById("inputBox");
const addBtn = document.getElementById("btn");
const container = document.getElementById("taskContainer");
const alertMessage = document.getElementById("alertMessage");

const taskArray = [];

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
}

// Function to remove a task
function removeTask(){
	const taskId = this.id.toString();

	for (let i = 0; i < taskArray.length; i++) {
		if (taskArray[i].id.toString() === taskId) {
			taskArray.splice(i, 1);
		}
	}
	setTask();	// Update local storage with the modified task array
	this.remove();
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
getTask();

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
