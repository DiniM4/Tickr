package controller;

import com.itextpdf.html2pdf.HtmlConverter;
import hibernate.Orders;
import hibernate.OrderItems;
import hibernate.User;
import hibernate.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "InvoiceServlet", urlPatterns = {"/InvoiceServlet"})
public class InvoiceServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int orderId = Integer.parseInt(request.getParameter("orderId"));
        
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;
        try {
            transaction = session.beginTransaction();
            Orders order = session.get(Orders.class, orderId);
            User user = order.getUser();
            List<OrderItems> orderItems = order.getOrderItems();

            StringBuilder htmlContent = new StringBuilder();
            htmlContent.append("<html><head><title>Invoice</title></head><body>");
            htmlContent.append("<img src='assets/img/logo.svg' alt='Logo' style='width: 200px;'><h1>Thank You!</h1>");
            htmlContent.append("<h2>Invoice</h2>");
            htmlContent.append("<p>Order ID: ").append(orderId).append("</p>");
            htmlContent.append("<p>Name: ").append(user.getFirst_name()).append(" ").append(user.getLast_name()).append("</p>");
            htmlContent.append("<table border='1' style='width: 100%; border-collapse: collapse;'>");
            htmlContent.append("<tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr>");

            double totalAmount = 0;
            for (OrderItems item : orderItems) {
                double itemTotal = item.getQty() * item.getProduct().getPrice();
                totalAmount += itemTotal;
                htmlContent.append("<tr>")
                        .append("<td>").append(item.getProduct().getTitle()).append("</td>")
                        .append("<td>").append(item.getQty()).append("</td>")
                        .append("<td>").append(item.getProduct().getPrice()).append("</td>")
                        .append("<td>").append(itemTotal).append("</td>")
                        .append("</tr>");
            }

            htmlContent.append("</table>");
            htmlContent.append("<h3>Total Amount: ").append(totalAmount).append("</h3>");
            htmlContent.append("<button onclick='window.print()'>Print</button>");
            htmlContent.append("</body></html>");

            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
            PrintWriter writer = response.getWriter();
            HtmlConverter.convertToPdf(htmlContent.toString(), writer);

            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
        } finally {
            session.close();
        }
    }
}