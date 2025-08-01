




/* global payhere */

async function loadBuyNowData() {
    console.log("JS Loaded");
    const popup = new Notification();

    const response = await fetch("LoadBuyNow");
    if (!response.ok) {
        if (response.status === 401) {
            window.location = "sign-in.html";
        } else {
            popup.error({message: "Failed to load checkout data."});
        }
        return;
    }

    const json = await response.json();
    if (!json.status) {
        if (json.message === "Empty cart") {
            popup.error({message: "Empty cart. Please add some products."});
            window.location = "index.html";
        } else {
            popup.error({message: json.message});
        }
        return;
    }

    const userAddress = json.userAddress;
    const cityList = json.cityList;
    const cartItems = json.cartList;
    const deliveryTypes = json.deliveryTypes;

    const city_select = document.getElementById("city-select");

    // Populate city list
    cityList.forEach(city => {
        const option = document.createElement("option");
        option.value = city.id;
        option.textContent = city.name;
        city_select.appendChild(option);
    });

    // Handle "Same as current address" checkbox
    const current_address_checkbox = document.getElementById("checkbox1");
    current_address_checkbox.addEventListener("change", () => {
        const first_name = document.getElementById("first-name");
        const last_name = document.getElementById("last-name");
        const line_one = document.getElementById("line-one");
        const line_two = document.getElementById("line-two");
        const postal_code = document.getElementById("postal-code");
        const mobile = document.getElementById("mobile");
        const email = document.getElementById("email");

        if (current_address_checkbox.checked) {
            first_name.value = userAddress.user.first_name;
            last_name.value = userAddress.user.last_name;
            city_select.value = userAddress.city.id;
            city_select.disabled = true;
            city_select.dispatchEvent(new Event("change"));
            line_one.value = userAddress.lineOne;
            line_two.value = userAddress.lineTwo;
            postal_code.value = userAddress.postalCode;
            mobile.value = userAddress.user.mobile;
            email.value = userAddress.user.email;
        } else {
            first_name.value = "";
            last_name.value = "";
            city_select.value = 0;
            city_select.disabled = false;
            city_select.dispatchEvent(new Event("change"));
            line_one.value = "";
            line_two.value = "";
            postal_code.value = "";
            mobile.value = "";
            email.value = "";
        }
    });

    // Load cart table
    const st_tbody = document.getElementById("st-tbody");
    const st_item_tr = document.getElementById("st-item-tr");
    const st_shipping_charges_span = document.getElementById("st-product-shipping-tr");
    const st_total_amount_span = document.getElementById("st-order-total-amount");
    const st_subtotal_amount_span = document.getElementById("st-product-total");

    st_tbody.innerHTML = ""; // clear

    let subtotal = 0;

    cartItems.forEach(cart => {
        const clone = st_item_tr.cloneNode(true);
        clone.removeAttribute("id");
        clone.style.display = "";

        clone.querySelector("#product-a1").href = "single-product.html?id=" + cart.product.id;
        clone.querySelector("#product-image").src = "product-images/" + cart.product.id + "/image1.jpeg";
        clone.querySelector("#st-product-title").textContent = cart.product.title;
        clone.querySelector("#st-product-qty").textContent = cart.qty;

        const unitPrice = Number(cart.product.price);
        const itemTotal = unitPrice * cart.qty;
        subtotal += itemTotal;

        clone.querySelector("#st-product-price").textContent = unitPrice.toFixed(2);
        clone.querySelector("#st-product-total-amount").textContent = itemTotal.toFixed(2);

        st_tbody.appendChild(clone);
    });

    // Update subtotal
    st_subtotal_amount_span.textContent = subtotal.toFixed(2);

    // Calculate shipping + total using delivery type name logic
    const updateShippingAndTotal = () => {
        const selectedCityName = city_select.options[city_select.selectedIndex].textContent.trim().toLowerCase();

        let shipping_charges = 0;

        if (selectedCityName.includes("Colombo")) {
            const within = deliveryTypes.find(dt => dt.name.toLowerCase().includes("Within Colombo"));
            shipping_charges = within ? Number(within.price) : 0;
        } else {
            const outside = deliveryTypes.find(dt => dt.name.toLowerCase().includes("Out Of Colombo"));
            shipping_charges = outside ? Number(outside.price) : 0;
        }

        st_shipping_charges_span.textContent = shipping_charges.toFixed(2);
        const total = subtotal + shipping_charges;
        st_total_amount_span.textContent = total.toFixed(2);
    };

    city_select.addEventListener("change", updateShippingAndTotal);
    city_select.dispatchEvent(new Event("change")); // initial trigger
}






payhere.onCompleted = function onCompleted(orderId) {
    const  popup = new Notification();
    popup.success({
        message: "Payment completed. Order Id " + orderId
    });


};


payhere.onDismissed = function onDismissed() {

    console.log("Payment dismissed");
};


payhere.onError = function onError(error) {

    console.log("Error:" + error);
};





// Checkout function remains unchanged
async function checkouts() {
    const popup = new Notification();

    const checkbox1 = document.getElementById("checkbox1").checked;
    const first_name = document.getElementById("first-name").value;
    const last_name = document.getElementById("last-name").value;
    const line_one = document.getElementById("line-one").value;
    const line_two = document.getElementById("line-two").value;
    const postal_code = document.getElementById("postal-code").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const city_select = document.getElementById("city-select").value;

    let data = {
        isCurrentAddress: checkbox1,
        firstName: first_name,
        lastName: last_name,
        citySelect: city_select,
        lineOne: line_one,
        lineTwo: line_two,
        postalCode: postal_code,
        mobile: mobile,
        email: email
    };

    let dataJSON = JSON.stringify(data);

    try {

    const response = await fetch("Checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: dataJSON
    });



    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            //payhere process
            payhere.startPayment(json.payhereJson);

        } else {
            popup.error({
                message: json.message
            });
        }
    } else {
        popup.error({
            message: "Something went wrong c. Please try again! "
        });
    }
 } catch (err) {
        console.error("Fetch error:", err);
        popup.error({ message: "Something went wrong. Please try again!" });
    }


}
