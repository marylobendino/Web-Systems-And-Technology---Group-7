document.addEventListener("DOMContentLoaded", async function () {
    const searchInput = document.getElementById("searchInput");

    const buzzContainer = document.getElementById("buzzContainer");

    const noResults = document.getElementById("noResults");

    const resetSearch = document.getElementById("resetSearch");

    const buzzTypeFilters = document.querySelectorAll(
            'input[name="buzzType"]'
        );

    const categoryFilters = document.querySelectorAll(
            'input[name="category"]'
        );

    const clearFilters = document.getElementById("clearFilters");

    const sortBuzzes = document.getElementById("sortBuzzes");

    const feedSort = document.getElementById("feedSort");

    const buzzHeading = document.querySelector(
            ".feed-header h3"
        );

    const categoryNames = {
        food: "Food & Beverages",
        grocery: "Grocery",
        school: "School Supplies",
        "school-supplies": "School Supplies",
        fashion: "Fashion",
        electronics: "Electronics",
        household: "Home & Living",
        "home-living": "Home & Living",
        services: "Services"
    };

    let currentBuzzes = [];

    /* Load Buzzes */

    async function loadBuzzes() {
        try {
            const buzzes = await getBuzzes();

            currentBuzzes = await hydrateBuzzImages(
                    buzzes
                );

            KUMARITES_DATA.buzzes = currentBuzzes;

            await filterBuzzes();
        } catch (error) {
            console.error(
                "Unable to load Buzzes:",
                error
            );

            currentBuzzes = [];

            renderEmptyState();
        }
    }

    /* Filter Buzzes */

    async function filterBuzzes() {
        const typeValue = document.querySelector(
                'input[name="buzzType"]:checked'
            )?.value || "all";

        const categoryValue = document.querySelector(
                'input[name="category"]:checked'
            )?.value || "all";

        const searchTerm = searchInput?.value
                .toLowerCase()
                .trim() || "";

        let filteredBuzzes = [...currentBuzzes];

        if (typeValue !== "all") {
            filteredBuzzes = filteredBuzzes.filter(
                    function (buzz) {
                        return (
                            buzz.type === typeValue
                        );
                    }
                );
        }

        if (categoryValue !== "all") {
            filteredBuzzes = filteredBuzzes.filter(
                    function (buzz) {
                        return matchesCategory(
                            buzz,
                            categoryValue
                        );
                    }
                );
        }

        /* Search */
        if (searchTerm) {
            filteredBuzzes = filteredBuzzes.filter(
                    function (buzz) {
                        return matchesBuzzSearch(
                            buzz,
                            searchTerm
                        );
                    }
                );
        }

        filteredBuzzes = sortBuzzList(
                filteredBuzzes,
                getSelectedSort()
            );

        updateBuzzHeading(
            categoryValue
        );

        await renderBuzzFeed(
            filteredBuzzes
        );
    }

    /* Category Matching */

    function matchesCategory(
        buzz,
        categoryValue
    ) {
        if (
            categoryValue === "school" ||
            categoryValue === "school-supplies"
        ) {
            return (
                buzz.category === "school" ||
                buzz.category === "school-supplies"
            );
        }

        if (
            categoryValue === "household" ||
            categoryValue === "home-living"
        ) {
            return (
                buzz.category === "household" ||
                buzz.category === "home-living"
            );
        }

        return (
            buzz.category === categoryValue
        );
    }

    /* Sorting */

    function getSelectedSort() {
        if (
            sortBuzzes &&
            sortBuzzes.value
        ) {
            return sortBuzzes.value;
        }

        if (
            feedSort &&
            feedSort.value
        ) {
            return feedSort.value;
        }

        return "latest";
    }

    function sortBuzzList(
        buzzes,
        sortValue
    ) {
        const sorted = [...buzzes];

        if (sortValue === "popular") {
            sorted.sort(
                function (a, b) {
                    return (
                        Number(
                            b.usefulCount || 0
                        ) -
                        Number(
                            a.usefulCount || 0
                        )
                    );
                }
            );

            return sorted;
        }

        if (sortValue === "price-low") {
            sorted.sort(
                function (a, b) {
                    const priceA = Number(
                            a.price ?? Infinity
                        );

                    const priceB = Number(
                            b.price ?? Infinity
                        );

                    return priceA - priceB;
                }
            );

            return sorted;
        }

        if (sortValue === "price-high") {
            sorted.sort(
                function (a, b) {
                    const priceA = Number(
                            a.price ?? -Infinity
                        );

                    const priceB = Number(
                            b.price ?? -Infinity
                        );

                    return priceB - priceA;
                }
            );

            return sorted;
        }

        sorted.sort(
            function (a, b) {
                return (
                    new Date(
                        b.createdAt
                    ) -
                    new Date(
                        a.createdAt
                    )
                );
            }
        );

        return sorted;
    }

    /* Render BuzzFeed */

    async function renderBuzzFeed(
        buzzes
    ) {
        if (!buzzContainer) {
            return;
        }

        buzzContainer.innerHTML = "";

        if (
            !buzzes ||
            buzzes.length === 0
        ) {
            renderEmptyState();
            return;
        }

        if (noResults) {
            noResults.hidden = true;
        }

        for (const buzz of buzzes) {
            const card = await createBuzzCard(
                    buzz
                );

            if (card) {
                buzzContainer.appendChild(
                    card
                );
            }
        }
    }

    /* Empty State */

    function renderEmptyState() {
        if (buzzContainer) {
            buzzContainer.innerHTML = "";
        }

        if (noResults) {
            noResults.hidden = false;
        }
    }

    /* Heading */

    function updateBuzzHeading(
        categoryValue
    ) {
        if (!buzzHeading) {
            return;
        }

        if (
            categoryValue === "all"
        ) {
            buzzHeading.textContent = "Latest Buzzes";

            return;
        }

        buzzHeading.textContent = `${
                categoryNames[
                    categoryValue
                ] ||
                getCategoryName(
                    categoryValue
                )
            } Buzzes`;
    }

    /* Reset Filters */

    function resetFilters() {
        const allType = document.querySelector(
                'input[name="buzzType"][value="all"]'
            );

        if (allType) {
            allType.checked = true;
        }

        const allCategory = document.querySelector(
                'input[name="category"][value="all"]'
            );

        if (allCategory) {
            allCategory.checked = true;
        }

        categoryFilters.forEach(
            function (filter) {
                if (
                    filter.value !== "all"
                ) {
                    filter.checked = false;
                }
            }
        );

        if (searchInput) {
            searchInput.value = "";
        }

        if (sortBuzzes) {
            sortBuzzes.value = "latest";
        }

        if (feedSort) {
            feedSort.value = "latest";
        }

        filterBuzzes();
    }

    /* Search */

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            filterBuzzes
        );
    }

    /* Buzz Type */

    buzzTypeFilters.forEach(
        function (filter) {
            filter.addEventListener(
                "change",
                filterBuzzes
            );
        }
    );

    /* Category */

    categoryFilters.forEach(
        function (filter) {
            filter.addEventListener(
                "change",
                filterBuzzes
            );
        }
    );

    /* Sidebar Sort */

    if (sortBuzzes) {
        sortBuzzes.addEventListener(
            "change",
            function () {
                if (feedSort) {
                    feedSort.value = sortBuzzes.value;
                }

                filterBuzzes();
            }
        );
    }

    /* Feed Sort */

    if (feedSort) {
        feedSort.addEventListener(
            "change",
            function () {
                if (sortBuzzes) {
                    sortBuzzes.value = feedSort.value;
                }

                filterBuzzes();
            }
        );
    }

    /* Clear Filters */

    if (clearFilters) {
        clearFilters.addEventListener(
            "click",
            resetFilters
        );
    }

    if (resetSearch) {
        resetSearch.addEventListener(
            "click",
            resetFilters
        );
    }

    /* New Buzz */

    document.addEventListener(
        "kumarites:buzz-created",
        async function () {
            await loadBuzzes();
        }
    );

    /* Buzz Open */

    document.addEventListener(
        "kumarites:buzz-open",
        function (event) {
            console.log(
                "Selected Buzz:",
                event.detail
            );
        }
    );

    /* Initial Load */

    await loadBuzzes();
});