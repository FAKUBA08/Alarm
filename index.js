let reminderTimeout;
let snoozeTimeout;
let display = document.querySelector('.display');
let acc = document.getElementsByClassName("accordion");
let arr = [];
let dataOut = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : [];
seen(dataOut);

function updateTime() {
    let now = new Date();
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('currentTime').textContent = `${hours}:${minutes}:${seconds}`;
}

function setReminder() {
    let hours = parseInt(document.getElementById('hours').value);
    let minutes = parseInt(document.getElementById('minutes').value);
    let note = document.getElementById('note').value;
    let showMe = document.getElementById('showMe');
    let show = document.querySelector('.show');
    let notes1 = document.querySelector('.notes1');
    let box2Inner2 = document.querySelector('.box2Inner2');
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        alert('Please enter valid hours and minutes (0-23 for hours, 0-59 for minutes).');
        return;
    }

    let now = new Date();
    let reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    let currentTime = now.getTime();
    let reminderMe = reminderTime.getTime();

    let timeDiff = reminderMe - currentTime;
    if (timeDiff <= 0) {
        alert('Please enter a future time.');
        return;
    }

    let details = { hour: hours, minute: minutes, notes: note };
    arr.push(details);
    console.log(arr);
    localStorage.setItem('data', JSON.stringify(arr));
    dataOut = JSON.parse(localStorage.getItem('data'));
    seen(dataOut);

    reminderTimeout = setTimeout(function() {
        box2Inner2.style.display = "block";
        showMe.innerHTML = note;
        notes1.style.display = "none";
        show.style.display = "block";
        document.getElementById('audio').play();
    }, timeDiff);
    clearFields();
}

function seen(arr) {
    display.innerHTML = "";
    arr.forEach(function(el, i) {
        display.innerHTML += `<h4 id="pop" >${el.hour}:${el.minute}-- ${el.notes}  <button onclick="deleteBtn(${i})" id="BtnInner" class="BtnInner">Delete</button> <button onclick="snoozeBtn('${el.notes}')" id="Snooze" class="BtnInner">Snooze</button></h4>`;
    });
}

function deleteBtn(index) {
    arr.splice(index, 1);
    display.innerHTML = "";
    localStorage.setItem('data', JSON.stringify(arr));
    dataOut = JSON.parse(localStorage.getItem('data'));
    seen(dataOut);
    clearFields();
    console.log(arr);
}

function clearFields() {
    document.getElementById('hours').value = '';
    document.getElementById('minutes').value = '';
    document.getElementById('note').value = '';
}

function snoozeBtn(note) {
    clearTimeout(reminderTimeout);
    let show = document.querySelector('.show');
    let notes1 = document.querySelector('.notes1');
    let box2Inner2 = document.querySelector('.box2Inner2');
    box2Inner2.style.display = "none";
    notes1.style.display = "block";
    show.style.display = "none";
    document.getElementById('audio').pause();
    alert('Alarm snoozed for 2 minutes')
    
    snoozeTimeout = setTimeout(function() {
        box2Inner2.style.display = "block";
        notes1.style.display = "none";
        show.style.display = "block";
        document.getElementById('audio').play();
    }, 120000); // Snooze for 2 minute
}

setInterval(updateTime, 1000);

function cancelDismiss() {
    if (confirm("ARE YOU SURE YOU WANT TO DISMISS")) {
        show = document.querySelector(".show").style.display = "none";
        notes1 = document.querySelector(".notes1").style.display = "block";
        box2Inner2 = document.querySelector(".box2Inner2").style.display = "none";
        document.getElementById('audio').pause();
    } else {}
}

window.onload = function() {
    dataOut.forEach(function(el) {
        let now = new Date();
        let reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), el.hour, el.minute);
        let currentTime = now.getTime();
        let reminderMe = reminderTime.getTime();
        let timeDiff = reminderMe - currentTime;
        if (timeDiff > 0) {
            reminderTimeout = setTimeout(function() {
            show = document.querySelector(".show").style.display = "block";
            showMe.innerHTML = `${el.notes}`;
            notes1 = document.querySelector(".notes1").style.display = "none";
            box2Inner2 = document.querySelector(".box2Inner2").style.display = "block";
            document.getElementById('audio').play();
            }, timeDiff);
        }
    });
};

for (let index = 0; index < acc.length; index++) {
    acc[index].addEventListener('click', function() {
        let displayCon = this.nextElementSibling;
        if (displayCon.style.display === "block") {
            displayCon.style.display = "none";
        } else {
            displayCon.style.display = "block";
        }
    });
}

