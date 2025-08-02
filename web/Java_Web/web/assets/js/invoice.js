const generateInvoicePDF = (orderDetails) => {
    const { products, totalAmount } = orderDetails;

    const doc = new jsPDF();
    const logo = new Image();
    logo.src = 'assets/img/logo.svg';

    doc.addImage(logo, 'SVG', 10, 10, 50, 20);
    doc.setFontSize(20);
    doc.text("Thank You for Your Purchase!", 10, 40);
    doc.setFontSize(12);
    doc.text("Order Details:", 10, 60);

    let startY = 70;
    const tableColumn = ["Product Title", "Quantity", "Price", "Total"];
    const tableRows = [];

    products.forEach(product => {
        const productData = [
            product.title,
            product.quantity,
            product.price.toFixed(2),
            (product.price * product.quantity).toFixed(2)
        ];
        tableRows.push(productData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: startY });
    startY += tableRows.length * 10 + 20;

    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 10, startY);
    doc.text("Thank you for shopping with us!", 10, startY + 10);
    
    doc.save('invoice.pdf');
};

document.getElementById("download-invoice").addEventListener("click", () => {
    const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));
    generateInvoicePDF(orderDetails);
});

document.getElementById("print-invoice").addEventListener("click", () => {
    window.print();
});