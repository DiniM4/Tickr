package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.User;
import hibernate.Wishlist;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Dini
 */
@WebServlet(name = "LoadWishlistItems", urlPatterns = {"/LoadWishlistItems"})
public class LoadWishlistItems extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        System.out.println("LoadWishlistItems servlet called");

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        response.setContentType("application/json");

        List<Wishlist> wishList = new ArrayList<>();

        User user = (User) request.getSession().getAttribute("user");

        if (user != null) {
            // Logged-in user: Load wishlist from DB
            Session session = HibernateUtil.getSessionFactory().openSession();
            Criteria criteria = session.createCriteria(Wishlist.class);
            criteria.add(Restrictions.eq("user", user));
            wishList = criteria.list();

            // Optionally initialize product data
            for (Wishlist wish : wishList) {
                if (wish.getProduct() != null) {
                    wish.getProduct().getTitle(); // Force initialization if lazy
                }
            }

            session.close();
        } else {
            // Guest user: Load wishlist from session
            ArrayList<Wishlist> sessionWishs = (ArrayList<Wishlist>) request.getSession().getAttribute("sessionWish");
            if (sessionWishs != null) {
                wishList = sessionWishs;
            }
        }

        if (wishList.isEmpty()) {
            responseObject.addProperty("message", "Your wishlist is empty");
        } else {
            // Clean references to avoid cyclic JSON errors
            for (Wishlist wish : wishList) {
                wish.setUser(null);
            }

            responseObject.addProperty("status", true);
            responseObject.addProperty("message", "Wishlist items loaded successfully");
            responseObject.add("wishItems", gson.toJsonTree(wishList));
        }

        response.getWriter().write(gson.toJson(responseObject));
    }

}
