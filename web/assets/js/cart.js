async function loadCartItems() {
    const popup = new Notification();
    const response = await fetch("LoadCartItems");
    if (response.ok) {

        const json = await response.json();
        if (json.status) {
//  console.log(json.cartItems);
            const cart_item_container = document.getElementById("cart-item-container");
            cart_item_container.innerHTML = "";
            let total = 0;
            let totalQty = 0;
            json.cartItems.forEach(cart => {
                let productSubTotal = cart.product.price * cart.qty;
                total += productSubTotal;
                totalQty += cart.qty;
                let tableData =
                        `<tr class="cart_item"  id="cart-item-row">
                                    <td data-title="Product">
                                        <a class="cart-productimage" href="#"><img width="80" height="80" src="product-images\\${cart.product.id}\\image1.png" alt="Image" /></a>
                                    </td>
                                    <td data-title="Name">
                                        <a class="cart-productname" href="#">${cart.product.title}</a>
                                    </td>
                                    <td data-title="Price">
                                        <span class="amount">Rs.<span>${new Intl.NumberFormat("en-US",
                                {minimumFractionDigits: 2})
                        .format(cart.product.price)}</span></span>
                                    </td>
                                    <td data-title="Quantity">
                                        <div class="quantity">
                                            <input type="number" class="qty-input" value="${cart.qty}"/>
                                        </div>
                                    </td>
                                    <td data-title="Total">
                                        <span class="amount">Rs.<span> ${new Intl.NumberFormat("en-US",
                        {minimumFractionDigits: 2})
                        .format(productSubTotal)}
                                     </span></span>
                                    </td>
                                    <td data-title="Remove">
                                        <a href="#" class="remove"><i class="fal fa-trash-alt"></i></a>
                                    </td>
                                </tr>`
                
                cart_item_container.innerHTML += tableData;
            });

            document.getElementById("order-total-quantity").innerHTML = totalQty;
            document.getElementById("order-total-amount").innerHTML = new Intl.NumberFormat(
                    "en-US",
                    {
                        minimumFractionDigits: 2
                    })
                    .format(total);

        } else {
            
            
            popup.error(
                    {
                        message: json.message
                    }
            );
        }

    } else {
        popup.error(
                {
                    message: "Cart Items Loading Failed"
                }
        );
    }
}



