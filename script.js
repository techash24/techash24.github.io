/* ==========================================
   TECHASH24 v3.0
   script.js
========================================== */

/* ==========================
   LOADER
========================== */

const loadingMessages = [
    "Initializing...",
    "Loading Portfolio...",
    "Loading Assets...",
    "Connecting Modules...",
    "Starting Experience...",
    "Access Granted..."
];

const loadingText = document.getElementById("loading-text");
const loader = document.getElementById("loader");

let messageIndex = 0;

const messageInterval = setInterval(() => {

    messageIndex++;

    if (messageIndex < loadingMessages.length) {
        loadingText.textContent = loadingMessages[messageIndex];
    }

}, 500);

window.addEventListener("load", () => {

    setTimeout(() => {

        clearInterval(messageInterval);

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        }, 600);

    }, 3000);

});

/* ==========================
   TYPING EFFECT
========================== */

const words = [

    "Web Developer",

    "Frontend Developer",

    "Future Ethical Hacker",

    "Java Programmer",

    "Problem Solver"

];

const typing = document.getElementById("typing");

let wordIndex = 0;
let letterIndex = 0;
let deleting = false;

function typingEffect() {

    const currentWord = words[wordIndex];

    if (!deleting) {

        typing.textContent = currentWord.substring(0, letterIndex);

        letterIndex++;

        if (letterIndex > currentWord.length) {

            deleting = true;

            setTimeout(typingEffect, 1500);

            return;

        }

    } else {

        typing.textContent = currentWord.substring(0, letterIndex);

        letterIndex--;

        if (letterIndex < 0) {

            deleting = false;

            wordIndex++;

            if (wordIndex >= words.length) {

                wordIndex = 0;

            }

            letterIndex = 0;

        }

    }

    setTimeout(typingEffect, deleting ? 60 : 120);

}

typingEffect();

/* ==========================
   PARTICLES
========================== */

particlesJS("particles-js", {

    particles: {

        number: {

            value: 80,

            density: {

                enable: true,

                value_area: 800

            }

        },

        color: {

            value: "#00d9ff"

        },

        shape: {

            type: "circle"

        },

        opacity: {

            value: 0.5

        },

        size: {

            value: 3,

            random: true

        },

        line_linked: {

            enable: true,

            distance: 150,

            color: "#00d9ff",

            opacity: 0.3,

            width: 1

        },

        move: {

            enable: true,

            speed: 2

        }

    },

    interactivity: {

        detect_on: "canvas",

        events: {

            onhover: {

                enable: true,

                mode: "grab"

            },

            onclick: {

                enable: true,

                mode: "push"

            }

        },

        modes: {

            grab: {

                distance: 180,

                line_linked: {

                    opacity: 0.8

                }

            },

            push: {

                particles_nb: 4

            }

        }

    },

    retina_detect: true

});

/* ==========================
   ANIMATED COUNTERS
========================== */

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const counter = entry.target;

            const target = Number(counter.dataset.target);

            let count = 0;

            const increment = Math.ceil(target / 80);

            function updateCounter() {

                count += increment;

                if (count < target) {

                    counter.innerText = count;

                    requestAnimationFrame(updateCounter);

                } else {

                    counter.innerText = target;

                }

            }

            updateCounter();

            counterObserver.unobserve(counter);

        }

    });

}, {

    threshold: 0.5

});

counters.forEach(counter => {

    counterObserver.observe(counter);

});

/* ==========================
   ACTIVE NAVIGATION
========================== */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        if (scrollY >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});

/* ==========================
   SCROLL TO TOP
========================== */

window.addEventListener("beforeunload", () => {

    window.scrollTo(0, 0);

});

console.log("🚀 TECHASH24 Portfolio Loaded Successfully");