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


if(loadingText && loader){


    let messageIndex = 0;


    const messageInterval = setInterval(()=>{


        messageIndex++;


        if(messageIndex < loadingMessages.length){

            loadingText.textContent =
            loadingMessages[messageIndex];

        }


    },500);



    window.addEventListener("load",()=>{


        setTimeout(()=>{


            clearInterval(messageInterval);


            loader.style.opacity="0";



            setTimeout(()=>{


                loader.style.display="none";


            },600);



        },3000);



    });


}




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



function typingEffect(){


    if(!typing) return;


    const currentWord = words[wordIndex];



    if(!deleting){


        typing.textContent =
        currentWord.substring(0,letterIndex);



        letterIndex++;



        if(letterIndex > currentWord.length){


            deleting = true;


            setTimeout(typingEffect,1500);


            return;


        }


    }

    else{


        typing.textContent =
        currentWord.substring(0,letterIndex);



        letterIndex--;



        if(letterIndex < 0){


            deleting=false;


            wordIndex++;



            if(wordIndex >= words.length){

                wordIndex=0;

            }


            letterIndex=0;


        }


    }



    setTimeout(
        typingEffect,
        deleting ? 60 : 120
    );


}


typingEffect();
/* ==========================
   PARTICLES BACKGROUND
========================== */


if(document.getElementById("particles-js")){


    if(typeof particlesJS !== "undefined"){


        particlesJS("particles-js",{


            particles:{


                number:{


                    value:80,


                    density:{


                        enable:true,


                        value_area:800


                    }


                },


                color:{


                    value:"#00d9ff"


                },


                shape:{


                    type:"circle"


                },


                opacity:{


                    value:0.5


                },


                size:{


                    value:3,


                    random:true


                },


                line_linked:{


                    enable:true,


                    distance:150,


                    color:"#00d9ff",


                    opacity:0.3,


                    width:1


                },


                move:{


                    enable:true,


                    speed:2


                }


            },



            interactivity:{


                detect_on:"canvas",


                events:{


                    onhover:{


                        enable:true,


                        mode:"grab"


                    },


                    onclick:{


                        enable:true,


                        mode:"push"


                    }


                },


                modes:{


                    grab:{


                        distance:180,


                        line_linked:{


                            opacity:0.8


                        }


                    },


                    push:{


                        particles_nb:4


                    }


                }


            },


            retina_detect:true


        });


    }


}






/* ==========================
   ANIMATED COUNTERS
========================== */


const counters = document.querySelectorAll(".counter");


if(counters.length > 0){



    const counterObserver = new IntersectionObserver((entries)=>{



        entries.forEach(entry=>{



            if(entry.isIntersecting){



                const counter = entry.target;


                const target =
                Number(counter.dataset.target);



                let count = 0;



                const increment =
                Math.ceil(target / 80);



                function updateCounter(){



                    count += increment;



                    if(count < target){


                        counter.innerText=count;


                        requestAnimationFrame(updateCounter);


                    }

                    else{


                        counter.innerText=target;


                    }


                }



                updateCounter();



                counterObserver.unobserve(counter);



            }



        });



    },{


        threshold:0.5


    });




    counters.forEach(counter=>{


        counterObserver.observe(counter);


    });



}
/* ==========================
   ACTIVE NAVIGATION
========================== */


const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");


if(sections.length > 0 && navLinks.length > 0){


    window.addEventListener("scroll",()=>{


        let current = "";


        sections.forEach(section=>{


            const sectionTop =
            section.offsetTop - 150;


            const sectionHeight =
            section.clientHeight;



            if(
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ){


                current = section.getAttribute("id");


            }


        });



        navLinks.forEach(link=>{


            link.classList.remove("active");


            if(
                link.getAttribute("href") === "#" + current
            ){


                link.classList.add("active");


            }


        });



    });



}





/* ==========================
   MOBILE MENU
========================== */


const menuBtn =
document.getElementById("menu-btn");


const navMenu =
document.querySelector(".nav-links");



if(menuBtn && navMenu){


    menuBtn.addEventListener("click",()=>{


        navMenu.classList.toggle("show");


    });


}






/* ==========================
   SCROLL TO TOP
========================== */


const scrollTopBtn =
document.getElementById("scrollTop");



if(scrollTopBtn){



    window.addEventListener("scroll",()=>{


        if(window.scrollY > 400){


            scrollTopBtn.classList.add("show");


        }

        else{


            scrollTopBtn.classList.remove("show");


        }


    });




    scrollTopBtn.addEventListener("click",()=>{


        window.scrollTo({


            top:0,


            behavior:"smooth"


        });


    });



}







/* ==========================
   CONTACT POPUP
========================== */

const modal = document.getElementById("contactModal");
const openBtn = document.getElementById("openContact");
const closeBtn = document.querySelector(".close");

if (openBtn && modal && closeBtn) {

    openBtn.onclick = () => {
        modal.style.display = "flex";
    };

    closeBtn.onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (e) => {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    };
}
const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function(e) {

        e.preventDefault();

        emailjs.send(
            "service_va6hvnq",
            "template_07ne8tk",
            {
                from_name: document.getElementById("from_name").value,
                from_email: document.getElementById("from_email").value,
                subject: document.getElementById("subject").value,
                message: document.getElementById("message").value
            }
        )

        .then(function() {

            alert("✅ Message Sent Successfully!");

            contactForm.reset();

            document.getElementById("contactModal").style.display = "none";

        })

        .catch(function(error) {

            console.log(error);

            alert("❌ Failed to send message.");

        });

    });

}
document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        from_name: document.getElementById("from_name").value,
        from_email: document.getElementById("from_email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
        time: new Date().toLocaleString()
    })
    .then(function () {
        alert("Message Sent Successfully!");
        document.getElementById("contactForm").reset();
        document.getElementById("contactModal").style.display = "none";
    })
    .catch(function (error) {
        alert("Failed to send message.");
        console.log(error);
    });
});
