function loadData() {
    getUserData();
    getCityData();

}

async function getUserData() {
    const response = await fetch("MyAccount");

    if (response.ok) {
        const json = await response.json();
        console.log(json);
        document.getElementById("username").innerHTML = `Hello ${json.firstName} ${json.lastName}`;
        document.getElementById("since").innerHTML = `Tickr Member Since ${json.since}`;
        document.getElementById("firstName").value = json.firstName;
        document.getElementById("lastName").value = json.lastName;
        document.getElementById("currentPassword").value = json.password;
        document.getElementById("phone").value = json.phone;
        document.getElementById("email").value = json.email;



        if (json.hasOwnProperty("addressList") && json.addressList !== undefined) {

            let email;
            let lineOne;
            let lineTwo;
            let city;
            let postalCode;
            let cityId;

            const addressUL = document.getElementById("addressUL");

            json.addressList.forEach(address => {
                email = address.user.email;

                lineOne = address.lineOne;
                lineTwo = address.lineTwo;
                city = address.city.name;
                postalCode = address.postalCode;

                cityId = address.city.id;

                const line = document.createElement("Li");
                line.innerHTML = lineOne + ",<br/>" +
                        lineTwo + ",<br/>" +
                        city + "<br/>" +
                        postalCode;

                addressUL.appendChild(line);



            });

            console.log("lineOne:", lineOne);
            console.log("lineTwo:", lineTwo);
            console.log("postalCode:", postalCode);
            console.log("cityId:", cityId);



            document.getElementById("addName").innerHTML = `${json.firstName} ${json.lastName}`;
            document.getElementById("addEmail").innerHTML = `Email: ${email}`;
            document.getElementById("contact").innerHTML = `Phone: 078956666`;

            document.getElementById("lineOne").value = lineOne;
            document.getElementById("lineTwo").value = lineTwo;
            document.getElementById("postalCode").value = postalCode;
            document.getElementById("citySelect").value = Number(cityId);

        }




    } else {

    }
}

async function getCityData() {
    const response = await fetch("CityData");
    console.log("CityData response status:", response.status);
    if (response.ok) {
        const json = await response.json();
        console.log("CityData JSON:", json);
        const citySelect = document.getElementById("citySelect");
        if (!citySelect) {
            console.error("citySelect element not found!");
            return;
        }
        if (!Array.isArray(json)) {
            console.error("CityData response is not an array!");
            return;
        }
        json.forEach(city => {
            let option = document.createElement("option");
            option.innerHTML = city.name;
            option.value = city.id;
            citySelect.appendChild(option);
        });
    } else {
        console.error("Failed to fetch CityData");
    }
}

async function saveChanges() {

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const lineOne = document.getElementById("lineOne").value;
    const lineTwo = document.getElementById("lineTwo").value;
    const postalCode = document.getElementById("postalCode").value;
    const  cityId = document.getElementById("citySelect").value;
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const userDataObject = {
        firstName: firstName,
        lastName: lastName,
        lineOne: lineOne,
        lineTwo: lineTwo,
        postalCode: postalCode,
        cityId: cityId,
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    };

    const userDataJson = JSON.stringify(userDataObject);


    const response = await fetch(
            "MyAccount", {
                method: "PUT",
                body: userDataJson,
                headers: {
                    "Content-Type": "application/json"
                }

            }
    );

    if (response.ok) {

        const json = await response.json();
        if (json.status) {

            getUserData();

        } else {

            document.getElementById("message").innerHTML = json.message;

        }

    } else {
        document.getElementById("message").innerHTML = "Profile Details update failed";
    }



}