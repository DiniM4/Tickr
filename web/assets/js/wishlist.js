async function loadWishlistItems() {
    const popup = new Notification();

    try {
        const response = await fetch("LoadWishlistItems");

        if (response.ok) {
            const json = await response.json();

            if (json.status) {
                console.log("Wishlist Items:", json.wishItems);

                let wishlist_item_container = document.getElementById("wishlist-item-container");
                let productHtml = document.getElementById("wish-item-row");

                wishlist_item_container.innerHTML = "";

                let totalQty = 0;

                json.wishItems.forEach(wishlist => {
                    totalQty += wishlist.qty;

                    // Clone template row
                    let productCloneHtml = productHtml.cloneNode(true);

                    // Remove ID and hidden style from clone
                    productCloneHtml.removeAttribute("id");
                    productCloneHtml.style.display = "";  // Show row

                    // Update product details
                    productCloneHtml.querySelector("#product-a1").href = "single-product-view.html?id=" + wishlist.product.id;
                    productCloneHtml.querySelector("#product-image").src = "product-images/" + wishlist.product.id + "/image1.jpeg";
                    productCloneHtml.querySelector("#product-title").innerHTML = wishlist.product.title;
                    productCloneHtml.querySelector("#product-price").innerHTML = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(wishlist.product.price);

                    // Set quantity input value correctly
                    productCloneHtml.querySelector("#product-qty").innerHTML = wishlist.product.qty;

                    // Fix event listener for Add to Cart
                    productCloneHtml.querySelector("#cart").addEventListener("click", (e) => {
                        addToCart(wishlist.product.id, 1);
                        e.preventDefault();
                    });

                    // Append clone to container
                    wishlist_item_container.appendChild(productCloneHtml);
                });

                // Update total quantity display
                document.getElementById("total-quantity").innerHTML = totalQty;

            } else {
                popup.error({
                    message: json.message
                });
            }
        } else {
            popup.error({
                message: "Wishlist Items Loading Failed"
            });
        }
    } catch (error) {
        console.error("Error loading wishlist:", error);
        popup.error({
            message: "Error loading wishlist"
        });
    }
}




async function addToCart(productId, qty) {
    console.log(productId + " " + qty);

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


