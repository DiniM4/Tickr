const catTableBody = document.getElementById("catTableBody");
const catNameInput = document.getElementById("catName");
const catIdInput = document.getElementById("catsId");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const addBtn = document.getElementById("addBtn");
const catTable = document.getElementById("catTable");

// Load brands from backend and populate the table
async function loadCategory() {
    const response = await fetch("LoadCategory");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            const catItems = json.catList;
            catTableBody.innerHTML = "";

            catItems.forEach(cat => {
                // Create a new row instead of cloning
                const tr = document.createElement("tr");

                const tdId = document.createElement("td");
                tdId.textContent = cat.id;
                tr.appendChild(tdId);

                const tdName = document.createElement("td");
                tdName.textContent = cat.value;
                tr.appendChild(tdName);

                tr.addEventListener("click", () => {
                    catIdInput.value = cat.id;
                    catNameInput.value = cat.value;
                    updateBtn.disabled = false;
                    deleteBtn.disabled = false;
                });

                catTableBody.appendChild(tr);
            });
        } else {
            alert("Failed to load cats: " + json.message);
        }
    } else {
        alert("Network error while loading Category");
    }
}

// Add Category
addBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const catName = catNameInput.value.trim();

    if (catName !== "") {
        fetch("AddCategoryServlet", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `catName=${encodeURIComponent(catName)}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        alert("Category added successfully");
                        resetForm();
                        loadCategory();
                    } else {
                        alert("Add failed: " + data.message);
                    }
                });
    } else {
        alert("Please enter a Category name");
    }
});

// Update Category
updateBtn.addEventListener("click", function () {
    const catId = catIdInput.value;
    const catName = catNameInput.value.trim();

    if (catId && catName) {
        fetch("UpdateCategoryServlet", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `catId=${catId}&catName=${encodeURIComponent(catName)}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        alert("Category updated successfully");
                        resetForm();
                        loadCategory();
                    } else {
                        alert("Update failed: " + data.message);
                    }
                });
    } else {
        alert("Please select a Category and enter a name");
    }
});

// Delete Brand
deleteBtn.addEventListener("click", function () {
    const catId = catIdInput.value;

    if (catId && confirm("Are you sure you want to delete this Category?")) {
        fetch("DeleteCategoryServlet", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `catId=${catId}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        alert("Category deleted successfully");
                        resetForm();
                        loadCategory();
                    } else {
                        alert("Delete failed: " + data.message);
                    }
                });
    }
});

// Clear form + disable buttons
function resetForm() {
    catIdInput.value = "";
    catNameInput.value = "";
    updateBtn.disabled = true;
    deleteBtn.disabled = true;
}

// Initial load when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    loadCategory();
    resetForm();
});

