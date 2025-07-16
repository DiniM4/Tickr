// Handle the register button click
async function signUp() {
    
    event.preventDefault(); // prevent page reload
    
    
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    };

    try {
        const response = await fetch("SignUp", {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const json = await response.json();
        const messageElement = document.getElementById("message");

        if (json.status) {
            // Success
            messageElement.className = "text-success text-center mt-lg-3 mb-lg-34";
            messageElement.innerHTML = json.message;

            // ✅ Show the verification modal
//            const verificationModal = new bootstrap.Modal(document.getElementById('verificationModal'));
//            verificationModal.show();
            window.location = "verify-account.html";
        } else {
            // Error
            messageElement.className = "text-danger text-center mt-lg-3 mb-lg-34";
            messageElement.innerHTML = json.message;
        }

    } catch (error) {
        document.getElementById("message").className = "text-danger";
        document.getElementById("message").innerHTML = "Registration failed. Please try again.";
        console.error("Error during sign-up:", error);
    }
}
//
//// Handle verification code submission inside modal
//document.addEventListener("DOMContentLoaded", () => {
//    const verificationForm = document.getElementById("verificationForm");
//
//    if (verificationForm) {
//        verificationForm.addEventListener("submit", async function (e) {
//            e.preventDefault();
//
//            const code = document.getElementById("verificationCode").value.trim();
//            const email = document.getElementById("email").value.trim();
//
//            try {
//                const response = await fetch("VerifyCode", {
//                    method: "POST",
//                    headers: {
//                        "Content-Type": "application/json"
//                    },
//                    body: JSON.stringify({code: code, email: email})
//                });
//
//                const result = await response.json();
//
//                if (result.status) {
//                    alert("Account verified successfully!");
//                    window.location.href = "index.html";
//                } else {
//                    alert("Invalid verification code. Please try again.");
//                }
//            } catch (error) {
//                alert("An error occurred while verifying. Please try again.");
//                console.error("Verification error:", error);
//            }
//        });
//    }
//});
