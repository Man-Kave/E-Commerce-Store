
// Firebase and DOM initialization
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM fully loaded and parsed");

    const customerDashboard = document.getElementById("customerDashboard");
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm || loginForm || customerDashboard) {
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js");
        const { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } = await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js");

        const firebaseConfig = {
            apiKey: "AIzaSyAfxbw_Ur2jfQDZqEh-wBX9Lqeo1RdAIPA",
            authDomain: "customeraccounts-a29eb.firebaseapp.com",
            projectId: "customeraccounts-a29eb",
            storageBucket: "customeraccounts-a29eb.appspot.com",
            messagingSenderId: "4968118695",
            appId: "1:4968118695:web:079298c836a3d5f5551e82"
        };

        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        console.log("Firebase auth initialized:", auth);

        // "Your Account" button functionality
        if (customerDashboard) {
            console.log("Customer Dashboard element found");
            customerDashboard.addEventListener("click", (event) => {
                event.preventDefault();
                console.log("Customer Dashboard clicked");

                // Use onAuthStateChanged to check auth state
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        console.log("User is signed in:", user.email);
                        openModal("customerDashboardModal");
                        document.getElementById("welcomeMessage").textContent = `Welcome, ${user.email}`;
                        loadUserOrders(user.uid);
                    } else {
                        console.log("No user signed in. Redirecting to login.");
                        openModal("loginModal");
                    }
                });
            });
        }

        // Registration form handling
        if (registerForm) {
            console.log("Register form element found");
            registerForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                console.log("Register form submitted");

                const email = document.getElementById("register-email").value;
                const password = document.getElementById("register-password").value;
                const confirmPassword = document.getElementById("confirm-password").value;

                if (!email || !password || !confirmPassword) {
                    alert("All fields are required");
                    return;
                }

                if (password !== confirmPassword) {
                    alert("Passwords do not match!");
                    return;
                }

                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    console.log("User registered:", userCredential.user);
                    closeModal('registerModal');
                    openModal('successModal');
                    setTimeout(() => {
                        closeModal('successModal');
                        openModal('loginModal');
                    }, 1000);
                } catch (error) {
                    console.error("Error creating account:", error.message);
                    alert("Registration failed: " + error.message);
                }
            });
        }

        // Login form handling
        if (loginForm) {
            console.log("Login form element found");
            loginForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                console.log("Login form submitted");

                const email = document.getElementById("login-email").value;
                const password = document.getElementById("login-password").value;

                if (!email || !password) {
                    alert("All fields are required");
                    return;
                }

                try {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;
                    console.log("User signed in:", user);
                    closeModal('loginModal');
                    document.getElementById("welcomeMessage").textContent = `${user.email} has successfully signed in!`;
                    openModal("welcomeModal");
                } catch (error) {
                    console.error("Error signing in:", error.message);
                    alert("Login failed: " + error.message);
                }
            });
        }
    }
});

// Modal functions
function openModal(modalId) {
    closeAllModals([modalId]);
    const modal = document.getElementById(modalId);
    if (modal) {
        console.log(`Opening modal with ID: ${modalId}`);
        modal.style.display = 'flex';
    } else {
        console.error(`Modal with ID ${modalId} not found`);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeAllModals(exceptions = []) {
    document.querySelectorAll('.modal, .modal2').forEach(modal => {
        if (!exceptions.includes(modal.id)) {
            modal.style.display = 'none';
        }
    });
}

// Sign-out function
window.handleSignOut = async function () {
    try {
        await signOut(auth);
        alert("You have signed out successfully.");
        const signedInStatus = document.getElementById("signedInStatus");
        if (signedInStatus) {
            signedInStatus.remove();
        }
        const signInLink = document.querySelector("#signInLink");
        if (signInLink) {
            signInLink.style.display = "inline";
        }
    } catch (error) {
        console.error("Error signing out:", error.message);
        alert("Sign out failed: " + error.message);
    }
};

// Password visibility toggle
function togglePasswordVisibility(passwordFieldId) {
    const passwordField = document.getElementById(passwordFieldId);
    passwordField.type = passwordField.type === "password" ? "text" : "password";
}

// Real-time validation and password strength check
document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.getElementById("register-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const registerButton = document.getElementById("registerButton");
    const passwordFeedback = document.getElementById("passwordFeedback");
    const confirmPasswordFeedback = document.getElementById("confirmPasswordFeedback");
    const passwordStrengthBar = document.getElementById("password-strength");

    function checkPasswordStrength(password) {
        let strength = "weak";
        if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /\W/.test(password)) {
            strength = "strong";
        } else if (password.length >= 6 && /[A-Z]/.test(password)) {
            strength = "medium";
        }
        return strength;
    }

    passwordInput.addEventListener("input", function() {
        const strength = checkPasswordStrength(passwordInput.value);
        passwordStrengthBar.setAttribute("data-strength", strength);

        if (strength === "strong") {
            passwordFeedback.textContent = "Strong password!";
            passwordFeedback.style.color = "green";
        } else if (strength === "medium") {
            passwordFeedback.textContent = "Medium strength password.";
            passwordFeedback.style.color = "orange";
        } else {
            passwordFeedback.textContent = "Weak password. Try adding more characters, numbers, or symbols.";
            passwordFeedback.style.color = "red";
        }
        passwordFeedback.style.display = "block";

        registerButton.disabled = !(strength === "strong" && document.getElementById("terms-checkbox").checked);
    });

    confirmPasswordInput.addEventListener("input", function() {
        if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordFeedback.textContent = "Passwords do not match!";
            confirmPasswordFeedback.style.color = "red";
            confirmPasswordFeedback.style.display = "block";
            registerButton.disabled = true;
        } else {
            confirmPasswordFeedback.textContent = "Passwords match!";
            confirmPasswordFeedback.style.color = "green";
            confirmPasswordFeedback.style.display = "block";
            registerButton.disabled = !document.getElementById("terms-checkbox").checked;
        }
    });

    document.getElementById("terms-checkbox").addEventListener("change", function() {
        const strength = checkPasswordStrength(passwordInput.value);
        registerButton.disabled = !(this.checked && strength === "strong" && confirmPasswordInput.value === passwordInput.value);
    });
});
