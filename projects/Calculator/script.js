"use strict";

/* =========================================================
   ONE UI CALCULATOR
   ========================================================= */

/* ---------- STATE ---------- */

let expression = "";
let lastExpression = "";
let memory = Number(localStorage.getItem("oneUI_memory") || 0);
let history = loadHistory();
let justCalculated = false;
let angleMode = "DEG";


/* ---------- DOM ---------- */

const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");

const scientificPanel = document.getElementById("scientificPanel");
const standardMode = document.getElementById("standardMode");
const scientificMode = document.getElementById("scientificMode");
const modeTitle = document.getElementById("modeTitle");

const aiPanel = document.getElementById("aiPanel");
const aiInput = document.getElementById("aiInput");
const aiAnswer = document.getElementById("aiAnswer");

const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");


/* =========================================================
   STORAGE
   ========================================================= */

function loadHistory() {
    try {
        const saved = localStorage.getItem("oneUI_history");

        if (!saved) {
            return [];
        }

        const parsed = JSON.parse(saved);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveHistory() {
    localStorage.setItem(
        "oneUI_history",
        JSON.stringify(history)
    );
}


/* =========================================================
   NUMBER FORMATTING
   ========================================================= */

function formatNumber(value) {
    if (!Number.isFinite(value)) {
        return "Error";
    }

    if (Math.abs(value) < 1e-12) {
        value = 0;
    }

    const rounded = Number(value.toPrecision(12));

    return rounded.toLocaleString("en-US", {
        maximumFractionDigits: 10,
        useGrouping: true
    });
}


/* =========================================================
   TOKENIZER
   ========================================================= */

function tokenize(input) {
    const tokens = [];

    let i = 0;

    while (i < input.length) {
        const char = input[i];

        if (/\s/.test(char)) {
            i++;
            continue;
        }

        if (/[0-9.]/.test(char)) {
            let number = "";

            while (
                i < input.length &&
                /[0-9.]/.test(input[i])
            ) {
                number += input[i];
                i++;
            }

            if (
                number === "." ||
                (number.match(/\./g) || []).length > 1
            ) {
                throw new Error("Invalid number");
            }

            tokens.push({
                type: "number",
                value: Number(number)
            });

            continue;
        }

        if (char === "π") {
            tokens.push({
                type: "number",
                value: Math.PI
            });

            i++;
            continue;
        }

        if ("+-×÷*/^()".includes(char)) {
            tokens.push({
                type: "operator",
                value: char
            });

            i++;
            continue;
        }

        if (char === "%") {
            tokens.push({
                type: "percent",
                value: "%"
            });

            i++;
            continue;
        }

        const functionNames = [
            "sin",
            "cos",
            "tan",
            "log",
            "sqrt"
        ];

        let foundFunction = false;

        for (const name of functionNames) {
            if (input.slice(i, i + name.length).toLowerCase() === name) {
                tokens.push({
                    type: "function",
                    value: name
                });

                i += name.length;
                foundFunction = true;
                break;
            }
        }

        if (foundFunction) {
            continue;
        }

        throw new Error("Invalid character");
    }

    return tokens;
}


/* =========================================================
   PARSER
   ========================================================= */

function evaluateExpression(input) {
    const tokens = tokenize(input);

    if (!tokens.length) {
        throw new Error("Empty expression");
    }

    let position = 0;

    function peek() {
        return tokens[position];
    }

    function consume() {
        return tokens[position++];
    }

    function parseExpression() {
        let value = parseTerm();

        while (peek() && (
            peek().value === "+" ||
            peek().value === "−" ||
            peek().value === "-"
        )) {
            const operator = consume().value;
            const right = parseTerm();

            if (operator === "+") {
                value += right;
            } else {
                value -= right;
            }
        }

        return value;
    }

    function parseTerm() {
        let value = parsePower();

        while (peek() && (
            peek().value === "×" ||
            peek().value === "*" ||
            peek().value === "÷" ||
            peek().value === "/"
        )) {
            const operator = consume().value;
            const right = parsePower();

            if (operator === "×" || operator === "*") {
                value *= right;
            } else {
                if (right === 0) {
                    throw new Error("Division by zero");
                }

                value /= right;
            }
        }

        return value;
    }

    function parsePower() {
        let value = parseUnary();

        if (peek() && peek().value === "^") {
            consume();

            const exponent = parsePower();

            value = Math.pow(value, exponent);
        }

        return value;
    }

    function parseUnary() {
        if (peek() && peek().value === "+") {
            consume();
            return parseUnary();
        }

        if (peek() && (
            peek().value === "-" ||
            peek().value === "−"
        )) {
            consume();
            return -parseUnary();
        }

        return parsePrimary();
    }

    function parsePrimary() {
        const token = peek();

        if (!token) {
            throw new Error("Incomplete expression");
        }

        if (token.type === "number") {
            consume();

            let value = token.value;

            if (peek() && peek().type === "percent") {
                consume();
                value /= 100;
            }

            return value;
        }

        if (token.type === "function") {
            const functionName = consume().value;

            if (!peek() || peek().value !== "(") {
                throw new Error("Function needs parentheses");
            }

            consume();

            const value = parseExpression();

            if (!peek() || peek().value !== ")") {
                throw new Error("Missing )");
            }

            consume();

            let result;

            if (functionName === "sqrt") {
                if (value < 0) {
                    throw new Error("Invalid square root");
                }

                result = Math.sqrt(value);
            }

            if (functionName === "log") {
                if (value <= 0) {
                    throw new Error("Invalid logarithm");
                }

                result = Math.log10(value);
            }

            if (functionName === "sin") {
                result = Math.sin(toRadians(value));
            }

            if (functionName === "cos") {
                result = Math.cos(toRadians(value));
            }

            if (functionName === "tan") {
                const radians = toRadians(value);

                if (Math.abs(Math.cos(radians)) < 1e-12) {
                    throw new Error("Undefined tangent");
                }

                result = Math.tan(radians);
            }

            if (!Number.isFinite(result)) {
                throw new Error("Invalid result");
            }

            if (peek() && peek().type === "percent") {
                consume();
                result /= 100;
            }

            return result;
        }

        if (token.value === "(") {
            consume();

            const value = parseExpression();

            if (!peek() || peek().value !== ")") {
                throw new Error("Missing )");
            }

            consume();

            if (peek() && peek().type === "percent") {
                consume();
                return value / 100;
            }

            return value;
        }

        throw new Error("Unexpected token");
    }

    const result = parseExpression();

    if (position < tokens.length) {
        throw new Error("Invalid expression");
    }

    if (!Number.isFinite(result)) {
        throw new Error("Invalid result");
    }

    return result;
}


/* =========================================================
   ANGLES
   ========================================================= */

function toRadians(value) {
    if (angleMode === "RAD") {
        return value;
    }

    return value * Math.PI / 180;
}


/* =========================================================
   DISPLAY
   ========================================================= */

function updateDisplay() {
    expressionEl.textContent =
        expression || lastExpression || "";

    if (!expression) {
        resultEl.textContent =
            lastExpression ? lastExpression : "0";

        return;
    }

    try {
        const value = evaluateExpression(expression);

        resultEl.textContent = formatNumber(value);
    } catch {
        resultEl.textContent = "…";
    }
}


/* =========================================================
   APPEND VALUES
   ========================================================= */

function appendValue(value) {

    if (justCalculated) {
        expression = "";
        lastExpression = "";
        justCalculated = false;
    }

    if (value === ".") {
        const currentNumber = expression.split(/[+−×÷*/()^]/).pop();

        if (currentNumber.includes(".")) {
            return;
        }

        if (
            !expression ||
            /[+−×÷*/^(]$/.test(expression)
        ) {
            expression += "0.";
            updateDisplay();
            return;
        }
    }

    if (
        ["+", "−", "×", "÷", "*", "/"].includes(value)
    ) {
        if (!expression) {
            if (value === "−") {
                expression = "−";
                updateDisplay();
            }

            return;
        }

        if (/[+−×÷*/]$/.test(expression)) {
            expression = expression.slice(0, -1);
        }
    }

    expression += value;

    updateDisplay();
}


/* =========================================================
   CLEAR
   ========================================================= */

function clearCalculator() {
    expression = "";
    lastExpression = "";
    justCalculated = false;

    updateDisplay();
}


/* =========================================================
   BACKSPACE
   ========================================================= */

function backspace() {
    if (!expression) {
        return;
    }

    expression = expression.slice(0, -1);

    updateDisplay();
}


/* =========================================================
   PARENTHESES
   ========================================================= */

function toggleParenthesis() {
    if (!expression) {
        expression = "(";
        updateDisplay();
        return;
    }

    const opens =
        (expression.match(/\(/g) || []).length;

    const closes =
        (expression.match(/\)/g) || []).length;

    const last = expression[expression.length - 1];

    if (
        opens > closes &&
        !/[+−×÷*/^(]$/.test(expression)
    ) {
        expression += ")";
    } else {
        if (
            /[0-9π)]$/.test(last)
        ) {
            expression += "×(";
        } else {
            expression += "(";
        }
    }

    updateDisplay();
}


/* =========================================================
   PERCENTAGE
   ========================================================= */

function percentage() {
    if (!expression) {
        return;
    }

    const match = expression.match(
        /(\d+(?:\.\d+)?)$/
    );

    if (!match) {
        return;
    }

    expression += "%";

    updateDisplay();
}


/* =========================================================
   CALCULATE
   ========================================================= */

function calculate() {
    if (!expression) return;

    try {
        let completedExpression = expression;

        const open =
            (completedExpression.match(/\(/g) || []).length;

        const close =
            (completedExpression.match(/\)/g) || []).length;

        if (open > close) {
            completedExpression += ")".repeat(open - close);
        }

        const value = evaluateExpression(completedExpression);

        const formatted = formatNumber(value);

        lastExpression = `${completedExpression} =`;

        addHistory(completedExpression, formatted);

        expression = String(
            Number(value.toPrecision(12))
        );

        justCalculated = true;

        expressionEl.textContent = lastExpression;
        resultEl.textContent = formatted;

    } catch (error) {
        console.error(error);
        resultEl.textContent = "Error";
    }
}


/* =========================================================
   SCIENTIFIC FUNCTIONS
   ========================================================= */

function scientificAction(action) {

    if (action === "pi") {
        if (justCalculated) {
            expression = "";
            lastExpression = "";
            justCalculated = false;
        }

        expression += "π";
        updateDisplay();
        return;
    }

    if (action === "power") {
        if (!expression) {
            return;
        }

        expression += "^";
        updateDisplay();
        return;
    }

    if (action === "square") {
        if (!expression) {
            return;
        }

        expression = `(${expression})^2`;

        updateDisplay();
        return;
    }

    const functions = {
        sin: "sin(",
        cos: "cos(",
        tan: "tan(",
        log: "log(",
        sqrt: "sqrt("
    };

    if (functions[action]) {
        if (justCalculated) {
            expression = "";
            lastExpression = "";
            justCalculated = false;
        }

        if (
            expression &&
            /[0-9π)]$/.test(expression)
        ) {
            expression += "×";
        }

        expression += functions[action];

        updateDisplay();
    }
}


/* =========================================================
   MEMORY
   ========================================================= */

function getCurrentValue() {
    if (!expression) {
        return 0;
    }

    try {
        return evaluateExpression(expression);
    } catch {
        return 0;
    }
}

function memoryAction(action) {
    const value = getCurrentValue();

    if (action === "MC") {
        memory = 0;
    }

    if (action === "M+") {
        memory += value;
    }

    if (action === "M-") {
        memory -= value;
    }

    if (action === "MR") {
        expression = String(
            Number(memory.toPrecision(12))
        );

        justCalculated = false;
    }

    localStorage.setItem(
        "oneUI_memory",
        String(memory)
    );

    updateDisplay();
}


/* =========================================================
   HISTORY
   ========================================================= */

function addHistory(exp, result) {
    history.unshift({
        expression: exp,
        result: result,
        time: new Date().toLocaleString()
    });

    history = history.slice(0, 50);

    saveHistory();

    renderHistory();
}

function renderHistory() {
    if (!history.length) {
        historyList.innerHTML =
            '<div class="empty-history">No calculations yet.</div>';

        return;
    }

    historyList.innerHTML = history
        .map((item, index) => `
            <div class="history-item" data-index="${index}">
                <div class="history-expression">
                    ${escapeHTML(item.expression)}
                </div>

                <div class="history-result">
                    = ${escapeHTML(item.result)}
                </div>

                <small>
                    ${escapeHTML(item.time)}
                </small>
            </div>
        `)
        .join("");
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   AI SMART SOLVER
   ========================================================= */

function solveAI(problem) {
    const original = problem.trim();

    if (!original) {
        showAIError("Please enter a math problem.");
        return;
    }

    const text = original
        .toLowerCase()
        .replaceAll("×", "*")
        .replaceAll("÷", "/");

    /* ---------- PERCENTAGE ---------- */

    let match = text.match(
        /(\d+(?:\.\d+)?)\s*%\s*of\s*(?:₹|\$)?\s*(\d+(?:\.\d+)?)/
    );

    if (match) {
        const percent = Number(match[1]);
        const amount = Number(match[2]);

        const answer = amount * percent / 100;

        showAISolution(
            "Percentage",
            [
                `${percent}% means ${percent} ÷ 100.`,
                `${amount} × ${percent} ÷ 100`,
                `The result is ${answer}.`
            ],
            formatNumber(answer)
        );

        return;
    }

    /* ---------- TIP ---------- */

    match = text.match(
        /(\d+(?:\.\d+)?)\s*%\s*tip.*?(?:₹|\$)?\s*(\d+(?:\.\d+)?)/
    );

    if (match) {
        const percent = Number(match[1]);
        const bill = Number(match[2]);

        const tip = bill * percent / 100;
        const total = bill + tip;

        showAISolution(
            "Tip Calculation",
            [
                `Bill = ${bill}`,
                `Tip = ${bill} × ${percent} ÷ 100`,
                `Tip = ${tip.toFixed(2)}`,
                `Total = ${bill} + ${tip.toFixed(2)}`
            ],
            total.toFixed(2)
        );

        return;
    }

    /* ---------- LINEAR EQUATION ---------- */

    match = text.match(
        /^(-?\d*\.?\d*)\s*x\s*([+-]\s*\d+(?:\.\d+)?)?\s*=\s*(-?\d+(?:\.\d+)?)$/
    );

    if (match) {
        let a = match[1];

        if (a === "" || a === "+") {
            a = 1;
        }

        if (a === "-") {
            a = -1;
        }

        a = Number(a);

        const b = match[2]
            ? Number(match[2].replace(/\s/g, ""))
            : 0;

        const c = Number(match[3]);

        if (a === 0) {
            showAIError("The coefficient of x cannot be zero.");
            return;
        }

        const x = (c - b) / a;

        showAISolution(
            "Linear Equation",
            [
                `${a}x + ${b} = ${c}`,
                `Move ${b} to the other side.`,
                `${a}x = ${c - b}`,
                `Divide both sides by ${a}.`,
                `x = ${x}`
            ],
            `x = ${formatNumber(x)}`
        );

        return;
    }

    /* ---------- SQUARE ROOT ---------- */

    match = text.match(
        /(?:sqrt|square root of)\s*(\d+(?:\.\d+)?)/
    );

    if (match) {
        const number = Number(match[1]);

        if (number < 0) {
            showAIError("A real square root cannot be found for a negative number.");
            return;
        }

        const answer = Math.sqrt(number);

        showAISolution(
            "Square Root",
            [
                `We need √${number}.`,
                `${answer} × ${answer} = ${number}.`
            ],
            formatNumber(answer)
        );

        return;
    }

    /* ---------- NUMERICAL TRIGONOMETRY ---------- */

    const trigArithmetic = original
        .replace(/what is/gi, "")
        .replace(/calculate/gi, "")
        .replace(/solve/gi, "")
        .replace(/equals/gi, "")
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-")
        .trim();

    if (/^(?:sin|cos|tan)\\s*\\([^()]+\\)(?:\\s*[+\\-*/]\\s*(?:sin|cos|tan)\\s*\\([^()]+\\))*$/i.test(trigArithmetic)) {
        try {
            const answer = evaluateExpression(trigArithmetic);

            showAISolution(
                "Trigonometric Calculation",
                [
                    `Expression: ${trigArithmetic}`,
                    `Angle mode: ${angleMode}`,
                    "The calculator evaluated each trigonometric function and then combined the results."
                ],
                formatNumber(answer)
            );

            return;
        } catch (error) {
            showAIError(error.message || "Unable to evaluate the trigonometric expression.");
            return;
        }
    }

    /* ---------- BASIC MATH ---------- */

    let arithmetic = original
        .replace(/what is/gi, "")
        .replace(/calculate/gi, "")
        .replace(/solve/gi, "")
        .replace(/equals/gi, "")
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .trim();

    if (
        /^[0-9+\-*/().%\s]+$/.test(arithmetic)
    ) {
        try {
            const normalized = arithmetic.replace(
                /(\d+(?:\.\d+)?)%/g,
                "($1/100)"
            );

            const answer =
                evaluateExpression(normalized);

            showAISolution(
                "Calculation",
                [
                    `Expression: ${arithmetic}`,
                    `Calculated successfully.`
                ],
                formatNumber(answer)
            );

            return;
        } catch {
            /* Continue to fallback */
        }
    }

    showAIError(
        'Try "25% of 240", "3x + 5 = 20", "sqrt 144", or "15% tip on 45".'
    );
}


/* =========================================================
   AI UI
   ========================================================= */

function showAISolution(title, steps, answer) {
    aiAnswer.innerHTML = `
        <div class="answer-card">
            <h3>✨ ${escapeHTML(title)}</h3>

            ${steps.map((step, index) => `
                <div class="step">
                    <b>${index + 1}.</b>
                    ${escapeHTML(step)}
                </div>
            `).join("")}

            <div class="final-answer">
                Final Answer: ${escapeHTML(answer)}
            </div>
        </div>
    `;
}

function showAIError(message) {
    aiAnswer.innerHTML = `
        <div class="answer-card">
            <h3>🤔 Let's try again</h3>

            <div class="step">
                ${escapeHTML(message)}
            </div>
        </div>
    `;
}


/* =========================================================
   MODE SWITCH
   ========================================================= */

standardMode.addEventListener("click", () => {
    scientificPanel.classList.remove("visible");

    standardMode.classList.add("active");
    scientificMode.classList.remove("active");

    modeTitle.textContent = "Standard";
});

scientificMode.addEventListener("click", () => {
    scientificPanel.classList.add("visible");

    scientificMode.classList.add("active");
    standardMode.classList.remove("active");

    modeTitle.textContent = "Scientific";
});


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", () => {

        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value !== undefined) {
            appendValue(value);
            return;
        }

        switch (action) {
            case "clear":
                clearCalculator();
                break;

            case "backspace":
                backspace();
                break;

            case "paren":
                toggleParenthesis();
                break;

            case "percent":
                percentage();
                break;

            case "equals":
                calculate();
                break;

            case "sin":
            case "cos":
            case "tan":
            case "log":
            case "sqrt":
            case "square":
            case "power":
            case "pi":
                scientificAction(action);
                break;
        }
    });
});


/* =========================================================
   MEMORY EVENTS
   ========================================================= */

document.querySelectorAll("[data-memory]").forEach(button => {
    button.addEventListener("click", () => {
        memoryAction(button.dataset.memory);
    });
});


/* =========================================================
   HISTORY
   ========================================================= */

document.getElementById("historyBtn").addEventListener(
    "click",
    () => {
        historyPanel.classList.add("open");
        renderHistory();
    }
);

document.getElementById("closeHistory").addEventListener(
    "click",
    () => {
        historyPanel.classList.remove("open");
    }
);

document.getElementById("clearHistory").addEventListener(
    "click",
    () => {
        history = [];
        saveHistory();
        renderHistory();
    }
);

historyList.addEventListener("click", event => {
    const item = event.target.closest(".history-item");

    if (!item) {
        return;
    }

    const index = Number(item.dataset.index);
    const selected = history[index];

    if (!selected) {
        return;
    }

    expression = selected.expression;
    lastExpression = "";
    justCalculated = false;

    historyPanel.classList.remove("open");

    updateDisplay();
});


/* =========================================================
   AI
   ========================================================= */

document.getElementById("aiBtn").addEventListener(
    "click",
    () => {
        aiPanel.classList.add("open");

        setTimeout(() => {
            aiInput.focus();
        }, 300);
    }
);

document.getElementById("closeAi").addEventListener(
    "click",
    () => {
        aiPanel.classList.remove("open");
    }
);

document.getElementById("solveBtn").addEventListener(
    "click",
    () => {
        solveAI(aiInput.value);
    }
);

aiInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        solveAI(aiInput.value);
    }
});

document.querySelectorAll(".example").forEach(example => {
    example.addEventListener("click", () => {
        aiInput.value = example.textContent.trim();
        solveAI(aiInput.value);
    });
});


/* =========================================================
   KEYBOARD
   ========================================================= */

document.addEventListener("keydown", event => {

    if (document.activeElement === aiInput) {
        return;
    }

    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        appendValue(key);
        return;
    }

    if (key === ".") {
        appendValue(".");
        return;
    }

    if (key === "+") {
        appendValue("+");
        return;
    }

    if (key === "-") {
        appendValue("−");
        return;
    }

    if (key === "*") {
        appendValue("×");
        return;
    }

    if (key === "/") {
        event.preventDefault();
        appendValue("÷");
        return;
    }

    if (key === "%") {
        percentage();
        return;
    }

    if (key === "(" || key === ")") {
        toggleParenthesis();
        return;
    }

    /* Allow typing trig functions directly from the keyboard. */
    if (/^[a-zA-Z]$/.test(key)) {
        const current = expression.toLowerCase();
        if (current.endsWith("si") && key.toLowerCase() === "n") {
            appendValue("n");
            return;
        }
        if (current.endsWith("co") && key.toLowerCase() === "s") {
            appendValue("s");
            return;
        }
        if (current.endsWith("co") && key.toLowerCase() === "t") {
            appendValue("t");
            return;
        }
        if (current.endsWith("si") || current.endsWith("cos") || current.endsWith("tan")) {
            appendValue(key);
            return;
        }
    }

    if (key === "Enter" || key === "=") {
        calculate();
        return;
    }

    if (key === "Backspace") {
        backspace();
        return;
    }

    if (key === "Escape") {
        clearCalculator();
    }
});


/* =========================================================
   START
   ========================================================= */

renderHistory();
updateDisplay();

/* =========================================================
   TRIGONOMETRIC IDENTITY SOLVER
   ========================================================= */

const trigMode = document.getElementById("trigMode");
const trigPanel = document.getElementById("trigPanel");
const trigInput = document.getElementById("trigInput");
const trigAnswer = document.getElementById("trigAnswer");
const trigSolveBtn = document.getElementById("trigSolveBtn");

function normalizeTrigInput(value) {
    return value
        .trim()
        .toLowerCase()
        .replaceAll("²", "^2")
        .replaceAll("³", "^3")
        .replaceAll("₁", "1")
        .replaceAll("₁", "1")
        .replaceAll("−", "-")
        .replaceAll("×", "*")
        .replace(/\s+/g, "")
        .replace(/sina/g, "sinA")
        .replace(/cosa/g, "cosA")
        .replace(/tana/g, "tanA")
        .replace(/cota/g, "cotA")
        .replace(/seca/g, "secA")
        .replace(/coseca/g, "cosecA")
        .replace(/sin\^2a/g, "sin²A")
        .replace(/cos\^2a/g, "cos²A")
        .replace(/tan\^2a/g, "tan²A")
        .replace(/cot\^2a/g, "cot²A")
        .replace(/sec\^2a/g, "sec²A")
        .replace(/cosec\^2a/g, "cosec²A");
}

function showTrigSolution(title, steps, answer) {
    trigAnswer.innerHTML = `
        <div class="answer-card">
            <h3>📐 ${escapeHTML(title)}</h3>
            ${steps.map((step, index) => `
                <div class="step">
                    <b>${index + 1}.</b>
                    ${escapeHTML(step)}
                </div>
            `).join("")}
            <div class="final-answer">
                Final Answer: ${escapeHTML(answer)}
            </div>
        </div>
    `;
}

function solveTrigIdentity(problem) {
    const original = problem.trim();

    if (!original) {
        showAIError("Please enter a trigonometric identity.");
        return;
    }

    let text = normalizeTrigInput(original);

    /* ---------- DIRECT IDENTITIES ---------- */

    const direct = [
        {
            patterns: ["sin²A+cos²A", "cos²A+sin²A"],
            steps: [
                "Use the Pythagorean identity: sin²A + cos²A = 1.",
                "The expression matches the identity directly."
            ],
            answer: "1"
        },
        {
            patterns: ["1+tan²A"],
            steps: [
                "Use the Pythagorean identity: 1 + tan²A = sec²A.",
                "Replace 1 + tan²A with sec²A."
            ],
            answer: "sec²A"
        },
        {
            patterns: ["1+cot²A"],
            steps: [
                "Use the Pythagorean identity: 1 + cot²A = cosec²A.",
                "Replace 1 + cot²A with cosec²A."
            ],
            answer: "cosec²A"
        },
        {
            patterns: ["sec²A-tan²A", "sec²A-tan²A"],
            steps: [
                "Use sec²A = 1 + tan²A.",
                "sec²A − tan²A = (1 + tan²A) − tan²A.",
                "The tan²A terms cancel."
            ],
            answer: "1"
        },
        {
            patterns: ["cosec²A-cot²A"],
            steps: [
                "Use cosec²A = 1 + cot²A.",
                "cosec²A − cot²A = (1 + cot²A) − cot²A.",
                "The cot²A terms cancel."
            ],
            answer: "1"
        },
        {
            patterns: ["tana*cosa", "cosa*tana"],
            steps: [
                "Use tanA = sinA / cosA.",
                "(sinA / cosA) × cosA = sinA.",
                "cosA cancels."
            ],
            answer: "sinA"
        },
        {
            patterns: ["cota*sina", "sina*cota"],
            steps: [
                "Use cotA = cosA / sinA.",
                "(cosA / sinA) × sinA = cosA.",
                "sinA cancels."
            ],
            answer: "cosA"
        },
        {
            patterns: ["sina/cosa"],
            steps: [
                "Use the definition tanA = sinA / cosA.",
                "Replace sinA / cosA with tanA."
            ],
            answer: "tanA"
        },
        {
            patterns: ["cosa/sina"],
            steps: [
                "Use the definition cotA = cosA / sinA.",
                "Replace cosA / sinA with cotA."
            ],
            answer: "cotA"
        },
        {
            patterns: ["1/cosa"],
            steps: [
                "Use the reciprocal identity secA = 1 / cosA.",
                "Replace 1 / cosA with secA."
            ],
            answer: "secA"
        },
        {
            patterns: ["1/sina"],
            steps: [
                "Use the reciprocal identity cosecA = 1 / sinA.",
                "Replace 1 / sinA with cosecA."
            ],
            answer: "cosecA"
        },
        {
            patterns: ["(1-cos²A)/sinA"],
            steps: [
                "Use 1 − cos²A = sin²A.",
                "(1 − cos²A) / sinA = sin²A / sinA.",
                "Cancel sinA."
            ],
            answer: "sinA"
        },
        {
            patterns: ["(1-sin²A)/cosA"],
            steps: [
                "Use 1 − sin²A = cos²A.",
                "(1 − sin²A) / cosA = cos²A / cosA.",
                "Cancel cosA."
            ],
            answer: "cosA"
        }
    ];

    const match = direct.find(item => item.patterns.includes(text));

    if (match) {
        showTrigSolution("Identity Simplified", match.steps, match.answer);
        return;
    }

    /* ---------- IDENTITY EQUALITY CHECK ---------- */

    const equalityMap = {
        "tana=sina/cosa": ["Use tanA = sinA / cosA.", "Both sides are exactly the same by definition."],
        "cota=cosa/sina": ["Use cotA = cosA / sinA.", "Both sides are exactly the same by definition."],
        "seca=1/cosa": ["Use secA = 1 / cosA.", "Both sides are exactly the same by definition."],
        "coseca=1/sina": ["Use cosecA = 1 / sinA.", "Both sides are exactly the same by definition."]
    };

    if (equalityMap[text]) {
        showTrigSolution(
            "Identity Verified",
            equalityMap[text],
            "True identity"
        );
        return;
    }

    /* ---------- SIMPLE Pythagorean REARRANGEMENTS ---------- */

    const rearrangements = [
        ["1-sin²A", "cos²A", "Use sin²A + cos²A = 1, then subtract sin²A from both sides."],
        ["1-cos²A", "sin²A", "Use sin²A + cos²A = 1, then subtract cos²A from both sides."],
        ["sec²A-1", "tan²A", "Use sec²A = 1 + tan²A, then subtract 1."],
        ["cosec²A-1", "cot²A", "Use cosec²A = 1 + cot²A, then subtract 1."]
    ];

    const rearranged = rearrangements.find(item => item[0] === text);

    if (rearranged) {
        showTrigSolution(
            "Identity Simplified",
            [rearranged[2], `${rearranged[0]} → ${rearranged[1]}`],
            rearranged[1]
        );
        return;
    }

    showTrigSolution(
        "Try a standard identity",
        [
            "I could not match this expression to the built-in Class 11 identity rules yet.",
            "Try using sin²A + cos²A = 1, 1 + tan²A = sec²A, or 1 + cot²A = cosec²A.",
            "You can also use definitions such as tanA = sinA / cosA."
        ],
        "Not simplified"
    );
}

trigMode.addEventListener("click", () => {
    scientificPanel.classList.remove("visible");
    trigPanel.classList.add("visible");

    standardMode.classList.remove("active");
    scientificMode.classList.remove("active");
    trigMode.classList.add("active");

    modeTitle.textContent = "Trig Identities";
});

standardMode.addEventListener("click", () => {
    trigPanel.classList.remove("visible");
});

scientificMode.addEventListener("click", () => {
    trigPanel.classList.remove("visible");
});

trigSolveBtn.addEventListener("click", () => {
    solveTrigIdentity(trigInput.value);
});

trigInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        solveTrigIdentity(trigInput.value);
    }
});

document.querySelectorAll(".trig-example").forEach(example => {
    example.addEventListener("click", () => {
        trigInput.value = example.textContent.trim();
        solveTrigIdentity(trigInput.value);
    });
});
