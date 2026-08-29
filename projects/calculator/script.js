/* ==========================================
   TECHASH24 Scientific Calculator v5.2
   Calculator Logic
========================================== */

const display = document.getElementById("display");
const historyPopup = document.getElementById("historyPopup");
const historyBtn = document.getElementById("historyBtn");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");
const angleModeBtn = document.getElementById("angleMode");
const scientificButtons = document.getElementById("scientificButtons");
const scientificToggle = document.getElementById("scientificToggle");

let history = JSON.parse(localStorage.getItem("history")) || [];
let angleMode = "DEG";

function appendValue(value){ display.value += value; }
function clearDisplay(){ display.value = ""; }
function deleteLast(){ display.value = display.value.slice(0,-1); }

function toggleSign(){
    if(display.value === "") return;
    if(display.value.startsWith("-")) display.value = display.value.substring(1);
    else display.value = "-" + display.value;
}

function saveHistory(expression, result){
    history.unshift(expression + " = " + result);
    if(history.length > 20) history.pop();
    localStorage.setItem("history", JSON.stringify(history));
    loadHistory();
}

function loadHistory(){
    historyList.innerHTML = "";
    if(history.length === 0){
        historyList.innerHTML = '<p class="empty-history">No history yet</p>';
        return;
    }
    history.forEach(function(item){
        const div = document.createElement("div");
        div.className = "history-item";
        div.textContent = item;
        div.onclick = function(){
            display.value = item.split("=")[0].trim();
            historyPopup.style.display = "none";
        };
        historyList.appendChild(div);
    });
}

function evaluateExpression(){
    const expression = display.value
        .replace(/(\d+(\.\d+)?)%/g, "($1/100)")
        .replace(/Math\.PI/g, "Math.PI")
        .replace(/Math\.E/g, "Math.E");
    const result = eval(expression);
    if(result === Infinity || result === -Infinity || Number.isNaN(result)) throw Error();
    return result;
}

function calculate(){
    try{
        const expression = display.value;
        const result = evaluateExpression();
        saveHistory(expression, result);
        display.value = formatResult(result);
    }catch{
        display.value = "Error";
        setTimeout(function(){ display.value = ""; },1000);
    }
}

function formatResult(value){
    if(Number.isInteger(value)) return String(value);
    return Number(value.toPrecision(12)).toString();
}

function toRadians(value){ return angleMode === "DEG" ? value * Math.PI / 180 : value; }

function scientificFunction(type){
    try{
        if(display.value.trim() === "") return;
        const value = evaluateExpression();
        let result;
        switch(type){
            case "sin": result = Math.sin(toRadians(value)); break;
            case "cos": result = Math.cos(toRadians(value)); break;
            case "tan": result = Math.tan(toRadians(value)); break;
            case "sqrt": if(value < 0) throw Error(); result = Math.sqrt(value); break;
            case "log": if(value <= 0) throw Error(); result = Math.log10(value); break;
            case "ln": if(value <= 0) throw Error(); result = Math.log(value); break;
            case "square": result = value ** 2; break;
            case "cube": result = value ** 3; break;
            case "inverse": if(value === 0) throw Error(); result = 1 / value; break;
            case "abs": result = Math.abs(value); break;
            case "factorial":
                if(value < 0 || !Number.isInteger(value) || value > 170) throw Error();
                result = factorial(value);
                break;
            default: return;
        }
        if(!Number.isFinite(result)) throw Error();
        saveHistory(type + "(" + display.value + ")", result);
        display.value = formatResult(result);
    }catch{
        display.value = "Error";
        setTimeout(function(){ display.value = ""; },1000);
    }
}

function factorial(n){
    let result = 1;
    for(let i = 2; i <= n; i++) result *= i;
    return result;
}

function toggleAngleMode(){
    angleMode = angleMode === "DEG" ? "RAD" : "DEG";
    angleModeBtn.textContent = angleMode;
}

function toggleScientificFunctions(){
    const isHidden = scientificButtons.classList.toggle("scientific-hidden");
    scientificToggle.textContent = isHidden ? "⌄" : "⌃";
    scientificToggle.title = isHidden ? "Show scientific functions" : "Hide scientific functions";
    scientificToggle.setAttribute("aria-label", scientificToggle.title);
    localStorage.setItem("scientificHidden", String(isHidden));
}

scientificToggle.onclick = toggleScientificFunctions;

if(localStorage.getItem("scientificHidden") === "true"){
    scientificButtons.classList.add("scientific-hidden");
    scientificToggle.textContent = "⌄";
    scientificToggle.title = "Show scientific functions";
    scientificToggle.setAttribute("aria-label", scientificToggle.title);
}

historyBtn.onclick = function(){
    historyPopup.style.display = historyPopup.style.display === "flex" ? "none" : "flex";
};

clearHistoryBtn.onclick = function(){
    history = [];
    localStorage.removeItem("history");
    loadHistory();
};

window.addEventListener("click", function(e){
    if(!historyPopup.contains(e.target) && !historyBtn.contains(e.target)) historyPopup.style.display = "none";
});

loadHistory();

document.addEventListener("keydown", function(e){
    const key = e.key;
    if(!isNaN(key)){ e.preventDefault(); appendValue(key); return; }
    if(["+","-","*","/",".","(",")"].includes(key)){ e.preventDefault(); appendValue(key); return; }
    if(key === "%"){ e.preventDefault(); appendValue("%"); return; }
    if(key === "Enter"){ e.preventDefault(); calculate(); return; }
    if(key === "Backspace"){ e.preventDefault(); deleteLast(); return; }
    if(key === "Escape"){ e.preventDefault(); clearDisplay(); }
});

const fakeCursor = document.getElementById("fakeCursor");
display.addEventListener("focus", function(){ fakeCursor.style.display = "block"; });
display.addEventListener("blur", function(){ fakeCursor.style.display = "none"; });
window.onload = function(){ display.focus(); };

document.querySelectorAll(".buttons button").forEach(function(btn){
    btn.addEventListener("click", function(){
        btn.style.transform = "scale(.92)";
        setTimeout(function(){ btn.style.transform = ""; },120);
    });
});

console.log("TECHASH24 Scientific Calculator v5.2 Loaded Successfully!");
