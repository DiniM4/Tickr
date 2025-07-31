function indexOnloadFunctions() {
    checkSessionCart();
    loadProductData();
    checkSessionWish();
}
async function checkSessionCart() {
    const popup = new Notification();
    const response = await fetch("CheckSessionCart");
    if (!response.ok) {
        popup.error({
            message: "Something went wrong! Try again shortly"
        });
    }
}


async function checkSessionWish() {
    const popup = new Notification();
    const response = await fetch("CheckSessionWishlist");
    if (!response.ok) {
        popup.error({
            message: "Something went wrong! Try again shortly"
        });
    }
}

async function loadProductData() {

    const popup = new Notification();
    const response = await fetch("LoadHomeData");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
//            loadBrands(json);
            loadNewArrivals(json);
        } else {
            popup.error({
                message: "Something went wrong! Try again shortly"
            });
        }
    } else {
        popup.error({
            message: "Something went wrong! Try again shortly"
        });
    }
}

function loadBrands(json) {
    const product_brand_container = document.getElementById("product-brand-container");
    let product_brand_card = document.getElementById("product-brand-card");
    product_brand_container.innerHTML = "";
    let card_delay = 200;
    json.brandList.forEach(item => {
        let product_brand_card_clone = product_brand_card.cloneNode(true);
        product_brand_card_clone.querySelector("#product-brand-mini-card")
                .setAttribute("data-sal", "zoom-out");
        product_brand_card_clone.querySelector("#product-brand-mini-card")
                .setAttribute("data-sal-delay", String(card_delay));
        product_brand_card_clone.querySelector("#product-brand-a")
                .href = "search.html";
        product_brand_card_clone.querySelector("#product-brand-title")
                .innerHTML = item.name;
        product_brand_container.appendChild(product_brand_card_clone);
        card_delay += 100;
        sal();
    });
}

function loadNewArrivals(json) {
//    const new_arrival_product_container = document.getElementById("new-arrival-product-container");
//    new_arrival_product_container.innerHTML = "";
    
      //similer products
                let smiler_product_main = document.getElementById("smiler-product-main");
                let productHtml = document.getElementById("similer-product");
                smiler_product_main.innerHTML = "";

                json.productList.forEach(item => {
                    let productCloneHtml = productHtml.cloneNode(true);
                    productCloneHtml.querySelector("#similer-product-a1").href = "single-product-view.html?id=" + item.id;
                    productCloneHtml.querySelector("#similer-product-image").src = "product-images\\" + item.id + "\\image1.jpeg";
                    productCloneHtml.querySelector("#simler-product-add-to-cart").addEventListener(
                            "click", (e) => {
                        addToCart(item.id, 1);
                        e.preventDefault();
                    });
                     productCloneHtml.querySelector("#simler-product-add-to-wish").addEventListener(
                            "click", (e) => {
                        addToWish(item.id);
                        e.preventDefault();
                    });
                    productCloneHtml.querySelector("#simlier-product-a2").href = "single-product-view.html?id=" + item.id;
                    productCloneHtml.querySelector("#similer-product-title").innerHTML = item.title;

                    productCloneHtml.querySelector("#similer-product-category").innerHTML = item.category.value;
                    productCloneHtml.querySelector("#similer-product-price").innerHTML = new Intl.NumberFormat("en-US",
                            {minimumFractionDigits: 2}).format(item.price);

                    productCloneHtml.querySelector("#similer-product-color").innerHTML =item.color.value;
//                    productCloneHtml.querySelector("#similer-product-color-background").style.backgroundColor = item.color.value;

                    smiler_product_main.appendChild(productCloneHtml);



                });

  

}

async function addToCart(productId, qty) {
    const popup = new Notification();// link notification js in single-product.html
    const response = await fetch("AddToCart?prId=" + productId + "&qty=" + qty);
    if (response.ok) {
        const json = await response.json(); // await response.text();
        if (json.status) {
            popup.success({
                message: json.message
            });
        } else {
            popup.error({
                message: "Something went wrong. Try again"
            });

        }
    } else {
        popup.error({
            message: "Something went wrong. Try again"
        });
    }
}



async function addToWish(productId) {
    console.log("Adding to wishlist product id:", productId);

    const popup = new Notification();
    const response = await fetch("AddToWishlist?prId=" + productId);

    console.log("Response status:", response.status);

    if (response.ok) {
        const json = await response.json();
        console.log("Response JSON:", json);
        if (json.status) {
            popup.success({ message: json.message });
        } else {
            popup.error({ message: json.message || "Something went wrong. Try again" });
        }
    } else {
        popup.error({ message: "Server error. Try again" });
    }
}



