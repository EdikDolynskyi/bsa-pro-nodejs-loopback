var socket = io.connect();
var $$addTask = document.getElementById('add-task');
var $$tasksContainer = document.getElementById('tasks-container');

socket.on("updateTasksList", function (data){
	while ($$tasksContainer.hasChildNodes()) {
		$$tasksContainer.removeChild($$tasksContainer.lastChild);
	}
	fetchTasks();
})

function fetchTasks(){
	console.log('fetch!!!')
	fetch('/api/tasks').then(function(response){
		if(response.ok) {
			return response.json();
		} 
	}).then(function(tasks){
		renderTasks(tasks);
	});
}

fetchTasks();

bindEventListeners();

function renderTasks(tasks){
	console.log('tasks', tasks);
	for (var i = 0; i < tasks.length; i++){
		$$tasksContainer.appendChild(renderTask(tasks[i]));
	}
}

function renderTask(task = {}){
	var $taskContainer = document.createElement('div');
	$taskContainer.className = 'task-container';

	if (task.id){
		$taskContainer.id = task.id

		var $taskId = document.createElement('a');
		$taskId.innerText = task.id;
		$taskId.href = '/tasks/' + task.id;
		$taskContainer.appendChild($taskId);
	}

	var $taskTitle = document.createElement('input');
	$taskTitle.value = task.title || '';
	$taskTitle.className = 'task-title'
	$taskContainer.appendChild($taskTitle);

	var $taskDescription = document.createElement('input');
	$taskDescription.value = task.description || '';
	$taskDescription.className = 'task-description'
	$taskContainer.appendChild($taskDescription);

	var $saveTaskButton = document.createElement('button');
	$saveTaskButton.innerText = 'Save';
	$saveTaskButton.className = 'save-task'
	$taskContainer.appendChild($saveTaskButton);

	var $deleteTaskButton = document.createElement('button');
	$deleteTaskButton.innerText = 'Delete';
	$deleteTaskButton.className = 'delete-task'
	$taskContainer.appendChild($deleteTaskButton);
	return $taskContainer;
}

function bindEventListeners(){

	$$addTask.addEventListener('click', function(){
		$$tasksContainer.appendChild(renderTask());
	});

	document.addEventListener('click', function(event){
		if (event.target.className === 'save-task'){
			var taskContainer = event.target.parentNode;
			var id = taskContainer.id;
			if (id){
				sendEditTaskReq(taskContainer, id);
			} else {
				sendCreateTaskReq(taskContainer).then(function(response){
					if(response.ok) {
						return response.json();
					} 
				}).then(function(task){
					$$tasksContainer.appendChild(renderTask(task));
				});
				taskContainer.remove();
			}
		} else if (event.target.className === 'delete-task'){
			var taskContainer = event.target.parentNode;
			var id = taskContainer.id;
			
			sendDeleteTaskReq(id).then(function(response){
				if(response.ok) {
					return;
				} 
			}).then(function(){
				taskContainer.remove();
			});
		}
	});

}

function sendEditTaskReq(taskContainer, id){
	
	var title = taskContainer.querySelector('.task-title').value;
	var description = taskContainer.querySelector('.task-description').value;

	return fetch('/api/tasks/' + id, {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			title: title,
			description: description
		})
	})
}

function sendDeleteTaskReq(id){
	return fetch('/api/tasks/' + id, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

function sendCreateTaskReq(taskContainer){

	var title = taskContainer.querySelector('.task-title').value;
	var description = taskContainer.querySelector('.task-description').value;

	return fetch('/api/tasks/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			title: title,
			description: description
		})
	})
}