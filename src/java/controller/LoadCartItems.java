package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import org.hibernate.*;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadCartItems", urlPatterns = {"/LoadCartItems"})
public class LoadCartItems extends HttpServlet {

  
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            User user = (User) request.getSession().getAttribute("user");

            if (user != null) {
                // User logged in: load cart items from DB
                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session session = sf.openSession();

                Criteria criteria = session.createCriteria(Cart.class);
                criteria.add(Restrictions.eq("user", user));
                List<Cart> cartList = criteria.list();
                session.close();

                if (cartList != null && !cartList.isEmpty()) {
                    for (Cart cart : cartList) {
                        // Do NOT call cart.getProduct().setUser(null);
                        // Just nullify the user reference in cart to prevent circular JSON serialization
                        cart.setUser(null);
                    }
                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "Cart items loaded successfully");
                    responseObject.add("cartList", gson.toJsonTree(cartList));
                } else {
                    responseObject.addProperty("status", false);
                    responseObject.addProperty("message", "Your cart is empty.");
                }
            } else {
                // User not logged in: load from session cart
                List<Cart> sessionCarts = (List<Cart>) request.getSession().getAttribute("sessionCart");
                if (sessionCarts != null && !sessionCarts.isEmpty()) {
                    for (Cart cart : sessionCarts) {
                        // Do NOT call cart.getProduct().setUser(null);
                        cart.setUser(null);
                    }
                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "Session cart loaded successfully");
                    responseObject.add("cartList", gson.toJsonTree(sessionCarts));
                } else {
                    responseObject.addProperty("status", false);
                    responseObject.addProperty("message", "Your cart is empty.");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();  // Logs to server console for debugging
            responseObject.addProperty("status", false);
            responseObject.addProperty("message", "Server error: " + e.getMessage());
        }

        String json = gson.toJson(responseObject);
        response.getWriter().write(json);
    
    }
    
}