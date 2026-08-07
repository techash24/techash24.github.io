// Firebase Authentication setup for the contact form.
// 1. Create a Firebase web app at https://console.firebase.google.com/
// 2. Replace every value below with that app's public web configuration.
// 3. Enable Authentication > Sign-in method > Google.
// 4. Add your deployed website domain in Authentication > Settings > Authorized domains.
const firebaseConfig = {
    apiKey: "AIzaSyDA9cIKS9DIpTs5VyKyx2ZcFEfIpfaTxL4",
    authDomain: "myfirstproject-e087f.firebaseapp.com",
    projectId: "myfirstproject-e087f",
    appId: "1:860554845899:web:33665e168aaf1df5b5454e"
};

const isConfigured = !Object.values(firebaseConfig).some(value => value.startsWith("PASTE_"));
const authGate = document.getElementById("authGate");
const signInButton = document.getElementById("googleSignIn");
const authStatus = document.getElementById("authStatus");
const contactForm = document.getElementById("contactForm");
const signedInAs = document.getElementById("signedInAs");
const signOutButton = document.getElementById("googleSignOut");
let signedInUser = null;

function showSetupMessage() {
    authStatus.textContent = "Google sign-in will be available after Firebase is configured.";
    signInButton.disabled = true;
}

if (!isConfigured) {
    showSetupMessage();
} else {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js");
    const { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js");
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    onAuthStateChanged(auth, user => {
        signedInUser = user;
        const isSignedIn = Boolean(signedInUser);
        authGate.hidden = isSignedIn;
        contactForm.hidden = !isSignedIn;

        if (!isSignedIn) return;

        document.getElementById("from_name").value = user.displayName || "";
        document.getElementById("from_email").value = user.email || "";
        signedInAs.textContent = `Signed in as ${user.email || "Google user"}`;
    });

    signInButton.addEventListener("click", async () => {
        signInButton.disabled = true;
        authStatus.textContent = "Opening Google sign-in…";

        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Google sign-in failed", error);
            if (error.code === "auth/unauthorized-domain") {
                authStatus.textContent = "This website domain is not authorised in Firebase yet.";
            } else if (error.code === "auth/popup-closed-by-user") {
                authStatus.textContent = "Google sign-in was closed before it finished.";
            } else {
                authStatus.textContent = `Sign-in could not be completed (${error.code || "unknown error"}).`;
            }
        } finally {
            signInButton.disabled = false;
        }
    });

    signOutButton.addEventListener("click", async () => {
        signOutButton.disabled = true;

        try {
            await signOut(auth);
            authStatus.textContent = "You have been signed out.";
        } catch (error) {
            console.error("Google sign-out failed", error);
            authStatus.textContent = "Sign-out could not be completed. Please try again.";
        } finally {
            signOutButton.disabled = false;
        }
    });

    // Capture phase runs before the EmailJS handler in script.js.
    // This prevents a message from being sent if someone reveals the form manually.
    contactForm.addEventListener("submit", event => {
        if (signedInUser) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        contactForm.hidden = true;
        authGate.hidden = false;
        authStatus.textContent = "Please sign in with Google before sending a message.";
        signInButton.focus();
    }, true);
}
