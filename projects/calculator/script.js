/* ==========================================
   TECHASH24 Calculator
========================================== */

const display = document.getElementById("display");
const history = document.getElementById("history");

/* Append Value */

function appendValue(value) {

    if (display.value === "Error") {
        display.value = "";
    }

    display.value += value;
}

/* Clear */

function clearDisplay() {

    display.value = "";
    history.textContent = "";
}

/* Delete Last Character */

function deleteLast() {

    display.value = display.value.slice(0, -1);
}

/* Toggle + / - */

function toggleSign() {

    if (display.value === "") return;

    if (display.value.startsWith("-")) {

        display.value = display.value.substring(1);

    } else {

        display.value = "-" + display.value;
    }
}

/* Calculate */

function calculate() {

    try {

        if (display.value.trim() === "") return;

        history.textContent = display.value;

        let expression = display.value;

        // Convert percentage
        expression = expression.replace(/%/g, "/100");

        const result = eval(expression);

        if (!isFinite(result)) {

            display.value = "Error";

        } else {

            display.value = result;
        }

    } catch {

        display.value = "Error";
    }
}

/* Keyboard Support */

document.addEventListener("keydown", function (e) {

    const key = e.key;

    if (
        "0123456789+-*/.%".includes(key)
    ) {

        appendValue(key);

    }

    else if (key === "Enter") {

        e.preventDefault();
        calculate();

    }

    else if (key === "Backspace") {

        deleteLast();

    }

    else if (key === "Escape") {

        clearDisplay();
    }

});

/* Button Animation */

const buttons = document.querySelectorAll("button");

buttons.forEach(button => {

    button.addEventListener("click", () => {

        button.style.transform = "scale(0.9)";

        setTimeout(() => {

            button.style.transform = "";

        }, 120);

    });

});
/* ==========================
   CUSTOM CURSOR
========================== */

const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {

    cursor.style.left = e.clientX + "px";

    cursor.style.top = e.clientY + "px";

});

document.querySelectorAll("button").forEach(button => {

    button.addEventListener("mouseenter", () => {

        cursor.classList.add("active");

    });

    button.addEventListener("mouseleave", () => {

        cursor.classList.remove("active");

    });

});
