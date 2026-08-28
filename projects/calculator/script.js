/* ==========================================
   TECHASH24 Calculator v4.0
   Part 4
   Calculator Logic
========================================== */

const display = document.getElementById("display");

const historyPopup = document.getElementById("historyPopup");
const historyBtn = document.getElementById("historyBtn");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

let history = JSON.parse(localStorage.getItem("history")) || [];

/* ==========================
   Append Value
========================== */

function appendValue(value){

    display.value += value;

}

/* ==========================
   Clear Display
========================== */

function clearDisplay(){

    display.value = "";

}

/* ==========================
   Delete Last Character
========================== */

function deleteLast(){

    display.value =
    display.value.slice(0,-1);

}

/* ==========================
   Toggle + / -
========================== */

function toggleSign(){

    if(display.value==="") return;

    if(display.value.startsWith("-")){

        display.value =
        display.value.substring(1);

    }

    else{

        display.value =
        "-" + display.value;

    }

}

/* ==========================
   Percentage
========================== */

function convertPercent(expression){

    return expression.replace(/(\d+(\.\d+)?)%/g,function(match,num){

        return "(" + num + "/100)";

    });

}

/* ==========================
   Calculate
========================== */

function calculate(){

    try{

        let expression =
        convertPercent(display.value);

        const result =
        eval(expression);

        saveHistory(display.value,result);

        display.value=result;

    }

    catch{

        display.value="Error";

        setTimeout(function(){

            display.value="";

        },1200);

    }

}
/* ==========================================
   PART 5
   History System
========================================== */

function saveHistory(expression, result) {

    const item = expression + " = " + result;

    history.unshift(item);

    if (history.length > 20) {
        history.pop();
    }

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    loadHistory();

}

function loadHistory() {

    historyList.innerHTML = "";

    if (history.length === 0) {

        historyList.innerHTML =
        '<p class="empty-history">No history yet</p>';

        return;

    }

    history.forEach(function(item) {

        const div =
        document.createElement("div");

        div.className = "history-item";

        div.textContent = item;

        div.onclick = function() {

            display.value =
            item.split("=")[0].trim();

            historyPopup.style.display = "none";

        };

        historyList.appendChild(div);

    });

}

/* ==========================
   History Button
========================== */

historyBtn.onclick = function () {

    if (historyPopup.style.display === "flex") {

        historyPopup.style.display = "none";

    } else {

        historyPopup.style.display = "flex";

    }

};

/* ==========================
   Clear History
========================== */

clearHistoryBtn.onclick = function () {

    history = [];

    localStorage.removeItem("history");

    loadHistory();

};

/* ==========================
   Close Popup
========================== */

window.addEventListener("click", function(e) {

    if (
        !historyPopup.contains(e.target) &&
        !historyBtn.contains(e.target)
    ) {

        historyPopup.style.display = "none";

    }

});

/* ==========================
   Load History on Startup
========================== */

loadHistory();
/* ==========================================
   PART 6
   Keyboard + Custom Cursor
========================================== */

/* ==========================
   Keyboard Support
========================== */

document.addEventListener("keydown", function (e) {

    const key = e.key;

    // Numbers
    if (!isNaN(key)) {
        appendValue(key);
        return;
    }

    // Operators
    if (["+", "-", "*", "/", "."].includes(key)) {
        appendValue(key);
        return;
    }

    // Percentage
    if (key === "%") {
        appendValue("%");
        return;
    }

    // Enter = Calculate
    if (key === "Enter") {
        e.preventDefault();
        calculate();
        return;
    }

    // Backspace
    if (key === "Backspace") {
        deleteLast();
        return;
    }

    // Escape = Clear
    if (key === "Escape") {
        clearDisplay();
        return;
    }

});

/* Mouse Click Effect */

document.addEventListener("mousedown", function(){

    cursor.classList.add("active");

});

document.addEventListener("mouseup", function(){

    cursor.classList.remove("active");

});

/* ==========================
   Display Cursor
========================== */

const fakeCursor =
document.getElementById("fakeCursor");

display.addEventListener("focus", function(){

    fakeCursor.style.display = "block";

});

display.addEventListener("blur", function(){

    fakeCursor.style.display = "none";

});

/* ==========================
   Initial Focus
========================== */

window.onload = function(){

    display.focus();

};
/* ==========================================
   PART 7
   Final Improvements
========================================== */

/* ==========================
   Prevent Double Operators
========================== */

const operators = ["+", "-", "*", "/", "."];

const oldAppendValue = appendValue;

appendValue = function(value){

    const lastChar =
    display.value.slice(-1);

    if(
        operators.includes(lastChar) &&
        operators.includes(value)
    ){
        return;
    }

    oldAppendValue(value);

};

/* ==========================
   Better Percentage
========================== */

const oldCalculate = calculate;

calculate = function(){

    try{

        let expression = display.value;

        expression = expression.replace(
            /(\d+(\.\d+)?)%/g,
            "($1/100)"
        );

        const result = eval(expression);

        if(
            result === Infinity ||
            result === -Infinity ||
            isNaN(result)
        ){

            throw Error();

        }

        saveHistory(display.value,result);

        display.value=result;

    }

    catch{

        display.value="Error";

        setTimeout(function(){

            display.value="";

        },1000);

    }

};

/* ==========================
   Button Press Animation
========================== */

document.querySelectorAll(".buttons button")
.forEach(function(btn){

    btn.addEventListener("click",function(){

        btn.style.transform="scale(.92)";

        setTimeout(function(){

            btn.style.transform="";

        },120);

    });

});

/* ==========================
   Calculator Ready
========================== */

console.log(
    "TECHASH24 Calculator v4.0 Loaded Successfully!"
);
