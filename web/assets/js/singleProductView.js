

async  function  loadsData() {
    console.log("ok");
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("id")) {
        const productId = searchParams.get("id");
        console.log(productId);
        const response = await fetch("SingleProduct?id=" + productId);

        if (response.ok) {
            const json = await response.json();

            if (json.status) {
                console.log(json);


                document.getElementById("image1").src = "product-images\\" + json.product.id + "\\image1.jpeg";
                document.getElementById("image2").src = "product-images\\" + json.product.id + "\\image2.jpeg";
                document.getElementById("image3").src = "product-images\\" + json.product.id + "\\image3.jpeg";

                document.getElementById("thumb-image1").src = "product-images\\" + json.product.id + "\\image1.jpeg";
                document.getElementById("thumb-image2").src = "product-images\\" + json.product.id + "\\image2.jpeg";
                document.getElementById("thumb-image3").src = "product-images\\" + json.product.id + "\\image3.jpeg";

                document.getElementById("product-title").innerHTML = json.product.title;
                document.getElementById("published-on").innerHTML = json.product.created_at;
                document.getElementById("product-price").innerHTML = new Intl.NumberFormat("en-US",
                        {minimumFractionDigits: 2}).format(json.product.price);
                document.getElementById("brand-name").innerHTML = json.product.model.brand.name;
                document.getElementById("model-name").innerHTML = json.product.model.name;
                document.getElementById("category").innerHTML = json.product.category.value;
                document.getElementById("color").innerHTML = json.product.color.value;
                document.getElementById("product-stock").innerHTML = json.product.qty;
                document.getElementById("description").innerHTML = json.product.description;



               //add to cart main button
                const addToCartMain = document.getElementById("add-to-cart-main");
                addToCartMain.addEventListener(
                        "click", (e) => {
                    addToCart(json.product.id, document.getElementById("add-to-cart-qty").value);
                    e.preventDefault();
                });

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
                    productCloneHtml.querySelector("#simlier-product-a2").href = "single-product-view.html?id=" + item.id;
                    productCloneHtml.querySelector("#similer-product-title").innerHTML = item.title;

                    productCloneHtml.querySelector("#similer-product-category").innerHTML = item.category.value;
                    productCloneHtml.querySelector("#similer-product-price").innerHTML = new Intl.NumberFormat("en-US",
                            {minimumFractionDigits: 2}).format(item.price);

                    productCloneHtml.querySelector("#similer-product-color").innerHTML =item.color.value;
//                    productCloneHtml.querySelector("#similer-product-color-background").style.backgroundColor = item.color.value;

                    smiler_product_main.appendChild(productCloneHtml);



                });

                $('.recent-product-activation').slick({
                    infinite: true,
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    arrows: true,
                    dots: false,
                    prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                    nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',
                    responsive: [{
                            breakpoint: 1199,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3
                            }
                        },
                        {
                            breakpoint: 991,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2
                            }
                        },
                        {
                            breakpoint: 479,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }
                        }
                    ]
                });
            } else {
                console.log("error");
                window.location = "index.html";
            }


        } else {

        }

    }

}

function addToCart(productId, qty) {

    console.log(productId + "" + qty);
}

