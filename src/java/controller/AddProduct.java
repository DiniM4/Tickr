/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Admin;
import hibernate.Brand;
import hibernate.Category;
import hibernate.Color;
import hibernate.HibernateUtil;
import hibernate.Model;
import hibernate.Product;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

/**
 *
 * @author Dini
 */
@MultipartConfig
@WebServlet(name = "AddProduct", urlPatterns = {"/AddProduct"})
public class AddProduct extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String brandId = request.getParameter("brandId");
        String modelId = request.getParameter("modelId");
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        String colorId = request.getParameter("colorId");
        String categoryId = request.getParameter("categoryId");
        String price = request.getParameter("price");
        String qty = request.getParameter("qty");

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

       Brand brand = (Brand) s.load(Brand.class,Integer.parseInt(brandId));
        Model model = (Model) s.load(Model.class, Integer.parseInt(modelId));
        Color color = (Color) s.load(Color.class, Integer.parseInt(colorId));
        Category category = (Category) s.load(Category.class, Integer.parseInt(categoryId));
        Admin admin = (Admin) request.getSession().getAttribute("admin");

        Product p = new Product();

        p.setModel(model);
        p.setTitle(title);
        p.setDescription(description);
        p.setColor(color);
        p.setCategory(category);
        p.setPrice(Double.parseDouble(price));
        p.setQty(Integer.parseInt(qty));
        p.setAdmin(admin);
        p.setCreated_at(new Date());

        int id = (int) s.save(p);
        s.beginTransaction().commit();
        s.close();

        Part part1 = request.getPart("image1");
        Part part2 = request.getPart("image2");
        Part part3 = request.getPart("image3");

        String appPath = getServletContext().getRealPath("");//Full Path pf the web pages folder

        String newPath = appPath.replace("build\\web", "web\\product-images");

        File productFolder = new File(newPath, String.valueOf(id));
        productFolder.mkdir();
        File file1 = new File(productFolder, "image1.jpeg");
        Files.copy(part1.getInputStream(), file1.toPath(), StandardCopyOption.REPLACE_EXISTING);

        File file2 = new File(productFolder, "image2.jpeg");
        Files.copy(part2.getInputStream(), file2.toPath(), StandardCopyOption.REPLACE_EXISTING);

        File file3 = new File(productFolder, "image3.jpeg");
        Files.copy(part3.getInputStream(), file3.toPath(), StandardCopyOption.REPLACE_EXISTING);

        //image uploadin
        Gson gson = new Gson();
        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);

    }

}
