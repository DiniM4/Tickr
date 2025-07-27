async function sloadData() {
    const response = await fetch("LoadsData");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);

            LoadOptions("brand", json.brandList, "name");
            LoadOptions("category", json.catList, "value");
            LoadOptions("color", json.colorList, "value");
            // Load initial products
            searchProducts(0); // <-- Add this line
        }
    }
}

function LoadOptions(prefix, datalist, property) {
    const options = document.getElementById(prefix + "-options");
    const li = document.getElementById(prefix + "-li");
    options.innerHTML = "";

    datalist.forEach(item => {
        const liClone = li.cloneNode(true);
        liClone.removeAttribute("id");
        liClone.style.display = "block";
        const aTag = liClone.querySelector("a");
        aTag.removeAttribute("id");
        aTag.innerHTML = item[property];

        liClone.addEventListener("click", function () {
            document.querySelectorAll(`#${prefix}-options li`).forEach(el => el.classList.remove("chosen"));
            this.classList.add("chosen");
            searchProducts(0); // <-- Add this to trigger search on filter select
        });

        options.appendChild(liClone);
    });
}

async function searchProducts(firstResult) {
    event.preventDefault();

    const brand_name = document.querySelector("#brand-options .chosen a")?.innerHTML;
    const cat_name = document.querySelector("#category-options .chosen a")?.innerHTML;
    const color_name = document.querySelector("#color-options .chosen a")?.innerHTML;

    const price_start = Number(document.getElementById("slider-range").value);
    const price_end = 10000000000;

    const sort_value = document.getElementById("st-sort")?.value || "Sort by Latest";

    const data = {
        firstResult: firstResult,
        brandName: brand_name,
        categoryName: cat_name,
        colorName: color_name,
        priceStart: price_start,
        priceEnd: price_end,
        sortValue: sort_value
    };

    console.log("Sending:", data);

    const response = await fetch("AdvanceSearch", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    if (response.ok) {
        console.log("ok");

        const json = await response.json();
        if (json.status) {
            console.log(json);

            updateProductView(json);
        } else {

        }
    }
}


const st_product = document.getElementById("st-product"); //product card parent node
let st_pagination_button = document.getElementById("st-pagination-button");
let current_page = 0;

function updateProductView(json) {
    const product_container = document.getElementById("st-product-container");
    product_container.innerHTML = "";
    json.productList.forEach(product => {

        let st_product_clone = st_product.cloneNode(true); //enable child nodes cloning/allow nodes
        st_product_clone.querySelector("#st-product-a-1").href = "single-product-view.html?id=" + product.id;
        st_product_clone.querySelector("#st-product-img-1").src = "product-images//" + product.id + "//image1.jpeg";
        st_product_clone.querySelector("#st-product-add-to-cart").addEventListener(
                "click", (e) => {
            addToCart(product.id, 1);
            e.preventDefault();
        });
        st_product_clone.querySelector("#st-product-a-2").href = "single-product-view.html?id=" + product.id;
        st_product_clone.querySelector("#st-product-title-1").innerHTML = product.title;
        st_product_clone.querySelector("#st-product-price-1").innerHTML = new Intl.NumberFormat(
                "en-US", {minimumFractionDigits: 2}).format(product.price);


        //append child
        product_container.appendChild(st_product_clone);

    });

    let st_pagination_container = document.getElementById("st-pagination-container");
    st_pagination_container.innerHTML = "";
    let all_product_count = json.allProductCount;
    document.getElementById("all-item-count").innerHTML = all_product_count;
    let product_per_page = 6; // all_product_count/product_per_page
    let pages = Math.ceil(all_product_count / product_per_page); //round upper integer


    //previos-button
    if (current_page != 0) {
        let st_pagination_button_prev_clone = st_pagination_button.cloneNode(true);
        st_pagination_button_prev_clone.innerHTML = "Prev";
        st_pagination_button_prev_clone.addEventListener(
                "click", (e) => {
            current_page--;
            searchProduct(current_page * product_per_page);
            e.preventDefault();
        });

        st_pagination_container.appendChild(st_pagination_button_prev_clone);

    }


    //pagination buttons

    for (let i = 0; i < pages; i++) {
        let st_pagination_button_clone = st_pagination_button.cloneNode(true);
        st_pagination_button_clone.innerHTML = i + 1;

        st_pagination_button_clone.addEventListener(
                "click", (e) => {
            current_page = i;
            searchProduct(i * product_per_page);
            e.preventDefault();
        });

        if (i == Number(current_page)) {
            st_pagination_button_clone.className = "axil-btn btn-bg-primary ml--10";
        } else {
            st_pagination_button_clone.className = "axil-btn btn-bg-secondary ml--10";
        }

        st_pagination_container.appendChild(st_pagination_button_clone);
    }

//next-button
    if (current_page != (pages - 1)) {
        let st_pagination_button_next_clone = st_pagination_button.cloneNode(true);
        st_pagination_button_next_clone.innerHTML = "Next";
        st_pagination_button_next_clone.addEventListener(
                "click", (e) => {
            current_page++;
            searchProduct(current_page * product_per_page);
            e.preventDefault();
        });

        st_pagination_container.appendChild(st_pagination_button_next_clone);

    }


}



async function addToCart(productId, qty) {
    console.log(productId + " " + qty);

    const  popup = new Notification();

    const  response = await fetch("AddToCart?prId=" + productId + "&qty=" + qty);

    if (response.ok) {
        const  json = await response.json();

        if (json.status) {
            popup.success({
                message: json.message
            });


        } else {
            popup.error({
                message: "Somthing went wrong Please try agian "
            });

        }
    } else {
        popup.error({
            message: "Somthing went wrong Please try agian "
        });
    }
}

