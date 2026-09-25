/* =====================================================
   KUMARITES - CATEGORIES PAGE JAVASCRIPT
   ===================================================== */


/* =====================================================
   CATEGORY SEARCH
   ===================================================== */

const categorySearch =
    document.getElementById("categorySearch");

const categoryCards =
    document.querySelectorAll(".category-card");

const noCategoryResult =
    document.getElementById("noCategoryResult");


function filterCategories() {

    const searchValue =
        categorySearch.value
            .toLowerCase()
            .trim();

    let visibleCategories = 0;


    categoryCards.forEach(function (card) {

        const categoryKeywords =
            card.dataset.category.toLowerCase();

        const categoryName =
            card.textContent
                .toLowerCase()
                .trim();


        const matchesSearch =
            categoryKeywords.includes(searchValue) ||
            categoryName.includes(searchValue);


        if (matchesSearch) {

            card.style.display = "";
            visibleCategories++;

        } else {

            card.style.display = "none";

        }

    });


    if (visibleCategories === 0) {

        noCategoryResult.style.display = "block";

    } else {

        noCategoryResult.style.display = "none";

    }

}


if (categorySearch) {

    categorySearch.addEventListener(
        "input",
        filterCategories
    );

}



/* =====================================================
   FEATURED CATEGORY BUTTONS
   ===================================================== */

const featuredLinks =
    document.querySelectorAll(".featured-link");

const exploreCategories =
    document.getElementById("exploreCategories");


featuredLinks.forEach(function (link) {

    link.addEventListener(
        "click",
        function () {

            const selectedCategory =
                link.dataset.featuredCategory;


            categorySearch.value =
                selectedCategory;


            filterCategories();


            exploreCategories.scrollIntoView({

                behavior: "smooth",
                block: "start"

            });


            setTimeout(function () {

                categorySearch.focus();

            }, 500);

        }
    );

});



/* =====================================================
   CREATE A BUZZ MESSAGE
   ===================================================== */

const createBuzzButton =
    document.getElementById("createBuzzButton");

const categoryToast =
    document.getElementById("categoryToast");


if (createBuzzButton && categoryToast) {

    createBuzzButton.addEventListener(
        "click",
        function () {

            categoryToast.classList.add("show");


            setTimeout(function () {

                categoryToast.classList.remove("show");

            }, 2800);

        }
    );

}



/* =====================================================
   OPTIONAL ESC KEY TO CLEAR CATEGORY SEARCH
   ===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape" && categorySearch) {

            categorySearch.value = "";

            filterCategories();

            categorySearch.blur();

        }

    }
);