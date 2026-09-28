document.addEventListener("DOMContentLoaded", function() {
    const shareButton = document.getElementById("shareStoreButton");
    const shareModal = document.getElementById("shareModal");
    const shareLinkInput = document.getElementById("shareLinkInput");
    const copyShareLinkButton = document.getElementById("copyShareLinkButton");
    const shareCopyStatus = document.getElementById("shareCopyStatus");
    const buzzSearch = document.querySelector(".search-sort input");
    const sortSelect = document.querySelector(".search-sort select");
    const buzzList = document.querySelector(".buzz-list-items");
    const navigationSearch = document.getElementById("searchInput");
    const tabButtons = document.querySelectorAll(".tab-button");

    let storeBuzzes = [];
    const currentStore = "SM Mall of Asia";

    /* Share Store */

    function closeShareModal() {
        if (!shareModal) {
            return;
        }

        shareModal.classList.add("hidden");
        shareModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    }

    if (shareButton) {
        shareButton.addEventListener("click", function() {
            if (!shareModal) {
                return;
            }

            if (shareLinkInput) {
                shareLinkInput.value = window.location.href;
            }

            if (shareCopyStatus) {
                shareCopyStatus.textContent = "";
            }

            shareModal.classList.remove("hidden");
            shareModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
        });
    }

    document.querySelectorAll("[data-close-share-modal]").forEach(function(element) {
        element.addEventListener("click", closeShareModal);
    });

    if (copyShareLinkButton) {
        copyShareLinkButton.addEventListener("click", async function() {
            if (!shareLinkInput) {
                return;
            }

            try {
                await navigator.clipboard.writeText(
                    shareLinkInput.value
                );

                if (shareCopyStatus) {
                    shareCopyStatus.textContent = "Link copied";
                }

            } catch (error) {
                shareLinkInput.select();

                if (shareCopyStatus) {
                    shareCopyStatus.textContent = "Select and copy the link manually.";
                }
            }
        });
    }

    /* Social Sharing */

    document.querySelectorAll("[data-share-network]").forEach(function(link) {
        link.addEventListener("click", function() {
            const encodedUrl = encodeURIComponent(
                    window.location.href
                );

            const encodedText = encodeURIComponent(
                    "Check out this Kumarites store page."
                );

            const network = link.dataset.shareNetwork;

            const networkUrls = {
                facebook:
                    `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,

                x:
                    `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,

                whatsapp:
                    `https://wa.me/?text=${encodedText}%20${encodedUrl}`,

                telegram:
                    `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,

                linkedin:
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
            };

            if (networkUrls[network]) {
                link.href = networkUrls[network];
            }
        });
    });

    /* Load Store Buzzes */

    async function loadStoreBuzzes() {
        try {
            const buzzes = await getBuzzes();

            storeBuzzes = await hydrateBuzzImages(
                    buzzes
                );

            await updateBuzzes();

        } catch (error) {
            console.error(
                "Unable to load store Buzzes:",
                error
            );

            showEmptyState(
                "Unable to load Buzzes."
            );
        }
    }

    /* Filter Buzzes */

    function getFilteredBuzzes() {
        const activeTab = document.querySelector(
                ".tab-button.active"
            );

        const selectedCategory = activeTab?.dataset.category ||
            "latest";

        const searchTerm = buzzSearch?.value
                .trim()
                .toLowerCase() ||
            "";

        let filteredBuzzes = [...storeBuzzes];

        if (selectedCategory !== "latest") {
            filteredBuzzes = filteredBuzzes.filter(
                    function(buzz) {
                        return (
                            buzz.type?.toLowerCase() === selectedCategory.toLowerCase()
                        );
                    }
                );
        }

        /* Search */
        if (searchTerm) {
            filteredBuzzes = filteredBuzzes.filter(function(buzz) {
                return matchesBuzzSearch(buzz, searchTerm);
            });
        }

        const selectedSort = sortSelect?.value ||
            "Latest";

        if (selectedSort === "Oldest") {

            filteredBuzzes.sort(
                function(a, b) {
                    return (
                        new Date(a.createdAt) -
                        new Date(b.createdAt)
                    );
                }
            );

        } else if (
            selectedSort === "Most Popular"
        ) {

            filteredBuzzes.sort(
                function(a, b) {
                    return (
                        (b.usefulCount || 0) -
                        (a.usefulCount || 0)
                    );
                }
            );

        } else {

            filteredBuzzes.sort(
                function(a, b) {
                    return (
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                    );
                }
            );
        }

        return filteredBuzzes;
    }

    /* Update Buzzes */

    async function updateBuzzes() {
        if (!buzzList) {
            return;
        }

        const filteredBuzzes = getFilteredBuzzes();

        await renderStoreBuzzes(
            filteredBuzzes
        );
    }

    /* Render Buzzes */

    async function renderStoreBuzzes(buzzes) {
        buzzList.innerHTML = "";

        if (
            !buzzes ||
            buzzes.length === 0
        ) {
            showEmptyState(
                "No Buzzes found."
            );

            return;
        }

        for (const buzz of buzzes) {
            const card = await createBuzzCard(
                    buzz
                );

            buzzList.appendChild(
                card
            );
        }
    }

    /* Empty State */

    function showEmptyState(message) {
        if (!buzzList) {
            return;
        }

        buzzList.innerHTML = "";

        const empty = document.createElement("p");

        empty.className = "no-buzz-results";

        empty.textContent = message;

        buzzList.appendChild(
            empty
        );
    }

    /* Navigation Search */

    if (navigationSearch) {
        navigationSearch.addEventListener(
            "input",
            function() {

                if (buzzSearch) {
                    buzzSearch.value = navigationSearch.value;
                }

                updateBuzzes();
            }
        );
    }

    /* Store Search */

    if (buzzSearch) {
        buzzSearch.addEventListener(
            "input",
            function() {
                updateBuzzes();
            }
        );
    }

    /* Category Tabs */

    tabButtons.forEach(function(button) {
        button.addEventListener(
            "click",
            function() {

                tabButtons.forEach(
                    function(tab) {
                        tab.classList.remove(
                            "active"
                        );

                        tab.setAttribute(
                            "aria-selected",
                            "false"
                        );
                    }
                );

                button.classList.add(
                    "active"
                );

                button.setAttribute(
                    "aria-selected",
                    "true"
                );

                updateBuzzes();
            }
        );
    });

    /* Sorting */

    if (sortSelect) {
        sortSelect.addEventListener(
            "change",
            function() {
                updateBuzzes();
            }
        );
    }

    /* New Buzz */

    document.addEventListener(
        "kumarites:buzz-created",
        async function(event) {

            const newBuzz = event.detail;

            if (!newBuzz) {
                return;
            }

            storeBuzzes = [
                newBuzz,

                ...storeBuzzes.filter(
                    function(buzz) {
                        return (
                            buzz.id !== newBuzz.id
                        );
                    }
                )
            ];

            await updateBuzzes();
        }
    );

    /* Database Ready */

    document.addEventListener(
        "kumarites:ready",
        function() {
            loadStoreBuzzes();
        },
        {
            once: true
        }
    );
});
