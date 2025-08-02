const catTableBody = document.getElementById("catTableBody");
const catNameInput = document.getElementById("catName");
const catIdInput = document.getElementById("catsId");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const addBtn = document.getElementById("addBtn");
const catTable = document.getElementById("catTable");

// Load brands from backend and populate the table
async function loadCity() {
    const response = await fetch("LoadCity");
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
                tdName.textContent = cat.name;
                tr.appendChild(tdName);

                tr.addEventListener("click", () => {
                    catIdInput.value = cat.id;
                    catNameInput.value = cat.name;
                    updateBtn.disabled = false;
                    deleteBtn.disabled = false;
                });

                catTableBody.appendChild(tr);
            });
        } else {
            alert("Failed to load cats: " + json.message);
        }
    } else {
        alert("Network error while loading City");
    }
}

// Add Category
addBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const catName = catNameInput.value.trim();

    if (catName !== "") {
        fetch("AddCityServlet", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `catName=${encodeURIComponent(catName)}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        alert("City added successfully");
                        resetForm();
                        loadCity();
                    } else {
                        alert("Add failed: " + data.message);
                    }
                });
    } else {
        alert("Please enter a City name");
    }
});

// Update Category
updateBtn.addEventListener("click", function () {
    const catId = catIdInput.value;
    const catName = catNameInput.value.trim();

    if (catId && catName) {
        fetch("UpdateCityServlet", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `catId=${catId}&catName=${encodeURIComponent(catName)}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        alert("City updated successfully");
                        resetForm();
                        loadCity();
                    } else {
                        alert("Update failed: " + data.message);
                    }
                });
    } else {
        alert("Please select a City and enter a name");
    }
});

// Delete Brand
deleteBtn.addEventListener("click", function () {
    const catId = catIdInput.value;

    if (catId && confirm("Are you sure you want to delete this City?")) {
        fetch("DeleteCityServlet", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `catId=${catId}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        alert("City deleted successfully");
                        resetForm();
                        loadCity();
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
    loadCity();
    resetForm();
});

