const brandTableBody = document.getElementById("brandTableBody");
const brandNameInput = document.getElementById("brandName");
const brandIdInput = document.getElementById("brandId");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const addBtn = document.getElementById("addBtn");
const brandTable = document.getElementById("brandTable");

// Load brands from backend and populate the table
async function loadBrand() {
    const response = await fetch("LoadBrand");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            const brandItems = json.brandList;
            brandTableBody.innerHTML = "";

            brandItems.forEach(brand => {
                // Create a new row instead of cloning
                const tr = document.createElement("tr");

                const tdId = document.createElement("td");
                tdId.textContent = brand.id;
                tr.appendChild(tdId);

                const tdName = document.createElement("td");
                tdName.textContent = brand.name;
                tr.appendChild(tdName);

                tr.addEventListener("click", () => {
                    brandIdInput.value = brand.id;
                    brandNameInput.value = brand.name;
                    updateBtn.disabled = false;
                    deleteBtn.disabled = false;
                });

                brandTableBody.appendChild(tr);
            });
        } else {
            alert("Failed to load brands: " + json.message);
        }
    } else {
        alert("Network error while loading brands");
    }
}

// Add Brand
addBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const brandName = brandNameInput.value.trim();

    if (brandName !== "") {
        fetch("AddBrandServlet", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `brandName=${encodeURIComponent(brandName)}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        alert("Brand added successfully");
                        resetForm();
                        loadBrand();
                    } else {
                        alert("Add failed: " + data.message);
                    }
                })
                .catch(() => alert("Failed to add brand due to network error"));
    } else {
        alert("Please enter a brand name");
    }
});

// Update Brand
updateBtn.addEventListener("click", function () {
    const brandId = brandIdInput.value;
    const brandName = brandNameInput.value.trim();

    if (brandId && brandName) {
        fetch("UpdateBrandServlet", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `brandId=${brandId}&brandName=${encodeURIComponent(brandName)}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        alert("Brand updated successfully");
                        resetForm();
                        loadBrand();
                    } else {
                        alert("Update failed: " + data.message);
                    }
                })
                .catch(() => alert("Failed to update brand due to network error"));
    } else {
        alert("Please select a brand and enter a name");
    }
});

// Delete Brand
deleteBtn.addEventListener("click", function () {
    const brandId = brandIdInput.value;

    if (brandId && confirm("Are you sure you want to delete this brand?")) {
        fetch("DeleteBrandServlet", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `brandId=${brandId}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        alert("Brand deleted successfully");
                        resetForm();
                        loadBrand();
                    } else {
                        alert("Delete failed: " + data.message);
                    }
                })
                .catch(() => alert("Failed to delete brand due to network error"));
    }
});

// Clear form + disable buttons
function resetForm() {
    brandIdInput.value = "";
    brandNameInput.value = "";
    updateBtn.disabled = true;
    deleteBtn.disabled = true;
}

// Initial load when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    loadBrand();
    resetForm();
});
