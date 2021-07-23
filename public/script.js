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
    for (item in data) {
        console.log(data[item]);
        tasks.push(data[item]);
        tasks[i]["key"] = item;
        displayList(i);
        ++i;
    }
  });
};

function displayList(index) {
  var content;
  if (!("completed" in tasks[index])) {
    // Construct card content
    content = incompleteCard(index);
  } else {
    // Construct card content
    content = completedCard(index);
  }
  document.querySelector("#mainList").innerHTML += content;
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
  const content = completedCard(index);
  candidate.innerHTML = content;
  tasks[index]["completed"] = true;

  RDreference.child(tasks[index]["key"]).update(tasks[index]);
}

function completedCard(index) {
    return `
  <div class="card has-background-success" id="${"I" + index}">
  <header class="card-header">
    <p class="card-header-title">
      ${tasks[index]["title"]}
    </p>
    <p class="card-header-subtitle">
      Completed
    </p>
  </header>
  
  <div class="card-content">
    <div class="content">
      ${tasks[index]["description"]}
      <br>
      <time datetime="2016-1-1">
      ${tasks[index]["time"]}</time>
    </div>
  </div>
  <footer class="card-footer">
    <a href="#" class="card-footer-item" type="button" onclick="markCompleted(${index})">Mark Completed</a>
    <a href="#" class="card-footer-item" type="button" onclick="removeItem(${index})">Delete</a>
  </footer>
</div>  `;
}

function incompleteCard(index) {
    return `
  <div class="card" id="${"I" + index}">
  <header class="card-header">
    <p class="card-header-title">
      ${tasks[index]["title"]}
    </p>
    <span class="icon">
        <i class="fas fa-check-square"></i>
      </span>
  </header>
  
  <div class="card-content">
    <div class="content">
      ${tasks[index]["description"]}
      <br>
      <time datetime="2016-1-1">
      ${tasks[index]["time"]}</time>
    </div>
  </div>
  <footer class="card-footer">
    <a href="#" class="card-footer-item" type="button" onclick="markCompleted(${index})">Mark Completed</a>
    <a href="#" class="card-footer-item" type="button" onclick="removeItem(${index})">Delete</a>
  </footer>
</div>  `;
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
