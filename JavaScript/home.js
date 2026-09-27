document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const buzzContainer = document.getElementById("buzzContainer");
    const storeItems = document.querySelectorAll(".store-item");
    const exploreButton = document.querySelector(".explore-button");
    const browseButton = document.querySelector(".browse-button");
    const categoryCards = document.querySelectorAll(".categories-content .category-card");
    let allBuzzes = [];

    /* Load Buzzes */
    async function loadLatestBuzzes() {
        try {
            const buzzes = await getBuzzes();
            allBuzzes = await hydrateBuzzImages(buzzes);
            KUMARITES_DATA.buzzes = allBuzzes;
            await renderLatestBuzzes(allBuzzes);
        } catch (error) {
            console.error("Unable to load Buzzes:", error);

            if (buzzContainer) {
                buzzContainer.innerHTML = `
                    <p class="no-buzz-results">
                        Unable to load Buzzes.
                    </p>
                `;
            }
        }
    }

    /* Render Buzzes */
    async function renderLatestBuzzes(buzzes = allBuzzes) {
        if (!buzzContainer) {
            return;
        }

        buzzContainer.innerHTML = "";

        const latestBuzzes = [...buzzes].sort(function(a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        if (latestBuzzes.length === 0) {
            const empty = document.createElement("p");
            empty.className = "no-buzz-results";
            empty.textContent = "No Buzzes found.";
            buzzContainer.appendChild(empty);
            return;
        }

        for (const buzz of latestBuzzes) {
            const card = await createBuzzCard(buzz);
            buzzContainer.appendChild(card);
        }
    }

    /* Category Filtering */
    async function showCategoryBuzzes(category) {
        if (!category || category === "all") {
            await renderLatestBuzzes(allBuzzes);
        } else {
            const categoryBuzzes = allBuzzes
                .filter(function(buzz) {
                    return buzz.category === category;
                })
                .sort(function(a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

            await renderLatestBuzzes(categoryBuzzes);
        }

        const buzzSection = document.querySelector(".latest-buzzes");

        if (buzzSection) {
            buzzSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    /* Category Cards */
    categoryCards.forEach(function(card) {
        card.addEventListener("click", function(event) {
            event.preventDefault();

            const category = card.dataset.category;

            categoryCards.forEach(function(item) {
                item.classList.remove("active");
            });

            card.classList.add("active");
            showCategoryBuzzes(category);
        });
    });

    /* Global Search */
    function searchContent() {
        if (!searchInput) {
            return;
        }

        const searchTerm = searchInput.value.toLowerCase().trim();

        if (!searchTerm) {
            renderLatestBuzzes(allBuzzes);
            showAllStores();
            return;
        }

        const matchingBuzzes = allBuzzes.filter(function(buzz) {
            const buzzText = [
                buzz.type,
                buzz.category,
                buzz.store,
                buzz.product,
                buzz.title,
                buzz.description,
                buzz.location,
                buzz.author
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return buzzText.includes(searchTerm);
        });

        renderLatestBuzzes(matchingBuzzes);

        storeItems.forEach(function(store) {
            const storeText = store.textContent.toLowerCase();

            store.style.display = storeText.includes(searchTerm)
                ? ""
                : "none";
        });
    }

    function showAllStores() {
        storeItems.forEach(function(store) {
            store.style.display = "";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", searchContent);
    }

    /* Explore Buzzes */
    if (exploreButton) {
        exploreButton.addEventListener("click", function(event) {
            event.preventDefault();

            const buzzesSection = document.querySelector(".latest-buzzes");

            if (buzzesSection) {
                buzzesSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    }

    /* Browse Stores */
    if (browseButton) {
        browseButton.addEventListener("click", function(event) {
            event.preventDefault();

            const storesSection = document.querySelector(".trending-stores");

            if (storesSection) {
                storesSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    }

    /* New Buzz */
    document.addEventListener("kumarites:buzz-created", async function(event) {
        const newBuzz = event.detail;

        if (!newBuzz) {
            return;
        }

        allBuzzes = [
            newBuzz,
            ...allBuzzes.filter(function(buzz) {
                return buzz.id !== newBuzz.id;
            })
        ];

        KUMARITES_DATA.buzzes = allBuzzes;
        await renderLatestBuzzes(allBuzzes);
    });

    /* Database Ready */
    document.addEventListener("kumarites:ready", function() {
        loadLatestBuzzes();
    });

    /* Database Error */
    document.addEventListener("kumarites:error", function() {
        if (buzzContainer) {
            buzzContainer.innerHTML = `
                <p class="no-buzz-results">
                    Unable to load Buzzes.
                </p>
            `;
        }
    });
});