/* ==========================================
   TECHASH24 Password Generator v4.0
   PART 1
========================================== */

/* ===============================
   ELEMENTS
================================= */

const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy");
const toggleBtn = document.getElementById("togglePassword");

const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");
const entropy = document.getElementById("entropy");
const toast = document.getElementById("toast");

/* ===============================
   CHARACTER SETS
================================= */

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBER = "0123456789";
const SYMBOL = "!@#$%^&*()_-+=[]{}<>?/";

/* ===============================
   SECURE RANDOM
================================= */

function random(max){

    if(max <= 0) return 0;

    if(window.crypto && window.crypto.getRandomValues){

        const array = new Uint32Array(1);

        window.crypto.getRandomValues(array);

        return array[0] % max;

    }

    console.warn("Crypto API unavailable. Using Math.random().");

    return Math.floor(Math.random() * max);

}

function getRandomCharacter(chars){

    return chars[random(chars.length)];

}

/* ===============================
   SHUFFLE
================================= */

function shuffle(text){

    const arr = text.split("");

    for(let i = arr.length - 1; i > 0; i--){

        const j = random(i + 1);

        [arr[i], arr[j]] = [arr[j], arr[i]];

    }

    return arr.join("");

}

/* ===============================
   PASSWORD GENERATOR
================================= */

function generatePassword(){

    let available = "";
    let password = "";

    if(uppercase.checked) available += UPPER;
    if(lowercase.checked) available += LOWER;
    if(numbers.checked) available += NUMBER;
    if(symbols.checked) available += SYMBOL;

    if(available.length === 0){

        passwordInput.value = "";

        strengthFill.style.width = "0%";

        strengthFill.style.background = "#ff3b30";

        strengthText.textContent = "Select at least one option";

        entropy.textContent = "0 bits";

        generateBtn.disabled = true;

        return;

    }

    generateBtn.disabled = false;

    if(uppercase.checked)
        password += getRandomCharacter(UPPER);

    if(lowercase.checked)
        password += getRandomCharacter(LOWER);

    if(numbers.checked)
        password += getRandomCharacter(NUMBER);

    if(symbols.checked)
        password += getRandomCharacter(SYMBOL);

    const length = Number(lengthSlider.value);

    while(password.length < length){

        password += getRandomCharacter(available);

    }

    password = shuffle(password);

    passwordInput.value = password;

    updateStrength(password, available);

}

/* ===============================
   PASSWORD STRENGTH
================================= */

function updateStrength(password, available){

    let score = 0;

    if(password.length >= 8) score++;
    if(password.length >= 12) score++;

    if(/[A-Z]/.test(password)) score++;
    if(/[a-z]/.test(password)) score++;
    if(/[0-9]/.test(password)) score++;
    if(/[^A-Za-z0-9]/.test(password)) score++;

    const percent = (score / 6) * 100;

    strengthFill.style.width = percent + "%";

    if(score <= 2){

        strengthFill.style.background = "#ff3b30";

        strengthText.textContent = "Weak 🔴";

    }

    else if(score <= 4){

        strengthFill.style.background = "#ffc107";

        strengthText.textContent = "Medium 🟡";

    }

    else{

        strengthFill.style.background = "#00ff66";

        strengthText.textContent = "Strong 🟢";

    }

    const bits = Math.round(
        password.length * Math.log2(available.length)
    );

    entropy.textContent = bits + " bits";

}
/* ==========================================
   TECHASH24 Password Generator v4.0
   PART 2
========================================== */

/* ===============================
   COPY PASSWORD
================================= */

copyBtn.addEventListener("click", async () => {

    if (!passwordInput.value) return;

    try {

        if (navigator.clipboard && window.isSecureContext) {

            await navigator.clipboard.writeText(passwordInput.value);

        } else {

            passwordInput.type = "text";

            passwordInput.removeAttribute("readonly");

            passwordInput.select();

            passwordInput.setSelectionRange(0, 99999);

            document.execCommand("copy");

            passwordInput.setAttribute("readonly", true);

            passwordInput.type = "password";

        }

        copyBtn.textContent = "✔ Copied";

        toast.classList.add("show");

        setTimeout(() => {

            copyBtn.textContent = "📋 Copy";

            toast.classList.remove("show");

        }, 2000);

    } catch (err) {

        console.error(err);

        alert("Unable to copy password.");

    }

});

/* ===============================
   SHOW / HIDE PASSWORD
================================= */

toggleBtn.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        toggleBtn.textContent = "🙈";

    } else {

        passwordInput.type = "password";

        toggleBtn.textContent = "👁";

    }

});

/* ===============================
   LENGTH SLIDER
================================= */

lengthSlider.addEventListener("input", () => {

    lengthValue.textContent = lengthSlider.value;

    generatePassword();

});

/* ===============================
   OPTIONS
================================= */

const options = document.querySelectorAll(".options input");

options.forEach(option => {

    option.addEventListener("change", () => {

        generatePassword();

    });

});

/* ===============================
   GENERATE BUTTON
================================= */

generateBtn.addEventListener("click", () => {

    generatePassword();

    if (generateBtn.animate) {

        generateBtn.animate(

            [

                {
                    transform: "scale(1)"
                },

                {
                    transform: "scale(.92)"
                },

                {
                    transform: "scale(1)"
                }

            ],

            {

                duration: 180,

                easing: "ease"

            }

        );

    }

});

/* ===============================
   DOUBLE CLICK PASSWORD
================================= */

passwordInput.addEventListener("dblclick", () => {

    generatePassword();

});

/* ===============================
   KEYBOARD SHORTCUTS
================================= */

document.addEventListener("keydown", (e) => {

    if (e.ctrlKey && e.key === "Enter") {

        e.preventDefault();

        generatePassword();

    }

    if (e.key === "F5") {

        e.preventDefault();

        generatePassword();

    }

});

/* ===============================
   INITIAL LOAD
================================= */

document.addEventListener("DOMContentLoaded", () => {

    lengthValue.textContent = lengthSlider.value;

    generatePassword();

});

/* ===============================
   PREVENT FORM SUBMIT
================================= */

document.addEventListener("submit", (e) => {

    e.preventDefault();

});
/* ==========================================
   TECHASH24 Password Generator v4.0
   PART 3
========================================== */

/* ===============================
   DOWNLOAD PASSWORD
================================= */

const downloadBtn = document.createElement("button");

downloadBtn.id = "download";
downloadBtn.innerHTML = "💾 Download";

document.querySelector(".buttons").appendChild(downloadBtn);

downloadBtn.addEventListener("click", () => {

    if (!passwordInput.value) return;

    try {

        const blob = new Blob(
            [passwordInput.value],
            { type: "text/plain;charset=utf-8" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "TECHASH24-Password.txt";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    } catch (err) {

        console.error(err);

        alert("Unable to download password.");

    }

});

/* ===============================
   PASSWORD HISTORY
================================= */

const history = [];

function saveHistory(password){

    if(!password) return;

    if(history[0] === password) return;

    history.unshift(password);

    if(history.length > 10){

        history.pop();

    }

}

const originalGeneratePassword = generatePassword;

generatePassword = function(){

    originalGeneratePassword();

    if(passwordInput.value){

        saveHistory(passwordInput.value);

    }

};

/* ===============================
   RANDOM GLOW EFFECT
================================= */

setInterval(() => {

    if(generateBtn.animate){

        generateBtn.animate(

            [

                {

                    boxShadow:"0 0 10px cyan"

                },

                {

                    boxShadow:"0 0 35px cyan"

                },

                {

                    boxShadow:"0 0 10px cyan"

                }

            ],

            {

                duration:1500,

                easing:"ease-in-out"

            }

        );

    }

},4000);

/* ===============================
   CARD HOVER EFFECT
================================= */

const card = document.querySelector(".card");

if(window.matchMedia("(hover:hover)").matches){

    card.addEventListener("mouseenter",()=>{

        card.style.transform="translateY(-8px)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="translateY(0)";

    });

}

/* ===============================
   WINDOW RESIZE
================================= */

window.addEventListener("resize", () => {

    lengthValue.textContent = lengthSlider.value;

});

/* ===============================
   ONLINE / OFFLINE STATUS
================================= */

window.addEventListener("offline", () => {

    console.warn("You are offline.");

});

window.addEventListener("online", () => {

    console.log("Back online.");

});

/* ===============================
   CONSOLE MESSAGE
================================= */

if(window.console){

    console.clear();

    console.log(
        "%cTECHASH24 Password Generator",
        "color:#00d9ff;font-size:22px;font-weight:bold;"
    );

    console.log(
        "%cVersion 4.0",
        "color:#00ff66;font-size:16px;"
    );

    console.log(
        "%cDeveloped by TECHASH24 🚀",
        "color:white;font-size:15px;"
    );

    console.log(
        "%cCross-platform Compatible",
        "color:#00d9ff;font-size:14px;"
    );

    console.log("Application Loaded Successfully.");

}

/* ===============================
   FINISHED
================================= */

console.log("Ready ✅");
