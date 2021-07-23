// Accessing input fields
const taskInputField = document.querySelector("#task");
const timeInputField = document.querySelector("#time");
const descriptionInputField = document.querySelector("#description");

function createNew() {
    taskInputField.classList.remove("hidden");
    descriptionInputField.classList.remove("hidden");
    timeInputField.classList.remove("hidden");
    document.querySelector("#createItem").classList.remove("hidden");
}

// Reference to firebase
const RDreference = firebase.database().ref();

// Define task array
var tasks = []; //this will store all the tasks

console.log("script running");

// Storage
let Storage = window.sessionStorage;

// Load data from session storage.
// This loads the tasks from session storage and puts them in our array.
window.onload = function() {
  RDreference.on('value', (snapshot) => {
    var ul = document.querySelector("#mainList");
    ul.innerHTML = "";
    tasks = [];
    const data = snapshot.val();
    var i = 0;

    /*
    <div class="tile is-ancestor">
      ${displayContent(i)}
      ${displayContent(i + 1)}    
      </div>`;
    */
    
    for (item in data) {
        console.log(data[item]);
        tasks.push(data[item]);
        tasks[i]["key"] = item;
        if (!(i % 2) == 0) {
            document.querySelector("#mainList").innerHTML += 
            `<div class="tile is-ancestor">
                ${displayList(i - 1)}
                ${displayList(i)}    
              </div>`;
        }
        ++i;
    }
  });
};

function displayList(index) {
  var content;
  if (!("completed" in tasks[index]) || tasks[index]["completed"] == false) {
    // Construct card content
    content = incompleteCard(index);
  } else {
    // Construct card content
    content = completedCard(index);
  }
  return content;
}

function removeItem(index) {
  var ul = document.querySelector("#mainList");
  var candidate = document.querySelector("#I" + index);
  RDreference.child(tasks[index]["key"]).remove();
  tasks.splice(index, 1);
  ul.removeChild(candidate);
}

function markCompleted(index) {
  var candidate = document.querySelector("#I" + index);

  // Construct card content
  const content = innerCompletedCard(index);
  candidate.innerHTML = content;
  tasks[index]["completed"] = true;

  RDreference.child(tasks[index]["key"]).update(tasks[index]);
}

function markIncomplete(index) {
  var candidate = document.querySelector("#I" + index);

  // Construct card content
  const content = innerIncompletedCard(index);
  candidate.innerHTML = content;
  tasks[index]["completed"] = false;

  RDreference.child(tasks[index]["key"]).update(tasks[index]);
}

function innerIncompletedCard(index) {
    return `<div class="card">
  <header class="card-header">
    <p class="card-header-title">
      ${tasks[index]["title"]}
    </p>
  </header>
  
  <div class="card-content has-text-centered">
    <div class="content">
      <b>Description: </b>${tasks[index]["description"]}
      <br>
      <time datetime="2016-1-1">
      <b>Deadline: </b>${tasks[index]["time"]}</time>
    </div>
  </div>
  <footer class="card-footer">
    <a href="#" class="card-footer-item" type="button" onclick="markCompleted(${index})">Mark Completed</a>
    <a href="#" class="card-footer-item" type="button" onclick="removeItem(${index})">Delete</a>
  </footer>
</div>`;
}

function innerCompletedCard(index) {
    return `<div class="card has-background-success">
  <header class="card-header">
    <p class="card-header-title">
      ${tasks[index]["title"]}
    </p>
    <p class="card-header-subtitle">
      &#10004;
    </p>
  </header>
  
  <div class="card-content has-text-centered">
    <div class="content">
      <b>Description:</b> ${tasks[index]["description"]}
      <br>
      <time datetime="2016-1-1">
      <b>Deadline:</b> ${tasks[index]["time"]}</time>
    </div>
  </div>
  <footer class="card-footer">
    <a href="#" class="card-footer-item" type="button" onclick="markIncomplete(${index})">Mark Incomplete</a>
    <a href="#" class="card-footer-item" type="button" onclick="removeItem(${index})">Delete</a>
  </footer>
</div> `;
}

function completedCard(index) {
    return `<div class="column is-half m-1"  id="${"I" + index}">
  <div class="card has-background-success">
  <header class="card-header">
    <p class="card-header-title">
      ${tasks[index]["title"]}
    </p>
    <p class="card-header-subtitle">
      &#10004;
    </p>
  </header>
  
  <div class="card-content has-text-centered">
    <div class="content">
      <b>Description:</b> ${tasks[index]["description"]}
      <br>
      <time datetime="2016-1-1">
      <b>Deadline:</b> ${tasks[index]["time"]}</time>
    </div>
  </div>
  <footer class="card-footer">
    <a href="#" class="card-footer-item" type="button" onclick="markIncomplete(${index})">Mark Incomplete</a>
    <a href="#" class="card-footer-item" type="button" onclick="removeItem(${index})">Delete</a>
  </footer>
</div>  </div>`;
}

function incompleteCard(index) {
    return `<div class="column is-half  m-1"  id="${"I" + index}">
  <div class="card">
  <header class="card-header">
    <p class="card-header-title">
      ${tasks[index]["title"]}
    </p>
  </header>
  
  <div class="card-content has-text-centered">
    <div class="content">
      <b>Description: </b>${tasks[index]["description"]}
      <br>
      <time datetime="2016-1-1">
      <b>Deadline: </b>${tasks[index]["time"]}</time>
    </div>
  </div>
  <footer class="card-footer">
    <a href="#" class="card-footer-item" type="button" onclick="markCompleted(${index})">Mark Completed</a>
    <a href="#" class="card-footer-item" type="button" onclick="removeItem(${index})">Delete</a>
  </footer>
</div> </div> `;
}

function addItem() {
    addItem_impl(taskInputField.value, timeInputField.value, descriptionInputField.value);

    //taskInputField.classList.add("hidden");
    //descriptionInputField.classList.add("hidden");
    //timeInputField.classList.add("hidden");
    taskInputField.value = "";
    descriptionInputField.value = "";
    timeInputField.value = "";
}

function addItem_impl(t, time, d) {
    var newItem = {
        title: t,
        time: time,
        description: d
    };
    tasks.push(newItem);
  
    RDreference.push(newItem); // store in RD
}
