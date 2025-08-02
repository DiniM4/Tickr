package model;

import java.text.DecimalFormat;
import java.util.List;

public class Util {

    public static String formatCurrency(double amount) {
        DecimalFormat formatter = new DecimalFormat("0.00");
        return formatter.format(amount);
    }

    public static String generateInvoiceHtml(String logoPath, List<Product> products, double totalAmount) {
        StringBuilder html = new StringBuilder();
        html.append("<html><head><title>Invoice</title></head><body>");
        html.append("<img src='").append(logoPath).append("' alt='Logo' style='width:150px;'><br>");
        html.append("<h2>Thank You for Your Purchase!</h2>");
        html.append("<table border='1' style='width:100%; border-collapse:collapse;'>");
        html.append("<tr><th>Product Title</th><th>Quantity</th><th>Price</th><th>Total</th></tr>");

        for (Product product : products) {
            double itemTotal = product.getPrice() * product.getQty();
            html.append("<tr>")
                .append("<td>").append(product.getTitle()).append("</td>")
                .append("<td>").append(product.getQty()).append("</td>")
                .append("<td>").append(formatCurrency(product.getPrice())).append("</td>")
                .append("<td>").append(formatCurrency(itemTotal)).append("</td>")
                .append("</tr>");
        }

        html.append("</table>");
        html.append("<h3>Total Amount: ").append(formatCurrency(totalAmount)).append("</h3>");
        html.append("<button onclick='window.print()'>Print</button>");
        html.append("</body></html>");

        return html.toString();
    }
}