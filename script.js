/* ==========================================
   TECHASH24 v4.0
   script.js
   PART 1
========================================== */

/* ==========================
   LOADER
========================== */

const loadingMessages = [
    "Initializing...",
    "Loading Portfolio...",
    "Loading Assets...",
    "Connecting Modules...",
    "Preparing Interface...",
    "Access Granted..."
];

const loader = document.getElementById("loader");
const loadingText = document.getElementById("loading-text");

if (loader && loadingText) {

    let index = 0;

    const messageInterval = setInterval(() => {

        index++;

        if (index < loadingMessages.length) {
            loadingText.textContent = loadingMessages[index];
        }

    }, 500);

    window.addEventListener("load", () => {

        setTimeout(() => {

            clearInterval(messageInterval);

            loader.style.opacity = "0";

            setTimeout(() => {

                loader.style.display = "none";

            }, 600);

        }, 500);

    });

}

/* ==========================
   TYPING EFFECT
========================== */

const words = [

    "Frontend Developer",

    "Java Programmer",

    "Future Ethical Hacker",

    "Problem Solver",

    "Tech Enthusiast"

];

const typing = document.getElementById("typing");

let wordIndex = 0;
let letterIndex = 0;
let deleting = false;

function typeEffect() {

    if (!typing) return;

    const currentWord = words[wordIndex];

    if (!deleting) {

        typing.textContent =
            currentWord.substring(0, letterIndex);

        letterIndex++;

        if (letterIndex > currentWord.length) {

            deleting = true;

            setTimeout(typeEffect, 1500);

            return;
        }

    } else {

        typing.textContent =
            currentWord.substring(0, letterIndex);

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

    setTimeout(typeEffect, deleting ? 60 : 120);

}

typeEffect();

/* ==========================
   PARTICLES
========================== */

if (document.getElementById("particles-js")) {

    if (typeof particlesJS !== "undefined") {

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

    }

}
/* ==========================================
   TECHASH24 v4.0
   script.js
   PART 2
========================================== */

/* ==========================
   ANIMATED COUNTERS
========================== */

const counters = document.querySelectorAll(".counter");

if (counters.length > 0) {

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

}

/* ==========================
   ACTIVE NAVIGATION
========================== */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        const sectionHeight = section.clientHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

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
   SMOOTH SCROLL
========================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});

/* ==========================
   SCROLL TO TOP BUTTON
========================== */

const scrollBtn = document.getElementById("scrollTop");

if (scrollBtn) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            scrollBtn.classList.add("show");

        } else {

            scrollBtn.classList.remove("show");

        }

    });

    scrollBtn.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

/* ==========================
   CONTACT MODAL
========================== */

const modal = document.getElementById("contactModal");
const openBtn = document.getElementById("openContact");
const closeBtn = document.querySelector(".close");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-links");

if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    navMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation menu");
    }));
}

if (modal && openBtn && closeBtn) {

    openBtn.onclick = () => {

        modal.style.display = "flex";
        const authButton = document.getElementById("googleSignIn");
        const nameInput = document.getElementById("from_name");
        (authButton && !authButton.disabled ? authButton : nameInput).focus();

    };

    closeBtn.onclick = () => {

        modal.style.display = "none";
        openBtn.focus();

    };

    window.onclick = (e) => {

        if (e.target === modal) {

            modal.style.display = "none";
            openBtn.focus();

        }

    };

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "flex") {
            modal.style.display = "none";
            openBtn.focus();
        }
    });

}
/* ==========================================
   TECHASH24 v4.0
   script.js
   PART 3
========================================== */

/* ==========================
   EMAILJS INITIALIZATION
========================== */

if (typeof emailjs !== "undefined") {

    emailjs.init({
        publicKey: "l9diBOgu98ElOS1nW"
    });

}

/* ==========================
   CONTACT FORM
========================== */

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const submitBtn = contactForm.querySelector("button");

        submitBtn.disabled = true;
        submitBtn.innerText = "Sending...";

        emailjs.send(
            "service_va6hvnq",
            "template_07ne8tk",
            {
                from_name: document.getElementById("from_name").value,
                from_email: document.getElementById("from_email").value,
                subject: document.getElementById("subject").value,
                message: document.getElementById("message").value,
                time: new Date().toLocaleString()
            }
        )

        .then(() => {

            alert("✅ Message sent successfully!");

            contactForm.reset();

            if (modal) {
                modal.style.display = "none";
            }

        })

        .catch((error) => {

            console.error(error);

            alert("❌ Failed to send message.");

        })

        .finally(() => {

            submitBtn.disabled = false;
            submitBtn.innerText = "🚀 Send Message";

        });

    });

}

/* ==========================
   NAVBAR SHADOW
========================== */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (!navbar) return;

    if (window.scrollY > 50) {

        navbar.style.boxShadow = "0 5px 25px rgba(0,217,255,.20)";

    } else {

        navbar.style.boxShadow = "none";

    }

});

/* ==========================
   PREVENT IMAGE DRAG
========================== */

document.querySelectorAll("img").forEach(img => {

    img.setAttribute("draggable", "false");

});

/* ==========================
   CONSOLE MESSAGE
========================== */

console.log("%cTECHASH24 Portfolio Loaded Successfully 🚀",
    "color:#00d9ff;font-size:18px;font-weight:bold;");

console.log("Designed & Developed by Ashwani Maurya");
