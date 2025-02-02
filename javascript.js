//Get data from localStorage
function getTasks(){
    let tasks=[];
    if(localStorage.getItem("tasks")){
        tasks=JSON.parse(localStorage.getItem("tasks"));
    }
    return tasks;
}

//render Task details in Table Format
function renderTasks(){
    console.log(get.tasks());
}
//initial call
renderTasks();