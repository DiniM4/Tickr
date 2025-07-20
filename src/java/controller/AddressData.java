package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Address;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.hibernate.Criteria;
import org.hibernate.Session;

/**
 *
 * @author Dini
 */
@WebServlet(name = "AddressData", urlPatterns = {"/AddressData"})
public class AddressData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession ses = request.getSession(false);
        if (ses != null && ses.getAttribute("address") != null) {
            Address add = (Address) ses.getAttribute("address");
            JsonObject responseObject = new JsonObject();
            responseObject.addProperty("lineOne", add.getLineOne());
            responseObject.addProperty("lineTwo", add.getLineTwo());
            responseObject.addProperty("postalCode", add.getPostalCode());

            Session s = HibernateUtil.getSessionFactory().openSession();

            Criteria c = s.createCriteria(Address.class);
            List<Address> addList = c.list();

            Gson gson = new Gson();
            String toJson = gson.toJson(addList);
            response.setContentType("application/json");
            response.getWriter().write(toJson);
            s.close();

        }
    }
}
