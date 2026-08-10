let tasks = [];  
const button = document.getElementById("addtask");
const savedTasks = localStorage.getItem("tasks")
const input = document.getElementById("todotext")
const list = document.getElementById("tasklist");
const clearCompleted = document.getElementById("clearcompleted")

if(savedTasks){
    tasks =JSON.parse(savedTasks);
}

function renderTask(task){
    
    const li = document.createElement("li");
    li.dataset.id = task.id;
    const taskText = document.createElement("span")
    taskText.textContent = task.text;
    if(task.completed){
        li.classList.add("completed");
    }
    li.appendChild(taskText);

    
    const editbtn = document.createElement("button");
    editbtn.textContent = "Edit";
    editbtn.classList.add("edit-btn");
    li.appendChild(editbtn)
    editbtn.addEventListener("click",(event)=>{
        event.stopPropagation();

        if(li.querySelector("input")){
            return;
        }

        const editInput = document.createElement("input")
        editInput.value = task.text;
        editInput.addEventListener("click",(event)=>{
            event.stopPropagation();
        })

        li.prepend(editInput);
        li.classList.add("editing");


        editInput.addEventListener("keydown",(event)=>{
            if(event.key === "Enter"){
                task.text = editInput.value;

                localStorage.setItem("tasks",JSON.stringify(tasks))

                taskText.textContent = task.text;   
                editInput.remove();
                li.classList.remove("editing");
            }
        })

        editInput.addEventListener("keydown",(event)=>{
            if(event.key === "Escape"){
                editInput.remove();
                li.classList.remove("editing");
            }
        })
    })

    
    const deletebtn = document.createElement("button"); 
    deletebtn.textContent = "Delete"
    deletebtn.addEventListener("click",(event)=>{
        event.stopImmediatePropagation();
        const index = tasks.findIndex(task => task.id === li.dataset.id);
        tasks.splice(index,1);
        localStorage.setItem("tasks",JSON.stringify(tasks))
        list.removeChild(li);
    })
    deletebtn.classList.add("delete-btn");

    
    li.addEventListener("click",(event)=>{
        if (event.target === editbtn || event.target === deletebtn){
            return;
        }
        task.completed = !task.completed;
        li.classList.toggle("completed");
        localStorage.setItem("tasks",JSON.stringify(tasks));
    })

    li.appendChild(deletebtn);
    list.appendChild(li);
}

tasks.forEach(renderTask);

input.addEventListener("keydown",(event)=>{
    if (event.key === "Enter"){
        button.click();
    }
})

button.addEventListener("click", function(){
    const input = document.getElementById("todotext");
    const taskText = input.value;
    console.log(taskText);

    if(taskText.trim() === ""){
        return;
    }

    const task = {
        id: crypto.randomUUID(),
        text:taskText,
        completed: false
    }
    
    tasks.push(task);
    localStorage.setItem("tasks",JSON.stringify(tasks));
    renderTask(task);

    input.value = "";
})

clearCompleted.addEventListener("click",()=>{
    tasks = tasks.filter(task => !task.completed);

    list.innerHTML = "";

    tasks.forEach(renderTask);
});
