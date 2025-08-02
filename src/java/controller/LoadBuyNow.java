
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Address;
import hibernate.Cart;
import hibernate.City;
import hibernate.DeliveryType;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.User;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadBuyNow", urlPatterns = {"/LoadBuyNow"})
public class LoadBuyNow extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String productIdParam = request.getParameter("prId"); // FIXED: match JS
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        User sessionUser = (User) request.getSession().getAttribute("user");

        if (sessionUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            responseObject.addProperty("message", "401"); // unauthorized
        } else {
            Session s = HibernateUtil.getSessionFactory().openSession();

            // Load latest user address
            Criteria c1 = s.createCriteria(Address.class);
            c1.add(Restrictions.eq("user", sessionUser));
            c1.addOrder(Order.desc("id"));

            if (c1.list().isEmpty()) {
                responseObject.addProperty("message", "Your account details are incomplete. Please fill your shipping address");
            } else {
                Address address = (Address) c1.list().get(0);

                // Clean user data before sending
                address.getUser().setEmail(null);
                address.getUser().setPassword(null);
                address.getUser().setVerification(null);
                address.getUser().setId(-1);
                address.getUser().setCreated_at(null);

                responseObject.add("userAddress", gson.toJsonTree(address));
            }

            // Load city list
            Criteria c2 = s.createCriteria(City.class);
            c2.addOrder(Order.asc("name"));
            List<City> cityList = c2.list();
            responseObject.add("cityList", gson.toJsonTree(cityList));

            // Load delivery types
            Criteria c4 = s.createCriteria(DeliveryType.class);
            List<DeliveryType> deliveryTypes = c4.list();
            responseObject.add("deliveryTypes", gson.toJsonTree(deliveryTypes));

            // Check if it's single product Buy Now
            if (productIdParam != null && !productIdParam.isEmpty()) {
                try {
                    int productId = Integer.parseInt(productIdParam);
                    Product product = (Product) s.get(Product.class, productId);

                    if (product == null) {
                        responseObject.addProperty("message", "Invalid product ID");
                    } else {
                        // Remove unnecessary associations
                        if (product.getAdmin() != null) {
                            product.setAdmin(null);
                        }


                        responseObject.add("product", gson.toJsonTree(product)); // FIXED: renamed to "product"
                        responseObject.addProperty("status", true);
                    }
                } catch (NumberFormatException e) {
                    responseObject.addProperty("message", "Invalid product ID format");
                }
            } else {
                // Load full cart
                Criteria c3 = s.createCriteria(Cart.class);
                c3.add(Restrictions.eq("user", sessionUser));
                List<Cart> cartList = c3.list();

                if (cartList.isEmpty()) {
                    responseObject.addProperty("message", "Empty cart");
                } else {
                    for (Cart cart : cartList) {
                        cart.setUser(null);
                        if (cart.getProduct() != null) {
                            cart.getProduct().setUser(null);
                        }
                    }

                    responseObject.add("cartList", gson.toJsonTree(cartList));
                    responseObject.addProperty("status", true);
                }
            }

            s.close();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
    }
}
