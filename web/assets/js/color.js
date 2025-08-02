
const catTableBody = document.getElementById("catTableBody");
const catNameInput = document.getElementById("catName");
const catIdInput = document.getElementById("catsId");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const addBtn = document.getElementById("addBtn");
const catTable = document.getElementById("catTable");

// Load brands from backend and populate the table
async function loadColor() {
    const response = await fetch("LoadColor");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            const colorItems = json.colorList;
            catTableBody.innerHTML = "";

            colorItems.forEach(cat => {
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
            alert("Failed to load color: " + json.message);
        }
    } else {
        alert("Network error while loading Color");
    }
}

// Add Category
addBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const catName = catNameInput.value.trim();

    if (catName !== "") {
        fetch("AddColorServlet", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `catName=${encodeURIComponent(catName)}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        alert("Color added successfully");
                        resetForm();
                        loadColor();
                    } else {
                        alert("Add failed: " + data.message);
                    }
                });
    } else {
        alert("Please enter a Color name");
    }
});

// Update Category
updateBtn.addEventListener("click", function () {
    const catId = catIdInput.value;
    const catName = catNameInput.value.trim();

    if (catId && catName) {
        fetch("UpdateColorServlet", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `catId=${catId}&catName=${encodeURIComponent(catName)}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        alert("Color updated successfully");
                        resetForm();
                        loadColor();
                    } else {
                        alert("Update failed: " + data.message);
                    }
                });
    } else {
        alert("Please select a Color and enter a name");
    }
});

// Delete Brand
deleteBtn.addEventListener("click", function () {
    const catId = catIdInput.value;

    if (catId && confirm("Are you sure you want to delete this Color?")) {
        fetch("DeleteColorServlet", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `catId=${catId}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        alert("Color deleted successfully");
                        resetForm();
                        loadColor();
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
    loadColor();
    resetForm();
});

