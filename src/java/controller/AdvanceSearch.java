package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.Category;
import hibernate.Color;
import hibernate.HibernateUtil;
import hibernate.Model;
import hibernate.Product;
import hibernate.Status;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "AdvanceSearch", urlPatterns = {"/AdvanceSearch"})
public class AdvanceSearch extends HttpServlet {

    private static final int MAX_RESULT = 6;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {

            Gson gson = new Gson();
            JsonObject requestJson = gson.fromJson(request.getReader(), JsonObject.class);
            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("status", false);
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session session = sf.openSession();

            Criteria criteria = session.createCriteria(Product.class);

            // Filter by brand
            if (requestJson.has("brandName")) {
                String brandName = requestJson.get("brandName").getAsString();
                Brand brand = (Brand) session.createCriteria(Brand.class)
                        .add(Restrictions.eq("name", brandName)).uniqueResult();
                if (brand != null) {
                    List<Model> models = session.createCriteria(Model.class)
                            .add(Restrictions.eq("brand", brand)).list();
                    if (!models.isEmpty()) {
                        criteria.add(Restrictions.in("model", models));
                    }
                }
            }

            // Filter by category
            if (requestJson.has("categoryName")) {
                String categoryName = requestJson.get("categoryName").getAsString();
                Category category = (Category) session.createCriteria(Category.class)
                        .add(Restrictions.eq("value", categoryName)).uniqueResult();
                if (category != null) {
                    criteria.add(Restrictions.eq("category", category));
                }
            }

            // Filter by color
            if (requestJson.has("colorName")) {
                String colorName = requestJson.get("colorName").getAsString();
                Color color = (Color) session.createCriteria(Color.class)
                        .add(Restrictions.eq("value", colorName)).uniqueResult();
                if (color != null) {
                    criteria.add(Restrictions.eq("color", color));
                }
            }

            // Filter by price
            if (requestJson.has("priceStart") && requestJson.has("priceEnd")) {
                double priceStart = requestJson.get("priceStart").getAsDouble();
                double priceEnd = requestJson.get("priceEnd").getAsDouble();
                criteria.add(Restrictions.ge("price", priceStart));
                criteria.add(Restrictions.le("price", priceEnd));
            }

            // Sort
            if (requestJson.has("sortValue")) {
                String sortValue = requestJson.get("sortValue").getAsString();
                switch (sortValue) {
                    case "Sort by Latest":
                        criteria.addOrder(Order.desc("id"));
                        break;
                    case "Sort by Oldest":
                        criteria.addOrder(Order.asc("id"));
                        break;
                    case "Sort by Name":
                        criteria.addOrder(Order.asc("title"));
                        break;
                    case "Sort by Price":
                        criteria.addOrder(Order.asc("price"));
                        break;
                }
            }

            // Filter by status
            Status activeStatus = (Status) session.get(Status.class, 1);
            if (activeStatus != null) {
                criteria.add(Restrictions.eq("status", activeStatus));
            }

            // Total count
            responseJson.addProperty("allProductCount", criteria.list().size());

            // Pagination
            if (requestJson.has("firstResult")) {
                int firstResult = requestJson.get("firstResult").getAsInt();
                criteria.setFirstResult(firstResult);
                criteria.setMaxResults(MAX_RESULT);
            }

            // Final result
            List<Product> productList = criteria.list();
            for (Product p : productList) {
                p.setAdmin(null); // avoid lazy loading
            }

            responseJson.add("productList", gson.toJsonTree(productList));
            responseJson.addProperty("status", true);

            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseJson));

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
