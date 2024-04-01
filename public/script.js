document.addEventListener("DOMContentLoaded", () => {
    const addCraftBtn = document.getElementById("addCraft");
    const addCraftModal = document.getElementById("add-craft-overlay");
    const addCraftCloseBtn = document.getElementById("add-craft-close");
    const addCraftForm = document.getElementById("craft-form");
    const addCraftPreview = document.getElementById("preview");
    const addCraftImageInput = document.getElementById("image");
    const addCraftSuppliesList = document.getElementById("supplies-list");

    addCraftBtn.addEventListener("click", () => {
        addCraftModal.classList.remove("hidden");
    });

    addCraftCloseBtn.addEventListener("click", () => {
        addCraftModal.classList.add("hidden");
        addCraftForm.reset();
        addCraftPreview.src = "https://www.placehold.it/200x300";
        addCraftSuppliesList.innerHTML = "";
    });

    addCraftImageInput.addEventListener("change", () => {
        const file = addCraftImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                addCraftPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
	function refreshCraftsList(data) {
		// Update crafts list with new data
		const craftsList = document.getElementById("crafts");
		craftsList.innerHTML = "";
	
		data.forEach(craft => {
			// Create craft card
			const craftCard = document.createElement("div");
			craftCard.classList.add("craft-card");
	
			// Create image element
			const img = document.createElement("img");
			img.src = "https://assignment14-hfqa.onrender.com" + craft.image; // Prepend base URL here
			img.alt = craft.name;
	
			// Append image to craft card
			craftCard.appendChild(img);
	
			// Append craft card to crafts list
			craftsList.appendChild(craftCard);
		});
	}

    addCraftForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(addCraftForm);

        // Make a POST request to add craft
        fetch("/api/crafts", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Close modal and reset form
            addCraftModal.classList.add("hidden");
            addCraftForm.reset();
            addCraftPreview.src = "https://www.placehold.it/200x300";
            addCraftSuppliesList.innerHTML = "";

            // Refresh crafts list
            refreshCraftsList(data);
        })
        .catch(error => console.error("Error adding craft:", error));
    });
});

