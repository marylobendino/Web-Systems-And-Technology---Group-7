document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const buzzContainer = document.getElementById("buzzContainer");
    const noResults = document.getElementById("noResults");
    const resetSearch = document.getElementById("resetSearch");
    const buzzCards = buzzContainer.querySelectorAll(".buzz-card");
    const buzzTypeFilters = document.querySelectorAll('input[name="buzzType"]');
    const categoryFilters = document.querySelectorAll('input[name="category"]');
    const clearFilters = document.getElementById("clearFilters");
    const buzzHeading = document.querySelector(".feed-header h3");

    const categoryNames = {
        food: "Food & Beverages",
        grocery: "Grocery",
        school: "School Supplies",
        fashion: "Fashion",
        electronics: "Electronics",
        household: "Home & Living"
    };

    /* Filter Buzzes */
    function filterBuzzes() {
        const typeValue = document.querySelector('input[name="buzzType"]:checked')?.value || "all";
        const categoryValue = document.querySelector('input[name="category"]:checked')?.value || "all";
        const searchTerm = searchInput.value.toLowerCase().trim();
        let matchingCards = 0;

        buzzHeading.textContent = categoryValue === "all" ? "Latest Buzzes" : `${categoryNames[categoryValue]} Buzzes`;

        buzzCards.forEach(function (card) {
            const typeMatches = typeValue === "all" || card.dataset.type === typeValue;
            const categoryMatches = categoryValue === "all" || card.dataset.category === categoryValue;
            const searchMatches = !searchTerm || card.textContent.toLowerCase().includes(searchTerm);
            const visible = typeMatches && categoryMatches && searchMatches;

            card.style.display = visible ? "" : "none";
            if (visible) matchingCards++;
        });

        noResults.hidden = matchingCards > 0;
    }

    /* Reset Filters */
    function resetFilters() {
        document.querySelector('input[name="buzzType"][value="all"]').checked = true;
        categoryFilters.forEach(function (filter) {
            filter.checked = false;
        });
        searchInput.value = "";
        filterBuzzes();
    }

    searchInput.addEventListener("input", filterBuzzes);

    buzzTypeFilters.forEach(function (filter) {
        filter.addEventListener("change", filterBuzzes);
    });

    categoryFilters.forEach(function (filter) {
        filter.addEventListener("change", filterBuzzes);
    });

    clearFilters.addEventListener("click", resetFilters);
    resetSearch.addEventListener("click", resetFilters);

    /* Useful Buttons */
    document.querySelectorAll(".useful-button").forEach(function (button) {
        button.addEventListener("click", function () {
            const count = button.querySelector("span");
            const active = button.getAttribute("aria-pressed") === "true";
            const value = Number(count.textContent) + (active ? -1 : 1);

            button.setAttribute("aria-pressed", String(!active));
            button.innerHTML = `${active ? "♡" : "♥"} Useful <span>${value}</span>`;
        });
    });

    /* Save Buttons */
    document.querySelectorAll(".save-button").forEach(function (button) {
        button.addEventListener("click", function () {
            const saved = button.classList.toggle("saved");
            button.setAttribute("aria-pressed", String(saved));
            button.textContent = saved ? "Saved" : "Save";
        });
    });

    /* Create Buzz Modal */
    const createBuzzButtons = document.querySelectorAll(".create-buzz-trigger");
    const createBuzzModal = document.getElementById("createBuzzModal");
    const closeBuzzModal = document.getElementById("closeBuzzModal");
    const cancelBuzzButton = document.getElementById("cancelBuzzButton");
    const createBuzzForm = document.getElementById("createBuzzForm");

    createBuzzButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            createBuzzModal.hidden = false;
            document.body.style.overflow = "hidden";
        });
    });

    function closeModal() {
        createBuzzModal.hidden = true;
        document.body.style.overflow = "";
    }

    closeBuzzModal.addEventListener("click", closeModal);
    cancelBuzzButton.addEventListener("click", closeModal);

    createBuzzModal.addEventListener("click", function (event) {
        if (event.target === createBuzzModal) closeModal();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !createBuzzModal.hidden) closeModal();
    });

    createBuzzForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const buzzData = {
            type: document.getElementById("buzzType").value,
            category: document.getElementById("buzzCategory").value,
            store: document.getElementById("buzzStore").value.trim(),
            product: document.getElementById("buzzProduct").value.trim(),
            title: document.getElementById("buzzTitle").value.trim(),
            description: document.getElementById("buzzDescription").value.trim(),
            price: document.getElementById("buzzPrice").value,
            location: document.getElementById("buzzLocation").value.trim()
        };

        console.log("New Buzz:", buzzData);
        alert("Buzz created successfully!");
        createBuzzForm.reset();
        closeModal();
    });

    filterBuzzes();
});