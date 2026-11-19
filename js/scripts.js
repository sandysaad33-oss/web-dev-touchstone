// Array of bakery item objects (Data Structure 1)
const bakeryItems = [
  { id: "sourdough", name: "Country Sourdough", price: 9 },
  { id: "wheat", name: "Honey Wheat Loaf", price: 8 },
  { id: "focaccia", name: "Rosemary Olive Oil Focaccia", price: 8 },
  { id: "croissant", name: "Butter Croissant", price: 4 },
  { id: "bun", name: "Cinnamon Morning Bun", price: 4.5 },
  { id: "muffin", name: "Blueberry Muffin", price: 3.75 }
];

// Array to hold customer's saved pre-order items (Data Structure 2)
let preOrderList = [];

// Save pre-order array to localStorage
function savePreOrderList() {
  localStorage.setItem("northStarPreOrder", JSON.stringify(preOrderList));
}

// Load saved pre-order array from localStorage
function loadPreOrderList() {
  const savedData = localStorage.getItem("northStarPreOrder");
  if (savedData !== null) {
    preOrderList = JSON.parse(savedData);
  }
}

// Add a bakery item by its id and update the display
function addBakeryItem(itemId) {
  for (let i = 0; i < bakeryItems.length; i++) {
    if (bakeryItems[i].id === itemId) {
      preOrderList.push(bakeryItems[i]);
    }
  }
  savePreOrderList();
  renderPreOrderList();
}

// Remove all items from the saved pre-order list
function clearPreOrderList() {
  preOrderList = [];
  localStorage.removeItem("northStarPreOrder");
  renderPreOrderList();
}

// Display the saved pre-order list and total on products.html
function renderPreOrderList() {
  const listElement = document.getElementById("preorder-list");
  const statusElement = document.getElementById("preorder-status");

  if (!listElement || !statusElement) {
    return;
  }

  listElement.innerHTML = "";
  let total = 0;

  for (let i = 0; i < preOrderList.length; i++) {
    const li = document.createElement("li");
    li.textContent = preOrderList[i].name + " - $" + preOrderList[i].price.toFixed(2);
    listElement.appendChild(li);
    total = total + preOrderList[i].price;
  }

  if (preOrderList.length === 0) {
    statusElement.textContent = "Your pre-order list is empty.";
  } else {
    statusElement.textContent = "Saved items: " + preOrderList.length + " (Estimated total: $" + total.toFixed(2) + ")";
  }
}

// Set up click listeners for the "Add to Pre-Order List" buttons on products.html
function setupProductButtons() {
  const addButtons = document.querySelectorAll(".add-item-btn");
  const clearButton = document.getElementById("clear-list-btn");

  for (let i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener("click", function() {
      const itemId = addButtons[i].dataset.item;
      addBakeryItem(itemId);
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", function() {
      clearPreOrderList();
    });
  }
}

// Pre-fill the Item Details textarea on contact.html from localStorage
function prefillContactForm() {
  const itemDetailsField = document.getElementById("itemDetails");
  const storageNote = document.getElementById("storage-note");

  if (!itemDetailsField) {
    return;
  }

  if (preOrderList.length > 0 && itemDetailsField.value.trim() === "") {
    let summary = "";
    for (let i = 0; i < preOrderList.length; i++) {
      summary = summary + preOrderList[i].name + " ($" + preOrderList[i].price.toFixed(2) + ")";
      if (i < preOrderList.length - 1) {
        summary = summary + ", ";
      }
    }
    itemDetailsField.value = "Pre-order items: " + summary;

    if (storageNote) {
      storageNote.textContent = "Your saved items from the Products page were loaded automatically.";
    }
  }
}

// Helper function to show an error message near a form field
function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorSpan = document.getElementById(inputId + "-error");

  if (input) {
    input.classList.add("input-error");
  }
  if (errorSpan) {
    errorSpan.textContent = message;
  }
}

// Helper function to clear an error message
function clearError(inputId) {
  const input = document.getElementById(inputId);
  const errorSpan = document.getElementById(inputId + "-error");

  if (input) {
    input.classList.remove("input-error");
  }
  if (errorSpan) {
    errorSpan.textContent = "";
  }
}

// Validate all fields on contact.html
function validateContactForm() {
  clearError("customerName");
  clearError("customerEmail");
  clearError("pickupDate");
  clearError("requestType");
  clearError("itemDetails");

  let isValid = true;

  const nameValue = document.getElementById("customerName").value.trim();
  const emailValue = document.getElementById("customerEmail").value.trim();
  const dateValue = document.getElementById("pickupDate").value;
  const selectedType = document.querySelector('input[name="requestType"]:checked');
  const detailsValue = document.getElementById("itemDetails").value.trim();

  if (nameValue === "") {
    showError("customerName", "Please enter your full name.");
    isValid = false;
  } else if (nameValue.length < 2) {
    showError("customerName", "Name must be at least 2 characters.");
    isValid = false;
  }

  if (emailValue === "") {
    showError("customerEmail", "Please enter your email address.");
    isValid = false;
  } else if (!emailValue.includes("@") || !emailValue.includes(".")) {
    showError("customerEmail", "Please enter a valid email address (example@email.com).");
    isValid = false;
  }

  if (dateValue === "") {
    showError("pickupDate", "Please select a pickup date.");
    isValid = false;
  }

  if (!selectedType) {
    showError("requestType", "Please choose Pre-Order Request or General Question.");
    isValid = false;
  }

  if (detailsValue === "") {
    showError("itemDetails", "Please enter your item details or question.");
    isValid = false;
  } else if (detailsValue.length < 5) {
    showError("itemDetails", "Please enter at least 5 characters.");
    isValid = false;
  }

  return isValid;
}

// Set up submit and real-time input listeners on contact.html
function setupContactForm() {
  const form = document.getElementById("bakery-form");
  const formStatus = document.getElementById("form-status");

  if (!form) {
    return;
  }

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    if (validateContactForm()) {
      if (formStatus) {
        formStatus.textContent = "Thank you! Your bakery request has been validated and sent.";
      }
      localStorage.removeItem("northStarPreOrder");
      form.reset();
    } else {
      if (formStatus) {
        formStatus.textContent = "";
      }
    }
  });

  // Clear field errors as the user types or changes input
  document.getElementById("customerName").addEventListener("input", function() {
    clearError("customerName");
  });
  document.getElementById("customerEmail").addEventListener("input", function() {
    clearError("customerEmail");
  });
  document.getElementById("pickupDate").addEventListener("change", function() {
    clearError("pickupDate");
  });
  document.getElementById("itemDetails").addEventListener("input", function() {
    clearError("itemDetails");
  });
}

// Run setup functions when the page loads
loadPreOrderList();
setupProductButtons();
renderPreOrderList();
prefillContactForm();
setupContactForm();