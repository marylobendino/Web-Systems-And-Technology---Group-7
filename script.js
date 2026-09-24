// ========================================
// KUMARITES JS
// ========================================

document.addEventListener("DOMContentLoaded", function () {

// ========================================
// SEARCH BAR
// ========================================

const searchInput = document.getElementById("searchInput");
const buzzCards = document.querySelectorAll(".buzz-card");
const storeItems = document.querySelectorAll(".store-item");

searchInput.addEventListener("input", function () {

    const searchTerm = searchInput.value.toLowerCase().trim();

    // If search box is empty, show EVERYTHING
    if (searchTerm === "") {

        buzzCards.forEach(function (card) {
            card.style.display = "";
        });

        storeItems.forEach(function (store) {
            store.style.display = "";
        });

        return;
    }

    // Search Buzz Cards
    buzzCards.forEach(function (card) {

        const cardText = card.textContent.toLowerCase();

        if (cardText.includes(searchTerm)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });


    // Search Store Items
    storeItems.forEach(function (store) {

        const storeText = store.textContent.toLowerCase();

        if (storeText.includes(searchTerm)) {
            store.style.display = "";
        } else {
            store.style.display = "none";
        }
    });
});

// ========================================
// HEART BUTTON
// ========================================

const heartButtons = document.querySelectorAll(".heart-button");

heartButtons.forEach(function (button) {

    button.style.cursor = "pointer";

    button.addEventListener("click", function () {

        // Get the current text
        const currentText = button.textContent;

        // Extract the number from the text
        const match = currentText.match(/\d+/);

        if (!match) {
            return;
        }

        let likes = parseInt(match[0]);

        // Check if the post is already hearted
        if (button.classList.contains("heart")) {

            // Remove heart
            likes--;

            button.textContent = "❤︎ " + likes;
            button.classList.remove("heart");

        } else {

            // Add heart
            likes++;

            button.textContent = "❤︎ " + likes;
            button.classList.add("heart");
        }
    });
});

// ========================================
// SAVE BUTTON
// ========================================

const saveButtons = document.querySelectorAll(".save-button");

saveButtons.forEach(function (button) {

    button.style.cursor = "pointer";

    button.addEventListener("click", function () {

        if (button.classList.contains("saved")) {

            // Unsave
            button.textContent = "⛉";
            button.classList.remove("saved");

        } else {

            // Save
            button.textContent = "⛊";
            button.classList.add("saved");
        }
    });
});

// ========================================
// EXPLORE BUZZES BUTTON
// ========================================

    const exploreButton = document.querySelector(".explore-button");

    exploreButton.addEventListener("click", function (event) {

        event.preventDefault();

        const buzzesSection = document.querySelector(".latest-buzzes");

        buzzesSection.scrollIntoView({
            behavior: "smooth"
        });
    });


// ========================================
// BROWSE STORES BUTTON
// ========================================

    const browseButton = document.querySelector(".browse-button");

    browseButton.addEventListener("click", function (event) {

        event.preventDefault();

        const storesSection = document.querySelector(".trending-stores");

        storesSection.scrollIntoView({
            behavior: "smooth"
        });
    });

    // ========================================
    // CONSOLE MESSAGE
    // ========================================

    console.log("Kumarites JavaScript loaded successfully!");
});