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

                    cartContainer.appendChild(row);

                    // Update totals
                    totalQty += qty;
                    totalAmount += subTotal;
                });

                // Update cart totals display
                document.getElementById("order-total-quantity").innerText = totalQty;
                document.getElementById("order-total-amount").innerText = `Rs. ${totalAmount.toFixed(2)}`;

            } else {
                popup.error({ message: json.message });
            }
        } else {
            popup.error({ message: "Failed to fetch cart data from server." });
        }
    } catch (error) {
        console.error(error);
        popup.error({ message: "Unexpected error occurred while loading cart items." });
    }
}
