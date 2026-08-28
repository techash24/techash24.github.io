/* ==========================================
   TECHASH24 Calculator v4.0
   Calculator Logic
========================================== */

const display = document.getElementById("display");
const historyPopup = document.getElementById("historyPopup");
const historyBtn = document.getElementById("historyBtn");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

let history = JSON.parse(localStorage.getItem("history")) || [];

function appendValue(value){
    display.value += value;
}

function clearDisplay(){
    display.value = "";
}

function deleteLast(){
    display.value = display.value.slice(0,-1);
}

function toggleSign(){
    if(display.value === "") return;
    if(display.value.startsWith("-")){
        display.value = display.value.substring(1);
    } else {
        display.value = "-" + display.value;
    }
}

function saveHistory(expression, result) {
    const item = expression + " = " + result;
    history.unshift(item);
    if (history.length > 20) history.pop();
    localStorage.setItem("history", JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    historyList.innerHTML = "";
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-history">No history yet</p>';
        return;
    }

    history.forEach(function(item) {
        const div = document.createElement("div");
        div.className = "history-item";
        div.textContent = item;
        div.onclick = function() {
            display.value = item.split("=")[0].trim();
            historyPopup.style.display = "none";
        };
        historyList.appendChild(div);
    });
}

function calculate(){
    try{
        let expression = display.value.replace(
            /(\d+(\.\d+)?)%/g,
            "($1/100)"
        );

        const result = eval(expression);

        if(result === Infinity || result === -Infinity || isNaN(result)) {
            throw Error();
        }

        saveHistory(display.value, result);
        display.value = result;
    } catch {
        display.value = "Error";
        setTimeout(function(){
            display.value = "";
        },1000);
    }
}

historyBtn.onclick = function () {
    historyPopup.style.display =
        historyPopup.style.display === "flex" ? "none" : "flex";
};

clearHistoryBtn.onclick = function () {
    history = [];
    localStorage.removeItem("history");
    loadHistory();
};

window.addEventListener("click", function(e) {
    if(!historyPopup.contains(e.target) && !historyBtn.contains(e.target)) {
        historyPopup.style.display = "none";
    }
});

loadHistory();

/* ==========================================
   Keyboard Support
========================================== */

document.addEventListener("keydown", function (e) {
    const key = e.key;

    if (!isNaN(key)) {
        e.preventDefault();
        appendValue(key);
        return;
    }

    if (["+", "-", "*", "/", "."].includes(key)) {
        e.preventDefault();
        appendValue(key);
        return;
    }

    if (key === "%") {
        e.preventDefault();
        appendValue("%");
        return;
    }

    if (key === "Enter") {
        e.preventDefault();
        calculate();
        return;
    }

    if (key === "Backspace") {
        e.preventDefault();
        deleteLast();
        return;
    }

    if (key === "Escape") {
        e.preventDefault();
        clearDisplay();
    }
});

/* ==========================================
   Display Cursor
========================================== */

const fakeCursor = document.getElementById("fakeCursor");

display.addEventListener("focus", function(){
    fakeCursor.style.display = "block";
});

display.addEventListener("blur", function(){
    fakeCursor.style.display = "none";
});

window.onload = function(){
    display.focus();
};

/* ==========================================
   Button Press Animation
========================================== */

document.querySelectorAll(".buttons button").forEach(function(btn){
    btn.addEventListener("click", function(){
        btn.style.transform = "scale(.92)";
        setTimeout(function(){
            btn.style.transform = "";
        },120);
    });
});

console.log("TECHASH24 Calculator v4.0 Loaded Successfully!");
