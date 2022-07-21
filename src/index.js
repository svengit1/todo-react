import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from "react";
// import './index.css';
const page_elements = {}
page_elements.new_task_input_box = document.getElementById("new_task_input_box");
page_elements.select_all_btn = document.getElementById("select_all_btn")
page_elements.all_tasks_link = document.getElementById("all_tasks")
page_elements.active_tasks_link = document.getElementById("all_active_tasks")
page_elements.completed_tasks_link = document.getElementById("all_completed_tasks")



function set_active_task_group(group){
  document.getElementById("all_completed_tasks").setAttribute("class", "nav-link")
  document.getElementById("all_active_tasks").setAttribute("class", "nav-link")
  document.getElementById("all_tasks").setAttribute("class", "nav-link")
  if (group === "completed"){
      document.getElementById("all_completed_tasks").setAttribute("class", "nav-link active")
  } else if (group === "active"){
      document.getElementById("all_active_tasks").setAttribute("class", "nav-link active")
  } else{
      document.getElementById("all_tasks").setAttribute("class", "nav-link active")
  }
}

function uidPart(){
  var part = (Math.random() * 46656) | 0;
  part = ("000" + part.toString(36)).slice(-3);
  return part
}

export function generateUID() {
  return uidPart() + uidPart();
}

function TaskBox(props){
  var checkbox;
  if (props.value.completed){
    checkbox = <input className="form-check-input mt-0" type="checkbox" aria-label="Checkbox for following text input" id={"checkbox-" + props.value.uid.toString()} onChange={props.handleChange} checked></input>
  } else{
    checkbox = <input className="form-check-input mt-0" type="checkbox" aria-label="Checkbox for following text input" id={"checkbox-" + props.value.uid.toString()} onChange={props.handleChange}></input>
  }
  return(
    <div className="input-group mb-3" id={"group-" + props.value.uid.toString()}>
    <div className="input-group-text">
      {checkbox}
    </div>
    <input type="text" className="form-control" aria-label="Text input with checkbox" defaultValue={props.value.task}></input>
  </div>
  )
}

function TaskList(props){
  const results = []
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')

  page_elements.new_task_input_box.addEventListener("keypress", (event)=> {
    if (event.keyCode === 13) { // key code of the keybord key
      event.preventDefault();
    enter_key_handler()
    }
  });

  function enter_key_handler(){
    if (page_elements.new_task_input_box.value){
        addTask({"task": page_elements.new_task_input_box.value, "completed": false, "uid": generateUID()})
        page_elements.new_task_input_box.value = ""
    }
  }
  
  page_elements.all_tasks_link.addEventListener("click", filterAll)
  page_elements.active_tasks_link.addEventListener("click", filterActive)
  page_elements.completed_tasks_link.addEventListener("click", filterCompleted)
  

  function filterAll() {
    setFilter('all');
  }

  function filterActive() {
    setFilter('active');
  }

  function filterCompleted() {
    setFilter('completed');
  }

  function addTask(new_task) {
    setTasks((tasks) => [...tasks, new_task])
  }

  function handleChange(taskId){
    setTasks((tasks) => 
    {const t = tasks.slice()
      if (document.getElementById("checkbox-" + taskId).checked === true){
      for (let task of t){
          if (task.uid === taskId){
              task.completed = true
              break;
          }
      }
      } else{
          for (let task of t){
              if (task.uid === taskId){
                  task.completed = false
                  break;
              }
          }
      }
      return t;
    })
    console.log("New tasks state", tasks)  
  }

  let t;
  if (filter === 'all') {
     t = tasks
  } else if (filter === 'active') {
     t = tasks.filter(task => task.completed === false)
  } else {
     t = tasks.filter(task => task.completed === true)
  }

  t.forEach(task => {
    results.push(
      <TaskBox key = {task.uid} 
               value = {task}
               handleChange = {() => handleChange(task.uid)}
      />
    )
  });
  return (
    <div>
      {results}
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById("task_list"));
root.render(<TaskList></TaskList>);