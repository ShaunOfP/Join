async function init(){
    await loadUsers();
    await loadTodos();
    updateTodoCount();
    updateDoneTasksCount();
    updateTasksInProgressCount();
    updateAwaitingfeedbackCount();
    updateTotalTodosCount();
    updateUrgentTodosCount();
}

/**
 * Updates the count of todos with the status 'todo'.
 * This function iterates through the global 'todos' array, counts how many todos have the status 'todo',
 * and then updates the text content of an HTML element with the ID 'toDoId' with this number.
 */

function updateTodoCount() {
    let openTodos = todos.filter((todo) => todo.status === "todo").length;
    document.getElementById('toDoId').innerText = openTodos;
}

/**
 * Updates the count of todos marked as 'done'.
 * Iterates through the global 'todos' array, counts the todos with the status 'done',
 * and updates the text content of the HTML element with the ID 'doneTasksCount' with this number.
 */
function updateDoneTasksCount() {
    let doneTodos = todos.filter((todo) => todo.status === "done").length;
    document.getElementById('doneTasksCount').innerText = doneTodos;
}

/**
 * Updates the count of todos that are currently in progress.
 * Goes through the 'todos' array, tallies todos with the status 'progress',
 * and then displays this count in the HTML element with the ID 'tasksInProgress'.
 */
function updateTasksInProgressCount() {
    let taskInProgressTodos = todos.filter((todo) => todo.status === "progress").length;
    document.getElementById('tasksInProgress').innerText = taskInProgressTodos;
}

/**
 * Updates the number of todos awaiting feedback.
 * Filters the 'todos' array for todos with the status 'feedback' and counts them.
 * The total is then shown in the HTML element identified by 'awaitingFeedback',
 * indicating how many tasks are pending review or feedback.
 */
function updateAwaitingfeedbackCount() {
    let feedbackTodos = todos.filter((todo) => todo.status === "feedback").length;
    document.getElementById('awaitingFeedback').innerText = feedbackTodos;
}

/**
 * Updates the total count of todos.
 * Simply retrieves the length of the global 'todos' array and updates
 * the 'totalTodos' HTML element with this value, offering a quick view of all the tasks.
 */
function updateTotalTodosCount() {
    let totalTodos = todos.length; 
    document.getElementById('totalTodos').innerText = totalTodos;
}

/**
 * Updates the count of todos with an 'urgent' priority.
 * Filters the 'todos' array for todos marked as 'urgent', counts them,
 * and displays this number in the 'urgentAmount' HTML element.
 */
function updateUrgentTodosCount() {
    let urgentTodosCount = todos.filter(todo => todo.priority === "urgent").length;
    document.getElementById('urgentAmount').innerText = urgentTodosCount;
}

