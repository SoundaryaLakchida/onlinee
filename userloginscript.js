// Firebase initialization should be done before this code, e.g., in a separate script or at the beginning

const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');
const submitSignIn = document.getElementById('submitSignIn');
const submitSignUp = document.getElementById('submitSignUp');

// Toggle between sign-in and sign-up forms
signUpButton.addEventListener('click', function () {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
});

signInButton.addEventListener('click', function () {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
});

// Handle sign-in submission
submitSignIn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Firebase authentication logic for sign-in
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Check if user is admin based on email
            if (email === "admin@example.com") {
                alert("Admin Login Successful!");
                // Redirect to admin dashboard
                window.location.href = "admin.html";
            } else {
                alert("User Login Successful!");
                // Redirect to customerdetails.html for regular users
                window.location.href = "customerdetails.html";
            }
        })
        .catch((error) => {
            const errorMessage = error.message;
            const signInMessage = document.getElementById("signInMessage");
            signInMessage.style.display = "block";
            signInMessage.textContent = errorMessage;
        });
});

// Handle sign-up submission
submitSignUp.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission

    const firstName = document.getElementById("fName").value;
    const lastName = document.getElementById("lName").value;
    const email = document.getElementById("rEmail").value;
    const password = document.getElementById("rPassword").value;

    // Firebase authentication logic for sign-up
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Update profile to add first name and last name
            return user.updateProfile({
                displayName: `${firstName} ${lastName}`
            });
        })
        .then(() => {
            alert("Sign Up Successful!");
            // Redirect to customerdetails.html
            window.location.href = "customerdetails.html";
        })
        .catch((error) => {
            const errorMessage = error.message;
            const signUpMessage = document.getElementById("signUpMessage");
            signUpMessage.style.display = "block";
            signUpMessage.textContent = errorMessage;
        });
});

