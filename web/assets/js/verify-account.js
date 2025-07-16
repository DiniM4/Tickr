
 // Show modal on Register button click
        document.addEventListener('DOMContentLoaded', function () {
            var signupForm = document.querySelector('.signup-form');
            if (signupForm) {
                signupForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    var verificationModal = new bootstrap.Modal(document.getElementById('verificationModal'));
                    verificationModal.show();
                });
            }
//            Optionally handle verification form submit
            var verificationForm = document.getElementById('verificationForm');
            if (verificationForm) {
                verificationForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    // Add your verification logic here
                    // For now, just close the modal
                    var modal = bootstrap.Modal.getInstance(document.getElementById('verificationModal'));
                    modal.hide();
//                    alert('Verification code submitted!');
                });
            }
        });

async function verifyAccount() {

    const verificationCode = document.getElementById("verificationCode").value;


    const verification = {
        verificationCode: verificationCode

    }; //js wala object ekak

    const verificationJson = JSON.stringify(verification);
    const  response = await fetch(
            "VerifyAccount",
            {
                method: "POST",
                body: verificationJson,
                headers: {
                    "Content-Type": "application/json"
                }
            }

    );

    if (response.ok) { //success

        const json = await response.json();

        if (json.status) { //if true

            window.location = "index.html";

        } else { //when status false

            if (json.message === "1") { //Email not found
                window.location = "sign-in.html";
            } else {
                //custom message
                document.getElementById("message").innerHTML = json.message;
            }

        }
    } else {
        document.getElementById("message").innerHTML = "Verification failed.";
    }


}

