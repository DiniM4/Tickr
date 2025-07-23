
var modelList;


async function loadProductsData() {
    console.log("ok");

    const  response = await fetch("loadProductsData");

    if (response.ok) {
        const json = await response.json();
        console.log(json);
        if (json.status) {

            //load brands
            loadSelect("brand", json.brandList, "name");


            //load models
            modelList = json.modelList;
            // loadSelect("model",json.modelList,"name");



            //load color
            loadSelect("color", json.colorList, "value");

            //load qualtiy
            loadSelect("category", json.categoryList, "value");


        } else {
            document.getElementById("message").innerHTML = "Unable to get product data ! Please try again later";

        }
    } else {
        document.getElementById("message").innerHTML = "Unable to get product data ! Please try again later";

    }



}

function loadSelect(selectId, list, property) {
    const select = document.getElementById(selectId);

    list.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item[property];
        select.appendChild(option);
    });

}

function loadModels() {

    const brandId = document.getElementById("brand").value;
    const modelSelect = document.getElementById("model");
    modelSelect.length = 1;

    modelList.forEach(item => {
        if (item.brand.id == brandId) {
            const option = document.createElement("option");
            option.value = item.id;
            option.innerHTML = item.name;
            modelSelect.appendChild(option);


        }
    });

}


async function saveProductData() {
    const  brandId = document.getElementById("brand").value;
    const  modelId = document.getElementById("model").value;
    const  title = document.getElementById("title").value;
    const  description = document.getElementById("description").value;
    const  colorId = document.getElementById("color").value;
    const  categoryId = document.getElementById("category").value;
    const  price = document.getElementById("price").value;
    const  qty = document.getElementById("qty").value;


    const image1 = document.getElementById("img1").files[0];
    const image2 = document.getElementById("img2").files[0];
    const image3 = document.getElementById("img3").files[0];

    const form = new FormData();
    form.append("brandId", brandId);
    form.append("modelId", modelId);
    form.append("title", title);
    form.append("description", description);
    form.append("colorId", colorId);
    form.append("categoryId", categoryId);
    form.append("price", price);
    form.append("qty", qty);
    form.append("image1", image1);
    form.append("image2", image2);
    form.append("image3", image3);

    const reponse = await fetch("AddProduct", {
        method: "POST",
        body: form
    });

    if (response.ok) {
        const json = await response.json();

        if (json.status) { //true- success

        } else { //when status false
            if (json.message === "Please Sign In!") {
                window.location = "login.html";
            } else {

                document.getElementById("message").innerHTML = "Unable to Add product data ! Please try again later";

            }
        }
    } else {
        document.getElementById("message").innerHTML = "Unable to Add product data ! Please try again later";


    }


}