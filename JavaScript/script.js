const KUMARITES_DB_NAME = "KumaritesDB";
const KUMARITES_DB_VERSION = 1;

let kumaritesDB = null;

const KUMARITES_DATA = {
    categories: [
        { id: "grocery", name: "Grocery", icon: "🛒", keywords: "grocery supermarket essentials" },
        { id: "food", name: "Food & Beverages", icon: "🍽️", keywords: "food meals restaurant dining" },
        { id: "fashion", name: "Fashion", icon: "👗", keywords: "clothing fashion clothes apparel" },
        { id: "electronics", name: "Electronics", icon: "📱", keywords: "electronics gadgets technology devices" },
        { id: "school-supplies", name: "School Supplies", icon: "📒", keywords: "school supplies notebooks stationery" },
        { id: "home-living", name: "Home & Living", icon: "🏠", keywords: "household home living" },
        { id: "services", name: "Services", icon: "⚙️", keywords: "services service repair assistance" }
    ],
    stores: [],
    buzzes: []
};

/* Default Buzzes */

const DEFAULT_BUZZES = [
    {
        type: "sulit",
        category: "grocery",
        store: "ABC Grocery",
        product: "Rice",
        title: "Rice is cheaper here!",
        description: "Found affordable rice at ABC Grocery. Good option for budget-conscious shoppers.",
        price: "48/kg",
        location: "Cebu City",
        author: "Maria S.",
        createdAt: "2026-09-28T04:00:00+08:00",
        image: "Images/BuzzFeed Images/Cheap Rice.png",
        usefulCount: 24
    },
    {
        type: "sale",
        category: "school-supplies",
        store: "National Book Store",
        product: "School Supplies",
        title: "School supplies are on sale!",
        description: "Selected school supplies are currently available at discounted prices.",
        price: "Up to 30% OFF",
        location: "Cebu City",
        author: "Juan D.",
        createdAt: "2026-09-28T03:00:00+08:00",
        image: "Images/BuzzFeed Images/School Supplies.png",
        usefulCount: 18
    },
    {
        type: "recommendation",
        category: "food",
        store: "Local Eats",
        product: "Affordable Meals",
        title: "Affordable meals near IT Park",
        description: "Affordable meal options are available near IT Park for students and workers.",
        price: "99+",
        location: "Cebu City",
        author: "Andrea R.",
        createdAt: "2026-09-28T02:30:00+08:00",
        image: "Images/BuzzFeed Images/Food.png",
        usefulCount: 31
    },
    {
        type: "sulit",
        category: "grocery",
        store: "SM Mall of Asia",
        product: "Rice",
        title: "₱950 for 5kg Rice!",
        description: "Found a good rice deal at SM Mall of Asia.",
        price: "950",
        location: "Pasay City, Metro Manila",
        author: "Kumarite",
        createdAt: "2026-09-28T02:00:00+08:00",
        image: "Images/rice - latest buzzes.png",
        usefulCount: 0
    },
    {
        type: "sale",
        category: "fashion",
        store: "Gaisano Mall",
        product: "Shoes",
        title: "Up to 70% OFF on selected shoes!",
        description: "Selected shoes are available at discounted prices.",
        price: "Up to 70% OFF",
        location: "Cebu City",
        author: "Kumarite",
        createdAt: "2026-09-28T01:50:00+08:00",
        image: "Images/shoes - latest buzzes.png",
        usefulCount: 0
    },
    {
        type: "sulit",
        category: "school-supplies",
        store: "Power Plant Mall",
        product: "School Supplies",
        title: "Affordable school supplies here!",
        description: "Affordable school supplies are available for students.",
        price: "",
        location: "Makati City",
        author: "Kumarite",
        createdAt: "2026-09-28T01:40:00+08:00",
        image: "Images/school supplies - latest buzzes.png",
        usefulCount: 0
    },
    {
        type: "recommendation",
        category: "home-living",
        store: "SM Megamall",
        product: "Mall Visit",
        title: "Less crowd in the morning!",
        description: "Visiting SM Megamall early in the morning can help avoid larger crowds.",
        price: "",
        location: "Mandaluyong City",
        author: "Kumarite",
        createdAt: "2026-09-28T01:30:00+08:00",
        image: "Images/less crowd - latest buzzess.png",
        usefulCount: 0
    },
    {
        type: "sale",
        category: "grocery",
        store: "Watsons",
        product: "Dove Shampoo",
        title: "Buy 1 Take 1 on Dove Shampoo!",
        description: "Dove Shampoo is available under a Buy 1 Take 1 promotion.",
        price: "Buy 1 Take 1",
        location: "Cebu City",
        author: "BudgetBuddy",
        createdAt: "2026-09-28T01:20:00+08:00",
        image: "Images/Stores Images/DoveBuy1Take1.png",
        usefulCount: 24
    },
    {
        type: "sulit",
        category: "food",
        store: "Mang Inasal",
        product: "Unli Rice",
        title: "Unli Rice for ₱99 at Mang Inasal!",
        description: "Check out the affordable meal option with unli rice.",
        price: "99",
        location: "Cebu City",
        author: "FoodieCebu",
        createdAt: "2026-09-28T01:10:00+08:00",
        image: "Images/Stores Images/Mang Inasal.png",
        usefulCount: 18
    },
    {
        type: "recommendation",
        category: "school-supplies",
        store: "Miniso",
        product: "School Supplies",
        title: "Cute and affordable finds at Miniso",
        description: "Found useful and affordable school-related items at Miniso.",
        price: "",
        location: "Cebu City",
        author: "FindsPH",
        createdAt: "2026-09-28T01:00:00+08:00",
        image: "Images/Stores Images/Miniso.png",
        usefulCount: 31
    },
    {
        type: "advice",
        category: "home-living",
        store: "SM Mall of Asia",
        product: "Parking",
        title: "Go early to avoid parking hassle",
        description: "Going early can help avoid parking difficulties during busy mall hours.",
        price: "",
        location: "Pasay City, Metro Manila",
        author: "FoodieeNakss",
        createdAt: "2026-09-28T00:50:00+08:00",
        image: "Images/Stores Images/MallOfAsia.png",
        usefulCount: 12
    }
];

/* IndexedDB */

function initializeKumaritesDB() {
    return new Promise(function(resolve, reject) {
        const request = indexedDB.open(
            KUMARITES_DB_NAME,
            KUMARITES_DB_VERSION
        );

        request.onupgradeneeded = function(event) {
            const db = event.target.result;

            if (!db.objectStoreNames.contains("buzzes")) {
                const buzzStore = db.createObjectStore("buzzes", {
                    keyPath: "id",
                    autoIncrement: true
                });

                buzzStore.createIndex("type", "type", { unique: false });
                buzzStore.createIndex("category", "category", { unique: false });
                buzzStore.createIndex("store", "store", { unique: false });
                buzzStore.createIndex("createdAt", "createdAt", { unique: false });
            }

            if (!db.objectStoreNames.contains("images")) {
                db.createObjectStore("images", {
                    keyPath: "id"
                });
            }
        };

        request.onsuccess = function(event) {
            kumaritesDB = event.target.result;

            kumaritesDB.onversionchange = function() {
                kumaritesDB.close();
                kumaritesDB = null;
            };

            resolve(kumaritesDB);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}

async function getKumaritesDB() {
    if (kumaritesDB) {
        return kumaritesDB;
    }

    return initializeKumaritesDB();
}

/* Buzz Database */

function saveBuzz(buzz) {
    return getKumaritesDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            const transaction = db.transaction("buzzes", "readwrite");
            const store = transaction.objectStore("buzzes");
            const request = store.add(buzz);

            request.onsuccess = function() {
                resolve(request.result);
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    });
}

function getBuzzes() {
    return getKumaritesDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            const transaction = db.transaction("buzzes", "readonly");
            const store = transaction.objectStore("buzzes");
            const request = store.getAll();

            request.onsuccess = function() {
                const buzzes = request.result || [];

                buzzes.sort(function(a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

                resolve(buzzes);
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    });
}

function getBuzzById(id) {
    return getKumaritesDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            const transaction = db.transaction("buzzes", "readonly");
            const store = transaction.objectStore("buzzes");
            const request = store.get(Number(id));

            request.onsuccess = function() {
                resolve(request.result || null);
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    });
}

function updateBuzz(buzz) {
    return getKumaritesDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            const transaction = db.transaction("buzzes", "readwrite");
            const store = transaction.objectStore("buzzes");
            const request = store.put(buzz);

            request.onsuccess = function() {
                resolve(request.result);
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    });
}

function deleteBuzz(id) {
    return getKumaritesDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            const transaction = db.transaction("buzzes", "readwrite");
            const store = transaction.objectStore("buzzes");
            const request = store.delete(Number(id));

            request.onsuccess = function() {
                resolve();
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    });
}

/* Seed Default Buzzes */

async function seedDefaultBuzzes() {
    const existingBuzzes = await getBuzzes();

    for (const defaultBuzz of DEFAULT_BUZZES) {
        const exists = existingBuzzes.some(function(buzz) {
            return buzz.title === defaultBuzz.title;
        });

        if (!exists) {
            const buzzCopy = {
                ...defaultBuzz
            };

            delete buzzCopy.id;

            await saveBuzz(buzzCopy);
        }
    }

    return getBuzzes();
}

/* Images */

function saveBuzzImage(imageId, imageBlob) {
    return getKumaritesDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            const transaction = db.transaction("images", "readwrite");
            const store = transaction.objectStore("images");

            const request = store.put({
                id: imageId,
                blob: imageBlob
            });

            request.onsuccess = function() {
                resolve(imageId);
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    });
}

function getBuzzImageBlob(imageId) {
    if (!imageId) {
        return Promise.resolve(null);
    }

    return getKumaritesDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            const transaction = db.transaction("images", "readonly");
            const store = transaction.objectStore("images");
            const request = store.get(imageId);

            request.onsuccess = function() {
                resolve(
                    request.result
                        ? request.result.blob
                        : null
                );
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    });
}

async function getBuzzImageURL(imageId) {
    const blob = await getBuzzImageBlob(imageId);

    if (!blob) {
        return null;
    }

    return URL.createObjectURL(blob);
}

function updateBuzzUsefulCount(buzzId, usefulCount) {
    return getKumaritesDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            const transaction =
                db.transaction("buzzes", "readwrite");

            const store =
                transaction.objectStore("buzzes");

            const request =
                store.get(Number(buzzId));

            request.onsuccess = function() {
                const existingBuzz =
                    request.result;

                if (!existingBuzz) {
                    reject(
                        new Error("Buzz not found.")
                    );
                    return;
                }

                const updatedBuzz = {
                    ...existingBuzz,
                    usefulCount: Number(usefulCount || 0)
                };

                const updateRequest =
                    store.put(updatedBuzz);

                updateRequest.onsuccess = function() {
                    resolve(updateRequest.result);
                };

                updateRequest.onerror = function() {
                    reject(updateRequest.error);
                };
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    });
}

function resolveBuzzImagePath(imagePath) {
    if (!imagePath) {
        return null;
    }

    if (
        imagePath.startsWith("blob:") ||
        imagePath.startsWith("data:") ||
        imagePath.startsWith("http://") ||
        imagePath.startsWith("https://") ||
        imagePath.startsWith("../") ||
        imagePath.startsWith("/")
    ) {
        return imagePath;
    }

    const pathname = window.location.pathname;

    const insideHTMLPages =
        pathname.includes("HTML%20Pages") ||
        pathname.includes("HTML Pages");

    if (insideHTMLPages) {
        return "../" + imagePath;
    }

    return imagePath;
}

async function hydrateBuzzImages(buzzes) {
    const hydratedBuzzes = [];

    for (const buzz of buzzes) {
        const hydratedBuzz = {
            ...buzz,
            image: resolveBuzzImagePath(buzz.image || null)
        };

        if (buzz.imageId) {
            const imageURL = await getBuzzImageURL(
                buzz.imageId
            );

            if (imageURL) {
                hydratedBuzz.image = imageURL;
            }
        }

        hydratedBuzzes.push(hydratedBuzz);
    }

    return hydratedBuzzes;
}

async function loadBuzzesIntoData() {
    const buzzes = await getBuzzes();

    KUMARITES_DATA.buzzes =
        await hydrateBuzzImages(buzzes);

    return KUMARITES_DATA.buzzes;
}

/* Buzz Helpers */

function getLatestBuzzes(buzzes, limit) {
    const sorted = [...buzzes].sort(function(a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    if (typeof limit === "number") {
        return sorted.slice(0, limit);
    }

    return sorted;
}

function getCategoryName(categoryId) {
    const category =
        KUMARITES_DATA.categories.find(function(category) {
            return category.id === categoryId;
        });

    return category
        ? category.name
        : categoryId || "Category";
}

function getCurrentUserName() {
    return (
        localStorage.getItem("kumaritesUser") ||
        "Kumarite"
    );
}

function formatPrice(value) {
    if (
        value === "" ||
        value === null ||
        value === undefined
    ) {
        return "";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return String(value);
    }

    return number.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatBuzzDate(dateValue) {
    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* Buzz Cards */

async function createBuzzCard(buzz) {
    const card = document.createElement("article");

    card.className = "buzz-card";
    card.dataset.buzzId = buzz.id;
    card.dataset.type = buzz.type || "";
    card.dataset.category = buzz.category || "";
    card.tabIndex = 0;
    card.setAttribute("role", "button");

    const imageContainer =
        document.createElement("div");

    imageContainer.className = "buzz-image";

    const image = document.createElement("img");

    image.alt =
        buzz.title || "Kumarites Buzz";

    if (buzz.image) {
        image.src = resolveBuzzImagePath(buzz.image);
    } else {
        imageContainer.classList.add(
            "buzz-image-placeholder"
        );
    }

    imageContainer.appendChild(image);

    const content =
        document.createElement("div");

    content.className =
        "buzz-card-content";

    const categoryName =
        getCategoryName(buzz.category);

    const price =
        formatPrice(buzz.price);

    const usefulCount =
        Number(buzz.usefulCount || 0);

    content.innerHTML = `
        <span class="buzz-category">
            ${escapeHTML(categoryName)}
        </span>

        <h3>
            ${escapeHTML(
                buzz.title || "Untitled Buzz"
            )}
        </h3>

        ${
            buzz.product
                ? `
                    <p class="buzz-product">
                        ${escapeHTML(buzz.product)}
                    </p>
                `
                : ""
        }

        <p class="buzz-store">
            ${escapeHTML(
                buzz.store || "Community Find"
            )}
        </p>

        ${
            price
                ? `
                    <strong class="buzz-price">
                        ${
                            buzz.price
                                .toString()
                                .includes("₱")
                                ? escapeHTML(price)
                                : `₱${escapeHTML(price)}`
                        }
                    </strong>
                `
                : ""
        }

        ${
            buzz.description
                ? `
                    <p class="buzz-description">
                        ${escapeHTML(
                            buzz.description
                        )}
                    </p>
                `
                : ""
        }

        ${
            buzz.location
                ? `
                    <p class="buzz-location">
                        ${escapeHTML(
                            buzz.location
                        )}
                    </p>
                `
                : ""
        }

        <p class="buzz-author">
            Posted by
            <strong>
                ${escapeHTML(
                    buzz.author || "Kumarite"
                )}
            </strong>
            ${
                buzz.createdAt
                    ? ` · ${formatBuzzDate(
                        buzz.createdAt
                    )}`
                    : ""
            }
        </p>

        <div class="buzz-actions">
            <button
                type="button"
                class="useful-button"
                data-buzz-id="${buzz.id}"
                aria-pressed="false"
            >
                ♡ Useful
                <span>${usefulCount}</span>
            </button>

            <button
                type="button"
                class="save-button"
                data-buzz-id="${buzz.id}"
                aria-pressed="false"
            >
                Save
            </button>
        </div>
    `;

    card.appendChild(imageContainer);
    card.appendChild(content);

    const usefulButton =
        content.querySelector(".useful-button");

    const saveButton =
        content.querySelector(".save-button");

    if (usefulButton) {
        const usefulKey =
            `kumaritesUseful_${buzz.id}`;

        const countElement =
            usefulButton.querySelector("span");

        const baseCount =
            Number(buzz.usefulCount || 0);

        let isUseful =
            localStorage.getItem(usefulKey) === "true";

        function updateUsefulButton() {
            usefulButton.setAttribute(
                "aria-pressed",
                String(isUseful)
            );

            usefulButton.classList.toggle(
                "active",
                isUseful
            );

            if (countElement) {
                countElement.textContent =
                    baseCount + (isUseful ? 1 : 0);
            }
        }

        updateUsefulButton();

        usefulButton.addEventListener(
            "click",
            async function(event) {
                event.preventDefault();
                event.stopPropagation();

                isUseful = !isUseful;

                if (isUseful) {
                    localStorage.setItem(
                        usefulKey,
                        "true"
                    );
                } else {
                    localStorage.removeItem(
                        usefulKey
                    );
                }

                updateUsefulButton();

                try {
                    await updateBuzzUsefulCount(
                        buzz.id,
                        baseCount + (isUseful ? 1 : 0)
                    );
                } catch (error) {
                    console.error(
                        "Unable to update Useful count:",
                        error
                    );

                    // Revert the UI if the database update fails.
                    isUseful = !isUseful;

                    if (isUseful) {
                        localStorage.setItem(
                            usefulKey,
                            "true"
                        );
                    } else {
                        localStorage.removeItem(
                            usefulKey
                        );
                    }

                    updateUsefulButton();
                }
            }
        );
    }

    if (saveButton) {
        const saveKey =
            `kumaritesSaved_${buzz.id}`;

        const alreadySaved =
            localStorage.getItem(saveKey) === "true";

        if (alreadySaved) {
            saveButton.classList.add("saved");
            saveButton.setAttribute(
                "aria-pressed",
                "true"
            );
            saveButton.textContent = "Saved";
        }

        saveButton.addEventListener(
            "click",
            function(event) {
                event.stopPropagation();

                const saved =
                    saveButton.getAttribute(
                        "aria-pressed"
                    ) === "true";

                if (saved) {
                    localStorage.removeItem(saveKey);
                } else {
                    localStorage.setItem(
                        saveKey,
                        "true"
                    );
                }

                saveButton.classList.toggle(
                    "saved",
                    !saved
                );

                saveButton.setAttribute(
                    "aria-pressed",
                    String(!saved)
                );

                saveButton.textContent =
                    saved ? "Save" : "Saved";
            }
        );
    }

    card.addEventListener(
        "click",
        function() {
            openBuzz(buzz.id);
        }
    );

    card.addEventListener(
        "keydown",
        function(event) {
            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                openBuzz(buzz.id);
            }
        }
    );

    return card;
}

async function renderBuzzCards(
    buzzes,
    container
) {
    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        !buzzes ||
        buzzes.length === 0
    ) {
        const empty =
            document.createElement("p");

        empty.className =
            "no-buzz-results";

        empty.textContent =
            "No Buzzes found.";

        container.appendChild(empty);

        return;
    }

    for (const buzz of buzzes) {
        const card =
            await createBuzzCard(buzz);

        container.appendChild(card);
    }
}

/* Create a Buzz Modal */

function createBuzzModal() {
    if (
        document.getElementById(
            "createBuzzModal"
        )
    ) {
        return;
    }

    const modal =
        document.createElement("div");

    modal.id = "createBuzzModal";
    modal.className =
        "create-buzz-modal";

    modal.hidden = true;

    modal.innerHTML = `
        <div
            class="create-buzz-overlay"
            data-close-buzz
        ></div>

        <div
            class="create-buzz-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="createBuzzTitle"
        >
            <div class="create-buzz-header">
                <div>
                    <p class="create-buzz-label">
                        KUMARITES COMMUNITY
                    </p>

                    <h2 id="createBuzzTitle">
                        Create a Buzz
                    </h2>
                </div>

                <button
                    type="button"
                    class="create-buzz-close"
                    data-close-buzz
                    aria-label="Close Create a Buzz"
                >
                    ×
                </button>
            </div>

            <form
                id="createBuzzForm"
                class="create-buzz-form"
            >
                <div class="form-group">
                    <label for="buzzType">
                        Buzz Type
                    </label>

                    <select
                        id="buzzType"
                        name="type"
                        required
                    >
                        <option value="">
                            Select Buzz type
                        </option>

                        <option value="sulit">
                            Sulit Find
                        </option>

                        <option value="sale">
                            Sale
                        </option>

                        <option value="recommendation">
                            Recommendation
                        </option>

                        <option value="advice">
                            Advice
                        </option>
                    </select>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="buzzCategory">
                            Category
                        </label>

                        <select
                            id="buzzCategory"
                            name="category"
                            required
                        >
                            <option value="">
                                Select category
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="buzzPrice">
                            Price
                        </label>

                        <input
                            type="text"
                            id="buzzPrice"
                            name="price"
                            maxlength="50"
                            placeholder="₱0.00 or Up to 30% OFF"
                        >
                    </div>
                </div>

                <div class="form-group">
                    <label for="buzzStore">
                        Store
                    </label>

                    <input
                        type="text"
                        id="buzzStore"
                        name="store"
                        maxlength="100"
                        placeholder="Where did you find it?"
                    >
                </div>

                <div class="form-group">
                    <label for="buzzProduct">
                        Product
                    </label>

                    <input
                        type="text"
                        id="buzzProduct"
                        name="product"
                        maxlength="100"
                        placeholder="What product or item is this?"
                    >
                </div>

                <div class="form-group">
                    <label for="buzzTitle">
                        Buzz Title
                    </label>

                    <input
                        type="text"
                        id="buzzTitle"
                        name="title"
                        maxlength="100"
                        placeholder="Give your Buzz a title"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="buzzDescription">
                        Description
                    </label>

                    <textarea
                        id="buzzDescription"
                        name="description"
                        rows="4"
                        maxlength="500"
                        placeholder="Tell the community about your find..."
                    ></textarea>
                </div>

                <div class="form-group">
                    <label for="buzzLocation">
                        Location
                    </label>

                    <input
                        type="text"
                        id="buzzLocation"
                        name="location"
                        maxlength="150"
                        placeholder="Where is it located?"
                    >
                </div>

                <div class="form-group">
                    <label for="buzzImage">
                        Photo
                    </label>

                    <input
                        type="file"
                        id="buzzImage"
                        name="image"
                        accept="image/*"
                    >

                    <small>
                        Select an image for your Buzz.
                    </small>
                </div>

                <div
                    id="buzzImagePreview"
                    class="buzz-image-preview"
                    hidden
                ></div>

                <p
                    id="createBuzzError"
                    class="create-buzz-error"
                    hidden
                ></p>

                <div class="create-buzz-actions">
                    <button
                        type="button"
                        class="secondary-button"
                        data-close-buzz
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        class="primary-button"
                    >
                        Post Buzz
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    populateBuzzCategories();
    setupCreateBuzzForm();
}

function populateBuzzCategories() {
    const select =
        document.getElementById(
            "buzzCategory"
        );

    if (!select) {
        return;
    }

    KUMARITES_DATA.categories.forEach(
        function(category) {
            const option =
                document.createElement("option");

            option.value = category.id;
            option.textContent = category.name;

            select.appendChild(option);
        }
    );
}

function openCreateBuzz() {
    createBuzzModal();

    const modal =
        document.getElementById(
            "createBuzzModal"
        );

    if (!modal) {
        return;
    }

    modal.hidden = false;
    modal.classList.add("show");

    document.body.classList.add(
        "modal-open"
    );

    const title =
        document.getElementById(
            "buzzTitle"
        );

    if (title) {
        setTimeout(function() {
            title.focus();
        }, 100);
    }
}

function closeCreateBuzz() {
    const modal =
        document.getElementById(
            "createBuzzModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove("show");
    modal.hidden = true;

    document.body.classList.remove(
        "modal-open"
    );

    const form =
        document.getElementById(
            "createBuzzForm"
        );

    if (form) {
        form.reset();
    }

    const preview =
        document.getElementById(
            "buzzImagePreview"
        );

    if (preview) {
        if (preview.dataset.objectUrl) {
            URL.revokeObjectURL(
                preview.dataset.objectUrl
            );
        }

        preview.innerHTML = "";
        preview.hidden = true;

        delete preview.dataset.objectUrl;
    }

    const error =
        document.getElementById(
            "createBuzzError"
        );

    if (error) {
        error.textContent = "";
        error.hidden = true;
    }
}

function setupCreateBuzzForm() {
    const form =
        document.getElementById(
            "createBuzzForm"
        );

    if (
        !form ||
        form.dataset.ready === "true"
    ) {
        return;
    }

    form.dataset.ready = "true";

    const imageInput =
        document.getElementById(
            "buzzImage"
        );

    if (imageInput) {
        imageInput.addEventListener(
            "change",
            previewBuzzImage
        );
    }

    form.addEventListener(
        "submit",
        submitCreateBuzz
    );
}

function previewBuzzImage(event) {
    const file =
        event.target.files[0];

    const preview =
        document.getElementById(
            "buzzImagePreview"
        );

    if (!preview) {
        return;
    }

    if (preview.dataset.objectUrl) {
        URL.revokeObjectURL(
            preview.dataset.objectUrl
        );

        delete preview.dataset.objectUrl;
    }

    if (!file) {
        preview.innerHTML = "";
        preview.hidden = true;
        return;
    }

    const imageURL =
        URL.createObjectURL(file);

    preview.dataset.objectUrl =
        imageURL;

    preview.innerHTML = `
        <img
            src="${imageURL}"
            alt="Selected Buzz image preview"
        >
    `;

    preview.hidden = false;
}

/* Submit Buzz */

async function submitCreateBuzz(event) {
    event.preventDefault();

    const error =
        document.getElementById(
            "createBuzzError"
        );

    if (error) {
        error.hidden = true;
        error.textContent = "";
    }

    const formData =
        new FormData(event.target);

    const type =
        String(
            formData.get("type") || ""
        ).trim();

    const category =
        String(
            formData.get("category") || ""
        ).trim();

    const store =
        String(
            formData.get("store") || ""
        ).trim();

    const product =
        String(
            formData.get("product") || ""
        ).trim();

    const title =
        String(
            formData.get("title") || ""
        ).trim();

    const description =
        String(
            formData.get("description") || ""
        ).trim();

    const price =
        String(
            formData.get("price") || ""
        ).trim();

    const location =
        String(
            formData.get("location") || ""
        ).trim();

    const imageFile =
        formData.get("image");

    if (!type) {
        showBuzzError(
            "Please select a Buzz type."
        );
        return;
    }

    if (!category) {
        showBuzzError(
            "Please select a category."
        );
        return;
    }

    if (!title) {
        showBuzzError(
            "Please enter a Buzz title."
        );
        return;
    }

    try {
        const buzz = {
            type: type,
            category: category,
            store: store,
            product: product,
            title: title,
            description: description,
            price: price,
            location: location,
            author: getCurrentUserName(),
            createdAt:
                new Date().toISOString(),
            imageId: null,
            usefulCount: 0
        };

        if (
            imageFile &&
            imageFile instanceof File &&
            imageFile.size > 0
        ) {
            const imageId =
                crypto.randomUUID();

            await saveBuzzImage(
                imageId,
                imageFile
            );

            buzz.imageId = imageId;
        }

        const buzzId =
            await saveBuzz(buzz);

        buzz.id = buzzId;

        const hydratedBuzz = {
            ...buzz,
            image: buzz.imageId
                ? await getBuzzImageURL(
                    buzz.imageId
                )
                : null
        };

        KUMARITES_DATA.buzzes = [
            hydratedBuzz,
            ...KUMARITES_DATA.buzzes
        ];

        closeCreateBuzz();

        showToast(
            "Your Buzz was posted successfully."
        );

        document.dispatchEvent(
            new CustomEvent(
                "kumarites:buzz-created",
                {
                    detail: hydratedBuzz
                }
            )
        );
    } catch (errorObject) {
        console.error(
            "Create Buzz error:",
            errorObject
        );

        showBuzzError(
            "Unable to save your Buzz. Please try again."
        );
    }
}

function showBuzzError(message) {
    const error =
        document.getElementById(
            "createBuzzError"
        );

    if (!error) {
        return;
    }

    error.textContent = message;
    error.hidden = false;
}

/* Open Buzz */

async function openBuzz(id) {
    const buzz =
        await getBuzzById(id);

    if (!buzz) {
        showToast(
            "Buzz could not be found."
        );
        return;
    }

    document.dispatchEvent(
        new CustomEvent(
            "kumarites:buzz-open",
            {
                detail: buzz
            }
        )
    );

    console.log(
        "Opening Buzz:",
        buzz
    );
}

/* Toast */

function showToast(message) {
    let toast =
        document.getElementById(
            "kumaritesToast"
        );

    if (!toast) {
        toast =
            document.createElement("div");

        toast.id =
            "kumaritesToast";

        toast.className =
            "kumarites-toast";

        toast.setAttribute(
            "role",
            "status"
        );

        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(
        window.kumaritesToastTimer
    );

    window.kumaritesToastTimer =
        setTimeout(function() {
            toast.classList.remove(
                "show"
            );
        }, 2800);
}

/* Create Buzz Buttons */

function initializeCreateBuzzButtons() {
    document
        .querySelectorAll(
            "[data-create-buzz]"
        )
        .forEach(function(button) {
            if (
                button.dataset
                    .createBuzzReady ===
                "true"
            ) {
                return;
            }

            button.dataset
                .createBuzzReady = "true";

            button.addEventListener(
                "click",
                openCreateBuzz
            );
        });
}

/* Global Modal Events */

document.addEventListener(
    "click",
    function(event) {
        const closeButton =
            event.target.closest(
                "[data-close-buzz]"
            );

        if (closeButton) {
            closeCreateBuzz();
        }
    }
);

document.addEventListener(
    "keydown",
    function(event) {
        if (event.key === "Escape") {
            closeCreateBuzz();
        }
    }
);

/* Initialization */

document.addEventListener(
    "DOMContentLoaded",
    async function() {
        try {
            await initializeKumaritesDB();

            await seedDefaultBuzzes();

            await loadBuzzesIntoData();

            initializeCreateBuzzButtons();

            document.dispatchEvent(
                new CustomEvent(
                    "kumarites:ready"
                )
            );
        } catch (error) {
            console.error(
                "Kumarites initialization failed:",
                error
            );

            document.dispatchEvent(
                new CustomEvent(
                    "kumarites:error",
                    {
                        detail: error
                    }
                )
            );
        }
    }
);

/* New Buzz Event */

document.addEventListener(
    "kumarites:buzz-created",
    function(event) {
        const newBuzz =
            event.detail;

        if (!newBuzz) {
            return;
        }

        KUMARITES_DATA.buzzes = [
            newBuzz,
            ...KUMARITES_DATA.buzzes.filter(
                function(buzz) {
                    return (
                        buzz.id !==
                        newBuzz.id
                    );
                }
            )
        ];
    }
);