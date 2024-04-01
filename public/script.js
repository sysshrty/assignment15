const retrieveCrafts = async () => {
	try {
		return (await fetch("./api/crafts")).json();
	} catch (error) {
		console.log(error);
		return "";
	}
};

const retrieveCraft = (selectedCraft) => {
    const craftImageElement = document.createElement("img");
    craftImageElement.src = "/images/" + selectedCraft.image;

	craftImageElement.onclick = () => {
		const overlayElement = document.getElementById("craft-area");
		const modalDivElement = document.getElementById("craft-modal");
		modalDivElement.innerHTML = "";
		const buttonWrapElement = document.createElement("p");
		buttonWrapElement.id = "btn-wrap";
		const closeButtonElement = document.createElement("button");
		closeButtonElement.onclick = () => {
			overlayElement.classList.add("hidden");
			modalDivElement.classList.add("hidden");
		};
		closeButtonElement.innerHTML = "X";
		buttonWrapElement.append(closeButtonElement);
		modalDivElement.append(buttonWrapElement);
		const flexDivElement = document.createElement("div");
		flexDivElement.id =	"flex-div";
		const imgDivElement = document.createElement("div");
		const flexImageElement = document.createElement("img");
		flexImageElement.src = "./images/" + selectedCraft.image;
		imgDivElement.append(flexImageElement);
		const textDivElement = document.createElement("div");
		const craftH2Element = document.createElement("h2");
		craftH2Element.innerHTML = selectedCraft.name;
		textDivElement.append(craftH2Element);
		const descPElement = document.createElement("p");
		descPElement.innerHTML = selectedCraft.description;
		textDivElement.append(descPElement);
		const craftH3Element = document.createElement("h3");
		craftH3Element.innerHTML = "Supplies:";
		textDivElement.append(craftH3Element);
		const listElement = document.createElement("ul");
		selectedCraft.supplies.forEach((supply) => {
			const itemElement = document.createElement("li");
			itemElement.innerHTML = supply;
			listElement.appendChild(itemElement);
		});
		textDivElement.append(listElement);
		flexDivElement.append(imgDivElement);
		flexDivElement.append(textDivElement);
		modalDivElement.append(flexDivElement);
		overlayElement.classList.remove("hidden");
		modalDivElement.classList.remove("hidden");
	};
	return craftImageElement;
};

const displayCrafts = async () => {
	const craftsJSON = await retrieveCrafts();
	const craftDivElement = document.getElementById("crafts");
	craftDivElement.innerHTML = "";
	if (craftsJSON == "") {
		craftDivElement.innerHTML = "no crafts here";
		return;
	}
	let count = 0;
	let columnElement = document.createElement("div");
	columnElement.classList.add("column");
	craftsJSON.forEach((craft) => {
		columnElement.append(retrieveCraft(craft));
		count++;
		if (count > 6) {
			craftDivElement.append(columnElement);
			columnElement = document.createElement("div");
			columnElement.classList.add("column");
			count = 0;
		}
	});
	craftDivElement.append(columnElement);
};

const changeImagePreview = (event) => {
	const previewElement = document.getElementById("preview");
	if (!event.target.files.length) {
		previewElement.src = "https://place-hold.it/200x300";
		return;
	}
	previewElement.src = URL.createObjectURL(event.target.files.item(0));
};

const addSupplyInput = (event) => {
    event.preventDefault();
    const suppliesListElement = document.getElementById("supplies-list");
    const supplyInputElement = document.createElement("input");
    supplyInputElement.type = "text";
    supplyInputElement.classList.add("supply-input"); 
    suppliesListElement.appendChild(supplyInputElement);
};

const resetCraftForm = () => {
    document.getElementById("craft-form").reset();
    document.getElementById("supplies-list").innerHTML = "";
    document.getElementById("preview").src = "https://place-hold.it/200x300";
};

const openAddCraftModal = () => {
    resetCraftForm();
    const overlayElement = document.getElementById("craft-add-overlay");
    const modalDivElement = document.getElementById("add-craft-modal");
    overlayElement.classList.remove("hidden");
    modalDivElement.classList.remove("hidden");
};

const closeAddCraftModal = () => {
    const overlayElement = document.getElementById("craft-add-overlay");
    const modalDivElement = document.getElementById("add-craft-modal");
    overlayElement.classList.add("hidden");
    modalDivElement.classList.add("hidden");
    resetCraftForm();
};

const getSuppliesList = () => {
    const suppliesInputElements = document.querySelectorAll("#supplies-list input");
    const supplies = [];
    suppliesInputElements.forEach((supply) => {
        supplies.push(supply.value);
    });
    return supplies;
};

const submitCraftForm = async (event) => {
    event.preventDefault();
    const formElement = document.getElementById("craft-form");
    const formData = new FormData(formElement);
    formData.append("supplies", getSuppliesList().join(","));
    const response = await fetch("/api/crafts", {
        method: "POST",
        body: formData
    });
    const result = await response.json();
    if (result.error) {
        console.log(result.error);
        return;
    }
    closeAddCraftModal();
    displayCrafts();
};


displayCrafts();
document.getElementById("addCraft").onclick = openAddCraftModal;
document.getElementById("craft-form").onsubmit = submitCraftForm;
document.getElementById("add-supply").onclick = addSupplyInput;
document.getElementById("image").onchange = changeImagePreview;
document.getElementById("cancel").onclick = closeAddCraftModal;
