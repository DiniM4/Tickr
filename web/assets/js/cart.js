async function loadCartItems() {
    const popup = new Notification();

    try {
        const response = await fetch("LoadCartItems");

        if (response.ok) {
            const json = await response.json();
            console.log("JSON Response:", json);

            if (json.status) {
                const cartItems = json.cartList;  // Use 'cartList' from response
                console.log("Cart Items:", cartItems);

                const cartContainer = document.getElementById("cart-item-container");
                const sampleRow = document.getElementById("cart-item-row");

                cartContainer.innerHTML = ""; // Clear previous rows

                let totalQty = 0;
                let totalAmount = 0;

                cartItems.forEach(cart => {
                    const product = cart.product;
                    const qty = cart.qty;
                    const price = parseFloat(product.price);
                    const subTotal = qty * price;

                    const row = sampleRow.cloneNode(true);
                    row.style.display = "table-row"; // Show cloned row

                    // Fill product data
                    row.querySelector("#product-a1").href = `single-product-view.html?id=${product.id}`;
                    row.querySelector("#product-image").src = `product-images/${product.id}/image1.jpeg`;
                    row.querySelector("#product-title").innerText = product.title;
                    row.querySelector("#product-price").innerText = price.toFixed(2);
                    row.querySelector("#product-qty").value = qty;
                    row.querySelector("#product-total").innerText = subTotal.toFixed(2);
                    row.querySelector("#remove-cart-btn").setAttribute("data-cart-id", cart.id);

                    cartContainer.appendChild(row);

                    // Update totals
                    totalQty += qty;
                    totalAmount += subTotal;
                });

                // Update cart totals display
                document.getElementById("order-total-quantity").innerText = totalQty;
                document.getElementById("order-total-amount").innerText = `Rs. ${totalAmount.toFixed(2)}`;

                // After rendering all cart items
                cartContainer.querySelectorAll(".remove-cart-btn").forEach(btn => {
                    btn.addEventListener("click", async function (e) {
                        e.preventDefault();
                        const cartId = this.getAttribute("data-cart-id");
                        if (!cartId) return;

                        try {
                            const response = await fetch(`DeleteCartItem?id=${cartId}`, { method: "DELETE" });
                            const result = await response.json();
                            if (result.status) {
                                loadCartItems(); // Reload cart after deletion
                            } else {
                                popup.error({ message: result.message || "Failed to delete item." });
                            }
                        } catch (err) {
                            popup.error({ message: "Error deleting cart item." });
                        }
                    });
                });
            } else {
                console.error("Failed to load cart items:", json.message);
            }
        } else {
            console.error("HTTP Error:", response.statusText);
        }
    } catch (error) {
        console.error("Network Error:", error);
    }
}



// Delete Brand
deleteBtn.addEventListener("click", function () {
    const brandId = brandIdInput.value;

    if (brandId && confirm("Are you sure you want to delete this brand?")) {
        fetch("DeleteBrandServlet", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `brandId=${brandId}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        alert("Brand deleted successfully");
                        resetForm();
                        loadBrand();
                    } else {
                        alert("Delete failed: " + data.message);
                    }
                })
                .catch(() => alert("Failed to delete brand due to network error"));
    }
});
