const categorySearch = document.getElementById("categorySearch");
const categoryCards = document.querySelectorAll(".category-card");
const noCategoryResult = document.getElementById("noCategoryResult");
const featuredLinks = document.querySelectorAll(".featured-link");
const exploreCategories = document.getElementById("exploreCategories");

const categoryResults = document.getElementById("categoryResults");
const categoryResultsTitle = document.getElementById("categoryResultsTitle");
const categoryResultsDescription = document.getElementById("categoryResultsDescription");
const categoryResultsGrid = document.getElementById("categoryResultsGrid");
const closeCategoryResults = document.getElementById("closeCategoryResults");

const categoryData = {
    grocery: {
        name: "Grocery",
        description:
            "Discover grocery finds, essentials, deals, and price updates shared by the Kumarites community."
    },

    food: {
        name: "Food & Beverages",
        description:
            "Find food spots, affordable meals, drinks, and sulit dining recommendations."
    },

    fashion: {
        name: "Fashion",
        description:
            "Explore clothing, accessories, and fashion finds shared by the community."
    },

    electronics: {
        name: "Electronics",
        description:
            "Discover gadgets, devices, accessories, and technology deals."
    },

    "school-supplies": {
        name: "School Supplies",
        description:
            "Find affordable school supplies, stationery, notebooks, and student essentials."
    },

    "home-living": {
        name: "Home & Living",
        description:
            "Explore household products, home essentials, and useful living finds."
    },

    services: {
        name: "Services",
        description:
            "Discover useful services, recommendations, repairs, and community finds."
    }
};


/* =========================================================
   CATEGORY SEARCH
   ========================================================= */

function filterCategories() {
    if (!categorySearch) {
        return;
    }

    const searchValue =
        categorySearch.value.toLowerCase().trim();

    let visibleCategories = 0;

    categoryCards.forEach(function (card) {
        const categoryKeywords =
            (card.dataset.category || "").toLowerCase();

        const categoryName =
            card.textContent.toLowerCase().trim();

        const matchesSearch =
            categoryKeywords.includes(searchValue) ||
            categoryName.includes(searchValue);

        card.style.display =
            matchesSearch ? "" : "none";

        if (matchesSearch) {
            visibleCategories++;
        }
    });

    if (noCategoryResult) {
        noCategoryResult.style.display =
            visibleCategories === 0 ? "block" : "none";
    }
}


/* =========================================================
   LOAD CATEGORY BUZZES
   ========================================================= */

async function showCategoryResults(categoryId) {
    const category = categoryData[categoryId];

    if (
        !category ||
        !categoryResults ||
        !categoryResultsGrid
    ) {
        return;
    }

    if (categoryResultsTitle) {
        categoryResultsTitle.textContent =
            category.name;
    }

    if (categoryResultsDescription) {
        categoryResultsDescription.textContent =
            category.description;
    }

    categoryResultsGrid.innerHTML = "";

    try {
        const buzzes = await getBuzzes();

        const categoryBuzzes =
            buzzes.filter(function (buzz) {
                return (
                    String(buzz.category || "")
                        .trim()
                        .toLowerCase() ===
                    categoryId.toLowerCase()
                );
            });

        if (categoryBuzzes.length === 0) {
            const emptyMessage =
                document.createElement("p");

            emptyMessage.className =
                "no-buzz-results";

            emptyMessage.textContent =
                "No Buzzes found in this category.";

            categoryResultsGrid.appendChild(
                emptyMessage
            );
        } else {
            const hydratedBuzzes =
                await hydrateBuzzImages(
                    categoryBuzzes
                );

            for (const buzz of hydratedBuzzes) {
                const card =
                    await createBuzzCard(buzz);

                categoryResultsGrid.appendChild(
                    card
                );
            }
        }

        categoryResults.hidden = false;

        categoryResults.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {
        console.error(
            "Unable to load category Buzzes:",
            error
        );

        categoryResultsGrid.innerHTML = "";

        const errorMessage =
            document.createElement("p");

        errorMessage.className =
            "no-buzz-results";

        errorMessage.textContent =
            "Unable to load Buzzes.";

        categoryResultsGrid.appendChild(
            errorMessage
        );

        categoryResults.hidden = false;
    }
}


/* =========================================================
   CATEGORY CARD CLICK
   ========================================================= */

categoryCards.forEach(function (card) {
    card.addEventListener(
        "click",
        function () {
            const categoryId =
                card.dataset.categoryKey ||
                card.dataset.category;

            if (!categoryId) {
                return;
            }

            /*
             * data-category contains search keywords such as:
             * "grocery supermarket essentials"
             *
             * data-category-key contains the actual
             * category ID such as:
             * "grocery"
             *
             * Use category-key whenever available.
             */
            const normalizedCategoryId =
                card.dataset.categoryKey ||
                categoryId;

            showCategoryResults(
                normalizedCategoryId
            );
        }
    );
});


/* =========================================================
   FEATURED CATEGORY LINKS
   ========================================================= */

featuredLinks.forEach(function (link) {
    link.addEventListener(
        "click",
        function (event) {
            event.preventDefault();

            const selectedCategory =
                link.dataset.featuredCategory;

            if (!categorySearch) {
                return;
            }

            categorySearch.value =
                selectedCategory || "";

            filterCategories();

            if (exploreCategories) {
                exploreCategories.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            setTimeout(function () {
                categorySearch.focus();
            }, 500);
        }
    );
});


/* =========================================================
   CLOSE CATEGORY RESULTS
   ========================================================= */

if (closeCategoryResults) {
    closeCategoryResults.addEventListener(
        "click",
        function () {
            if (categoryResults) {
                categoryResults.hidden = true;
            }
        }
    );
}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {
        if (event.key !== "Escape") {
            return;
        }

        if (categorySearch) {
            categorySearch.value = "";
            filterCategories();
            categorySearch.blur();
        }

        if (categoryResults) {
            categoryResults.hidden = true;
        }
    }
);


/* =========================================================
   NEW BUZZ
   ========================================================= */

document.addEventListener(
    "kumarites:buzz-created",
    function () {
        filterCategories();
    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

filterCategories();