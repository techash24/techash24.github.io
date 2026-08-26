/* ==========================================
   TECHASH24 CALCULATOR v5.0
   Complete Calculator Logic
========================================== */

const display = document.getElementById("display");

const historyPopup = document.getElementById("historyPopup");
const historyBtn = document.getElementById("historyBtn");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

const fakeCursor = document.getElementById("fakeCursor");

let history = JSON.parse(localStorage.getItem("history")) || [];
let justCalculated = false;

const operators = ["+", "-", "*", "/"];


/* ==========================================
   DISPLAY
========================================== */

function appendValue(value) {

    // If result was just calculated and user enters a number,
    // start a fresh calculation.
    if (justCalculated && !operators.includes(value) && value !== "%") {
        display.value = "";
        justCalculated = false;
    }

    // Prevent invalid starting operators
    if (
        display.value === "" &&
        ["*", "/"].includes(value)
    ) {
        return;
    }

    // Prevent double operators
    const lastChar = display.value.slice(-1);

    if (
        operators.includes(lastChar) &&
        operators.includes(value)
    ) {
        return;
    }

    // Prevent multiple decimal points in the same number
    if (value === ".") {

        const parts = display.value.split(/[+\-*/]/);
        const currentNumber = parts[parts.length - 1];

        if (currentNumber.includes(".")) {
            return;
        }

        // If "." is first character or follows an operator
        if (
            display.value === "" ||
            operators.includes(lastChar)
        ) {
            display.value += "0";
        }
    }

    display.value += value;

    justCalculated = false;
}


/* ==========================================
   CLEAR
========================================== */

function clearDisplay() {

    display.value = "";
    justCalculated = false;

    if (fakeCursor) {
        fakeCursor.style.display = "block";
    }
}


/* ==========================================
   DELETE LAST CHARACTER
========================================== */

function deleteLast() {

    display.value = display.value.slice(0, -1);

    justCalculated = false;
}


/* ==========================================
   TOGGLE SIGN
========================================== */

function toggleSign() {

    if (display.value === "" || display.value === "Error") {
        return;
    }

    try {

        const value = Number(display.value);

        if (isNaN(value)) {
            return;
        }

        display.value = String(-value);

    } catch {

        return;

    }

}


/* ==========================================
   PERCENTAGE
========================================== */

function convertPercent(expression) {

    return expression.replace(
        /(\d+(?:\.\d+)?)%/g,
        "($1/100)"
    );

}


/* ==========================================
   VALIDATE EXPRESSION
========================================== */

function isValidExpression(expression) {

    if (!expression) {
        return false;
    }

    // Only allow calculator characters
    if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
        return false;
    }

    // Expression cannot end with operator
    if (/[+\-*/.]$/.test(expression)) {
        return false;
    }

    // Prevent obvious invalid sequences
    if (/[+\-*/]{2,}/.test(expression)) {
        return false;
    }

    return true;
}


/* ==========================================
   CALCULATE
========================================== */

function calculate() {

    try {

        let expression = display.value.trim();

        if (!isValidExpression(expression)) {
            throw new Error("Invalid expression");
        }

        expression = convertPercent(expression);

        /*
            Function() is used only after strict validation.
            The validation above allows only calculator characters.
        */
        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (
            typeof result !== "number" ||
            !Number.isFinite(result)
        ) {
            throw new Error("Invalid result");
        }

        // Avoid ugly floating-point results
        const roundedResult =
            Number.parseFloat(result.toFixed(12));

        saveHistory(
            display.value,
            roundedResult
        );

        display.value = roundedResult;

        justCalculated = true;

    }

    catch {

        display.value = "Error";
        justCalculated = true;

        setTimeout(() => {

            if (display.value === "Error") {
                display.value = "";
                justCalculated = false;
            }

        }, 1000);

    }

}


/* ==========================================
   HISTORY
========================================== */

function saveHistory(expression, result) {

    const item = {
        expression: expression,
        result: result
    };

    history.unshift(item);

    // Keep only last 20 calculations
    if (history.length > 20) {
        history.pop();
    }

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    loadHistory();
}


/* ==========================================
   LOAD HISTORY
========================================== */

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

        /*
            Supports both the new object format
            and old string-format history.
        */

        if (typeof item === "object") {

            div.innerHTML = `
                <div class="history-expression">
                    ${escapeHTML(item.expression)}
                </div>

                <div class="history-result">
                    = ${escapeHTML(String(item.result))}
                </div>
            `;

            div.onclick = function() {

                display.value =
                    item.expression;

                historyPopup.style.display =
                    "none";

                justCalculated = false;
            };

        } else {

            div.textContent = item;

            div.onclick = function() {

                display.value =
                    item.split("=")[0].trim();

                historyPopup.style.display =
                    "none";

                justCalculated = false;
            };
        }

        historyList.appendChild(div);

    });

}


/* ==========================================
   HTML ESCAPE
========================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* ==========================================
   HISTORY BUTTON
========================================== */

historyBtn.onclick = function(event) {

    event.stopPropagation();

    if (
        historyPopup.style.display === "flex"
    ) {

        historyPopup.style.display = "none";

    } else {

        historyPopup.style.display = "flex";
        loadHistory();

    }

};


/* ==========================================
   CLEAR HISTORY
========================================== */

clearHistoryBtn.onclick = function(event) {

    event.stopPropagation();

    history = [];

    localStorage.removeItem("history");

    loadHistory();

};


/* ==========================================
   CLOSE HISTORY POPUP
========================================== */

window.addEventListener("click", function(event) {

    if (
        historyPopup &&
        historyBtn &&
        !historyPopup.contains(event.target) &&
        !historyBtn.contains(event.target)
    ) {

        historyPopup.style.display = "none";

    }

});


/* ==========================================
   KEYBOARD SUPPORT
========================================== */

document.addEventListener("keydown", function(event) {

    const key = event.key;

    // Numbers
    if (/^[0-9]$/.test(key)) {

        appendValue(key);

        return;
    }


    // Operators
    if (operators.includes(key)) {

        appendValue(key);

        return;
    }


    // Decimal
    if (key === ".") {

        appendValue(".");

        return;
    }


    // Percentage
    if (key === "%") {

        appendValue("%");

        return;
    }


    // Enter / =
    if (
        key === "Enter" ||
        key === "="
    ) {

        event.preventDefault();

        calculate();

        return;
    }


    // Backspace
    if (key === "Backspace") {

        event.preventDefault();

        deleteLast();

        return;
    }


    // Escape
    if (key === "Escape") {

        clearDisplay();

        return;
    }

});


/* ==========================================
   MOUSE CLICK EFFECT
========================================== */

document.addEventListener(
    "mousedown",
    function() {

        const cursor =
            document.getElementById("cursor");

        if (cursor) {
            cursor.classList.add("active");
        }

    }
);


document.addEventListener(
    "mouseup",
    function() {

        const cursor =
            document.getElementById("cursor");

        if (cursor) {
            cursor.classList.remove("active");
        }

    }
);


/* ==========================================
   FAKE DISPLAY CURSOR
========================================== */

if (display && fakeCursor) {

    display.addEventListener(
        "focus",
        function() {

            fakeCursor.style.display =
                "block";

        }
    );


    display.addEventListener(
        "blur",
        function() {

            fakeCursor.style.display =
                "none";

        }
    );

}


/* ==========================================
   BUTTON PRESS ANIMATION
========================================== */

document
    .querySelectorAll(".buttons button")
    .forEach(function(button) {

        button.addEventListener(
            "mousedown",
            function() {

                button.classList.add("pressed");

            }
        );


        button.addEventListener(
            "mouseup",
            function() {

                button.classList.remove("pressed");

            }
        );


        button.addEventListener(
            "mouseleave",
            function() {

                button.classList.remove("pressed");

            }
        );

    });


/* ==========================================
   INITIALIZE
========================================== */

window.addEventListener(
    "load",
    function() {

        loadHistory();

        if (display) {
            display.focus();
        }

        console.log(
            "TECHASH24 Calculator v5.0 Loaded Successfully! 🚀"
        );

    }
);
