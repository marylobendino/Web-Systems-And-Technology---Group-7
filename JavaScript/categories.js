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
        description: "Discover grocery finds, essentials, deals, and price updates shared by the Kumarites community."
    },
    food: {
        name: "Food & Beverages",
        description: "Find food spots, affordable meals, drinks, and sulit dining recommendations."
    },
    fashion: {
        name: "Fashion",
        description: "Explore clothing, accessories, and fashion finds shared by the community."
    },
    electronics: {
        name: "Electronics",
        description: "Discover gadgets, devices, accessories, and technology deals."
    },
    "school-supplies": {
        name: "School Supplies",
        description: "Find affordable school supplies, stationery, notebooks, and student essentials."
    },
    "home-living": {
        name: "Home & Living",
        description: "Explore household products, home essentials, and useful living finds."
    },
    services: {
        name: "Services",
        description: "Discover useful services, recommendations, repairs, and community finds."
    }
};

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

function showCategoryResults(categoryId) {
    const category = categoryData[categoryId];

    if (!category || !categoryResults) {
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

    if (categoryResultsGrid) {
        categoryResultsGrid.innerHTML = `
            <article class="category-result-card">
                <div class="category-result-image"></div>
                <div class="category-result-content">
                    <span class="category-result-tag">
                        ${category.name.toUpperCase()}
                    </span>
                    <h4>Community Find</h4>
                    <p>
                        Placeholder for a community Buzz
                        from this category.
                    </p>
                </div>
            </article>

            <article class="category-result-card">
                <div class="category-result-image"></div>
                <div class="category-result-content">
                    <span class="category-result-tag">
                        ${category.name.toUpperCase()}
                    </span>
                    <h4>Sulit Deal</h4>
                    <p>
                        Placeholder for a deal or
                        price update in this category.
                    </p>
                </div>
            </article>

            <article class="category-result-card">
                <div class="category-result-image"></div>
                <div class="category-result-content">
                    <span class="category-result-tag">
                        ${category.name.toUpperCase()}
                    </span>
                    <h4>Community Recommendation</h4>
                    <p>
                        Placeholder for a Kumarites
                        recommendation.
                    </p>
                </div>
            </article>
        `;
    }

    categoryResults.hidden = false;

    categoryResults.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

if (categorySearch) {
    categorySearch.addEventListener(
        "input",
        filterCategories
    );
}

categoryCards.forEach(function (card) {
    card.addEventListener(
        "click",
        function () {
            const categoryId =
                card.dataset.categoryKey ||
                card.dataset.category;

            if (categoryId) {
                showCategoryResults(
                    categoryId
                );
            }
        }
    );
});

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
                selectedCategory;

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

document.addEventListener(
    "keydown",
    function (event) {
        if (
            event.key === "Escape" &&
            categorySearch
        ) {
            categorySearch.value = "";
            filterCategories();
            categorySearch.blur();

            if (categoryResults) {
                categoryResults.hidden = true;
            }
        }
    }
);

document.addEventListener(
    "kumarites:buzz-created",
    function () {
        filterCategories();
    }
);

filterCategories();