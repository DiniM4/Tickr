window.onload = function () {
    // Example: Load from localStorage (set this after payment in checkout.js)
    const invoiceData = JSON.parse(localStorage.getItem("invoiceData") || "{}");
    const tbody = document.querySelector("#invoice-table tbody");
    let grandTotal = 0;

    if (invoiceData.items) {
        invoiceData.items.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.title}</td>
                <td>${item.qty}</td>
                <td>${Number(item.price).toFixed(2)}</td>
                <td>${(item.qty * item.price).toFixed(2)}</td>
            `;
            grandTotal += item.qty * item.price;
            tbody.appendChild(tr);
        });
    }
    document.getElementById("grand-total").textContent = grandTotal.toFixed(2);
};

// Download as PDF using jsPDF
function downloadInvoice() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.html(document.getElementById("invoice-content"), {
        callback: function (doc) {
            doc.save("invoice.pdf");
        },
        margin: [10, 10, 10, 10],
        autoPaging: 'text',
        x: 10,
        y: 10,
        width: 180
    });
}