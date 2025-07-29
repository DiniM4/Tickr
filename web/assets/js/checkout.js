// 
//    payhere.onCompleted = function onCompleted(orderId) {
//        const  popup = new Notification();
//        popup.success({
//           message:"Payment completed. Order Id "+orderId 
//        });
//        
//       
//    };
//
//   
//    payhere.onDismissed = function onDismissed() {
//       
//        console.log("Payment dismissed");
//    };
//
//   
//    payhere.onError = function onError(error) {
//        
//        console.log("Error:"  + error);
//    };
//






async function loadCheckoutData() {

    console.log("jsok");

    const popup = new Notification();

    const response = await fetch("LoadCheckoutData");

    if (response.ok) {
        console.log("wade ok");


        const json = await response.json();

        if (json.status) {

            console.log(json);
            const userAddress = json.userAddress;
            const cityList = json.cityList;
            const cartItems = json.cartList;
            const deliveryTypes = json.deliveryTypes;

            const city_select = document.getElementById("city-select");

            cityList.forEach(city => {

                let option = document.createElement("option");
                option.value = city.id;
                option.innerHTML = city.name;

                city_select.appendChild(option);

            });

            //load current address

            const current_address_checkbox = document.getElementById("checkbox1");

            current_address_checkbox.addEventListener("change", function () {

                let first_name = document.getElementById("first-name");
                let last_name = document.getElementById("last-name");
                let line_one = document.getElementById("line-one");
                let line_two = document.getElementById("line-two");
                let postal_code = document.getElementById("postal-code");
                let mobile = document.getElementById("mobile");
                let email = document.getElementById("email");

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
                    email = "";


                }

            });

let st_tbody = document.getElementById("st-tbody");
let st_item_tr = document.getElementById("st-item-tr");

let st_subtotal_tr = document.getElementById("st-subtotal-tr");
let st_shipping_charges_span = document.getElementById("st-product-shipping-charges");
let st_total_amount_span = document.getElementById("st-order-total-amount");
let st_subtotal_amount_span = document.getElementById("st-product-total"); // subtotal amount span

st_tbody.innerHTML = "";

let subtotal = 0;

cartItems.forEach(cart => {
    let clone = st_item_tr.cloneNode(true);
    clone.removeAttribute("id");
    clone.style.display = "";

    clone.querySelector("#product-a1").href = "single-product.html?id=" + cart.product.id;
    clone.querySelector("#product-image").src = "product-images/" + cart.product.id + "/image1.jpeg";
    clone.querySelector("#st-product-title").innerHTML = cart.product.title;
    clone.querySelector("#st-product-qty").innerHTML = cart.qty;

    let unitPrice = Number(cart.product.price);
    let itemTotal = unitPrice * cart.qty;
    subtotal += itemTotal;

    clone.querySelector("#st-product-price").innerHTML = unitPrice.toFixed(2);
    clone.querySelector("#st-product-total-amount").innerHTML = itemTotal.toFixed(2);

    st_tbody.appendChild(clone);
});

// Display subtotal
st_subtotal_amount_span.innerHTML = subtotal.toFixed(2);

// Shipping calculation and total
let shipping_charges = 0;

city_select.addEventListener("change", () => {
    let cityName = city_select.options[city_select.selectedIndex].innerHTML.trim().toLowerCase();

    // Use deliveryTypes properly
    shipping_charges = (cityName === "colombo")
        ? deliveryTypes[0].price
        : deliveryTypes[1].price;

    st_shipping_charges_span.innerHTML = shipping_charges.toFixed(2);

    let total = subtotal + shipping_charges;
    st_total_amount_span.innerHTML = total.toFixed(2);
});

// Trigger once on load
city_select.dispatchEvent(new Event("change"));

        } else {
            if (json.message === "Empty cart") {
                popup.error({
                    message: "Emmpty cart . Please add some products"
                });
                window.location = "index.html";
            } else {


                popup.error({
                    message: json.message
                });
            }

        }



    } else {
        if (response.status === 401) {
            window.location = "sign-in.html";
        }
//        if(response.status ===404){
//            window.location= "404.html";
//        }

    }


}

async function checkout() {
    let checkbox1 = document.getElementById("checkbox1").checked;
    let first_name = document.getElementById("first-name");
    let last_name = document.getElementById("last-name");
    let line_one = document.getElementById("line-one");
    let line_two = document.getElementById("line-two");
    let postal_code = document.getElementById("postal-code");
    let mobile = document.getElementById("mobile");
    const city_select = document.getElementById("city-select");

    let data = {
        isCurrentAddress: checkbox1,
        firstName: first_name.value,
        lastName: last_name.value,
        citySelect: city_select.value,
        lineOne: line_one.value,
        lineTwo: line_two.value,
        postalCode: postal_code.value,
        mobile: mobile.value
    };

    let dataJSON = JSON.stringify(data);

    const response = await fetch("Checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: dataJSON
    });


    const popup = new Notification();

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



}

