package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Mail;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Dini
 */
@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject user = gson.fromJson(request.getReader(), JsonObject.class);

        String firstName = user.get("firstName").getAsString();
        String lastName = user.get("lastName").getAsString();
        final String email = user.get("email").getAsString();
        String password = user.get("password").getAsString();

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (firstName.isEmpty()) {
            responseObject.addProperty("message", "First Name can not be empty!");

        } else if (lastName.isEmpty()) {
            responseObject.addProperty("message", "Last Name can not be empty!");

        } else if (email.isEmpty()) {
            responseObject.addProperty("message", "Email can not be empty!");

        } else if (!Util.isEmailValid(email)) {
            responseObject.addProperty("message", "Please enter a valid email!");

        } else if (password.isEmpty()) {
            responseObject.addProperty("message", "Password can not be empty!");

        } else if (!Util.isPasswordValid(password)) {
            responseObject.addProperty("message", "The password must contains at least uppercase,lowercase,number,special "
                    + "character and to be minimum eight characters long!");

        } else {

            //save
//            Session session = HibernateUtil.getSessionFactory().openSession();
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            Transaction tx = null;

            Criteria criteria = s.createCriteria(User.class);
            criteria.add(Restrictions.eq("email", email));

            if (!criteria.list().isEmpty()) {
                responseObject.addProperty("message", "User with this Email already exists!");
            } else {

                final String verificationCode = Util.generateCode();

                User u = new User();
                u.setFirst_name(firstName);
                u.setLast_name(lastName);
                u.setEmail(email);
                u.setPassword(password);

                //generate verification code
//                final String verificationCode = Util.generateCode();
                u.setVerification(verificationCode);

                //generate verification code
                u.setCreated_at(new Date());

                tx = s.beginTransaction();
                s.save(u);
                tx.commit();

//                s.beginTransaction().commit();
                //hibernate Save
                //Send Email
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        Mail.sendMail(email, "TickerWatches-Verification", "<h1>" + verificationCode + "</h1>");

                    }
                }).start();
                //send Email

                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "Registration Sussess.Please check your email for the verification code");

                // Save email to session
                HttpSession session = request.getSession();
                session.setAttribute("email", email);
            }

            s.close();
        }

        String responseText = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(responseText);

    }

}
