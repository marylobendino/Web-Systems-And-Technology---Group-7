document.addEventListener('DOMContentLoaded', () => {
	const shareButton = document.getElementById('shareStoreButton');
	const shareModal = document.getElementById('shareModal');
	const shareLinkInput = document.getElementById('shareLinkInput');
	const copyShareLinkButton = document.getElementById('copyShareLinkButton');
	const shareCopyStatus = document.getElementById('shareCopyStatus');
	const closeShareModal = () => {
		if (!shareModal) return;
		shareModal.classList.add('hidden');
		shareModal.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('modal-open');
	};

	if (shareButton) {
		shareButton.addEventListener('click', () => {
			if (!shareModal) return;
			shareLinkInput.value = window.location.href;
			shareCopyStatus.textContent = '';
			shareModal.classList.remove('hidden');
			shareModal.setAttribute('aria-hidden', 'false');
			document.body.classList.add('modal-open');
		});
	}

	document.querySelectorAll('[data-close-share-modal]').forEach((element) => {
		element.addEventListener('click', closeShareModal);
	});

	if (copyShareLinkButton) {
		copyShareLinkButton.addEventListener('click', async () => {
			try {
				await navigator.clipboard.writeText(shareLinkInput.value);
				shareCopyStatus.textContent = 'Link copied';
			} catch (error) {
				shareLinkInput.select();
				shareCopyStatus.textContent = 'Select and copy the link manually.';
			}
		});
	}

	document.querySelectorAll('[data-share-network]').forEach((link) => {
		link.addEventListener('click', () => {
			const encodedUrl = encodeURIComponent(window.location.href);
			const encodedText = encodeURIComponent('Check out this Kumarites store page.');
			const networkUrls = {
				facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
				x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
				whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
				telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
				linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
			};
			link.href = networkUrls[link.dataset.shareNetwork];
		});
	});

	const createBuzzModal = document.getElementById('createBuzzModal');
	const createBuzzForm = document.getElementById('createBuzzForm');
	const imageError = document.getElementById('buzzImageError');
	const createBuzzButtons = document.querySelectorAll('.create-buzz-button');
	const closeCreateBuzzModal = () => {
		if (!createBuzzModal) return;
		createBuzzModal.classList.add('hidden');
		createBuzzModal.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('modal-open');
	};

	createBuzzButtons.forEach((button) => {
		button.addEventListener('click', () => {
			if (!createBuzzModal) return;
			createBuzzModal.classList.remove('hidden');
			createBuzzModal.setAttribute('aria-hidden', 'false');
			document.body.classList.add('modal-open');
			document.getElementById('buzzCategory')?.focus();
		});
	});

	document.querySelectorAll('[data-close-create-modal]').forEach((element) => {
		element.addEventListener('click', closeCreateBuzzModal);
	});

	const buzzModal = document.getElementById('buzzModal');
	const modalImage = document.getElementById('modalImage');
	const modalCategory = document.getElementById('modalCategory');
	const modalTitle = document.getElementById('buzzModalTitle');
	const modalMeta = document.getElementById('modalMeta');
	const modalDescription = document.getElementById('modalDescription');
	const modalAuthor = document.getElementById('modalAuthor');
	const modalTime = document.getElementById('modalTime');
	const modalClose = buzzModal?.querySelector('.modal-close');
	const modalBackdrop = buzzModal?.querySelector('[data-close-modal]');
	let activeModalCard = null;

	const syncUsefulButton = (button, nextPressed, nextCount) => {
		if (!button) return;

		const icon = button.querySelector('i');
		const countElement = button.querySelector('span');

		button.setAttribute('aria-pressed', String(nextPressed));
		button.classList.toggle('active', nextPressed);
		button.dataset.count = String(nextCount);

		if (icon) {
			icon.classList.toggle('fi-rr-heart', !nextPressed);
			icon.classList.toggle('fi-sr-heart', nextPressed);
		}

		if (countElement) {
			countElement.textContent = `Useful ${nextCount}`;
		}
	};

	const syncSaveButton = (button, saved) => {
		if (!button) return;
		button.classList.toggle('saved', saved);
		button.setAttribute('aria-pressed', String(saved));
		button.textContent = saved ? 'Saved' : 'Save';
	};

	const openBuzzModal = (card) => {
		if (!buzzModal || !modalImage || !modalCategory || !modalTitle || !modalMeta || !modalDescription || !modalAuthor || !modalTime) return;

		const image = card.querySelector('img');
		const category = card.querySelector('.buzz-type');
		const title = card.querySelector('h3');
		const meta = card.querySelector('.buzz-tags');
		const description = card.querySelector('.buzz-card-content > p:first-of-type');
		const author = card.querySelector('.buzz-author strong');
		const time = card.querySelector('.buzz-time');
		const cardUsefulButton = card.querySelector('.useful-button');
		const modalUsefulButton = buzzModal.querySelector('.useful-button');
		const cardSaveButton = card.querySelector('.save-button');
		const modalSaveButton = buzzModal.querySelector('.save-button');
		const modalDeleteButton = buzzModal.querySelector('.modal-delete-button');

		if (image) modalImage.src = image.src;
		if (image) modalImage.alt = image.alt;
		if (category) modalCategory.textContent = category.textContent.trim();
		if (title) modalTitle.textContent = title.textContent.trim();
		if (meta) modalMeta.textContent = meta.textContent.trim();
		if (description) modalDescription.textContent = description.textContent.trim();
		if (author) modalAuthor.textContent = author.textContent.trim();
		if (time) modalTime.textContent = time.textContent.trim();
		if (cardUsefulButton && modalUsefulButton) {
			const count = Number(cardUsefulButton.dataset.count || 0);
			const pressed = cardUsefulButton.getAttribute('aria-pressed') === 'true';
			syncUsefulButton(modalUsefulButton, pressed, count);
		}
		if (cardSaveButton && modalSaveButton) {
			syncSaveButton(modalSaveButton, cardSaveButton.classList.contains('saved'));
		}
		if (modalDeleteButton) modalDeleteButton.hidden = card.dataset.userCreated !== 'true';

		activeModalCard = card;
		buzzModal.classList.remove('hidden');
		buzzModal.setAttribute('aria-hidden', 'false');
		document.body.classList.add('modal-open');
	};

	const closeBuzzModal = () => {
		if (!buzzModal) return;
		buzzModal.classList.add('hidden');
		buzzModal.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('modal-open');
		activeModalCard = null;
	};

	if (modalClose) modalClose.addEventListener('click', closeBuzzModal);
	if (modalBackdrop) modalBackdrop.addEventListener('click', closeBuzzModal);
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && buzzModal && !buzzModal.classList.contains('hidden')) {
			closeBuzzModal();
		}
		if (event.key === 'Escape' && createBuzzModal && !createBuzzModal.classList.contains('hidden')) {
			closeCreateBuzzModal();
		}
			if (event.key === 'Escape' && shareModal && !shareModal.classList.contains('hidden')) {
				closeShareModal();
			}
	});

	document.addEventListener('click', (event) => {
		const button = event.target.closest('.view-button');
		if (!button) return;
		event.preventDefault();
		const card = button.closest('.buzz-card');
		if (card) openBuzzModal(card);
	});

	
	const formatRelativeTime = (minutesAgo) => {
		const totalMinutes = Math.max(0, minutesAgo);

		if (totalMinutes < 1) return 'just now';
		if (totalMinutes < 60) return `${totalMinutes} minute${totalMinutes === 1 ? '' : 's'} ago`;
		if (totalMinutes < 1440) {
			const hours = Math.floor(totalMinutes / 60);
			return `${hours} hour${hours === 1 ? '' : 's'} ago`;
		}
		const days = Math.floor(totalMinutes / 1440);
		return `${days} day${days === 1 ? '' : 's'} ago`;
	};

	//Trying the new Updated Timestamps, if error might delete it later
	const updateBuzzTimes = () => {
		document.querySelectorAll('.buzz-time').forEach((element) => {
			if (!element.dataset.postedAt) {
				const initialMinutesAgo = Number(element.dataset.minutesAgo || 0);
				element.dataset.postedAt = String(Date.now() - initialMinutesAgo * 60 * 1000);
			}

			const elapsedMilliseconds = Math.max(0, Date.now() - Number(element.dataset.postedAt));
			const minutesAgo = Math.floor(elapsedMilliseconds / (60 * 1000));
			element.textContent = formatRelativeTime(minutesAgo);
		});
	};

	updateBuzzTimes();
	setInterval(updateBuzzTimes, 60000);

	const tabButtons = document.querySelectorAll('.tab-button');
	const buzzSearch = document.querySelector('.search-sort input');
	const sortSelect = document.querySelector('.search-sort select');
	const buzzList = document.querySelector('.buzz-list-items');
	const navigationSearch = document.getElementById('searchInput');
	const loadMoreButton = document.getElementById('loadMoreBuzzesButton');

	if (!buzzSearch || !sortSelect || !buzzList) return;

	function updateBuzzes() {
		const activeTab = document.querySelector('.tab-button.active');
		if (!activeTab) return;

		const selectedCategory = activeTab.dataset.category;
		const searchTerm = buzzSearch.value.trim().toLowerCase();

		document.querySelectorAll('.buzz-card').forEach((card) => {
			const matchesCategory = selectedCategory === 'latest' || card.dataset.category === selectedCategory;
			const matchesSearch = card.textContent.toLowerCase().includes(searchTerm);
			card.hidden = !matchesCategory || !matchesSearch;
		});
	}

	if (navigationSearch) {
		navigationSearch.addEventListener('input', () => {
			buzzSearch.value = navigationSearch.value;
			updateBuzzes();
		});
	}

	tabButtons.forEach((button) => {
		button.addEventListener('click', () => {
			tabButtons.forEach((tab) => {
				tab.classList.remove('active');
				tab.setAttribute('aria-selected', 'false');
			});

			button.classList.add('active');
			button.setAttribute('aria-selected', 'true');
			updateBuzzes();
		});
	});

	
	buzzSearch.addEventListener('input', updateBuzzes);

	sortSelect.addEventListener('change', () => {
		const cards = Array.from(document.querySelectorAll('.buzz-card'));

		if (sortSelect.value === 'Oldest') {
			cards.reverse();
		} else if (sortSelect.value === 'Most Popular') {
			cards.sort((firstCard, secondCard) => {
				const firstCount = Number(firstCard.querySelector('.useful-button')?.dataset.count || 0);
				const secondCount = Number(secondCard.querySelector('.useful-button')?.dataset.count || 0);
				return secondCount - firstCount;
			});
		}

		cards.forEach((card) => buzzList.appendChild(card));
		updateBuzzes();
	});

	//useful button 
	document.addEventListener('click', (event) => {
		const button = event.target.closest('.useful-button');
		if (!button) return;

		const isPressed = button.getAttribute('aria-pressed') === 'true';
		const currentCount = Number(button.dataset.count) || 0;
		const nextPressed = !isPressed;
		const nextCount = nextPressed ? currentCount + 1 : Math.max(0, currentCount - 1);
		const card = button.closest('.buzz-card') || activeModalCard;
		const cardUsefulButton = card?.querySelector('.buzz-actions .useful-button');
		const modalUsefulButton = buzzModal?.querySelector('.modal-actions .useful-button');

		syncUsefulButton(button, nextPressed, nextCount);
		if (cardUsefulButton && cardUsefulButton !== button) {
			syncUsefulButton(cardUsefulButton, nextPressed, nextCount);
		}
		if (modalUsefulButton && modalUsefulButton !== button && modalUsefulButton !== cardUsefulButton) {
			syncUsefulButton(modalUsefulButton, nextPressed, nextCount);
		}
		event.stopPropagation();
	});

	//save button
	const saveButtons = document.querySelectorAll('.save-button');

	saveButtons.forEach((button) => {
		button.type = 'button';
		button.setAttribute('aria-pressed', 'false');
	});

	document.addEventListener('click', (event) => {
		const button = event.target.closest('.save-button');
		if (!button) return;

		const nextSaved = !button.classList.contains('saved');
		const card = button.closest('.buzz-card') || activeModalCard;
		const cardSaveButton = card?.querySelector('.save-button');
		const modalSaveButton = buzzModal?.querySelector('.modal-actions .save-button');

		syncSaveButton(button, nextSaved);
		if (cardSaveButton && cardSaveButton !== button) syncSaveButton(cardSaveButton, nextSaved);
		if (modalSaveButton && modalSaveButton !== button && modalSaveButton !== cardSaveButton) {
			syncSaveButton(modalSaveButton, nextSaved);
		}
	});

	document.addEventListener('click', (event) => {
		const button = event.target.closest('.delete-button');
		if (!button) return;

		const card = button.closest('.buzz-card') || activeModalCard;
		if (!card) return;

		if (confirm('Delete this buzz?')) {
			if (activeModalCard === card) closeBuzzModal();
			card.remove();
			updateBuzzes();
		}
	});

	const createBuzzCard = ({ category, title, description, tags, imageSrc, imageAlt, author = 'You', userCreated = true, minutesAgo = 0, usefulCount = 0 }) => {
		const categoryLabels = {
			sulit: 'SULIT FIND',
			sale: 'SALE / PROMO',
			recommendation: 'RECOMMENDATION',
			advice: 'ADVICE'
		};
		const categoryImages = {
			sulit: 'Images/Stores%20Images/DoveBuy1Take1.png',
			sale: 'Images/Stores%20Images/Mang%20Inasal.png',
			recommendation: 'Images/Stores%20Images/Miniso.png',
			advice: '../Images/Stores%20Images/SMMallOfAsia.png'
		};
		const card = document.createElement('li');
		card.className = 'buzz-card';
		card.dataset.category = category;
		card.dataset.userCreated = String(userCreated);
		card.innerHTML = `
			<div class="buzz-image">
				<img src="" alt="">
			</div>
			<div class="buzz-card-content">
				<div class="buzz-meta">
					<span class="buzz-type ${category}">${categoryLabels[category]}</span>
					<span class="buzz-time" data-minutes-ago="${minutesAgo}">just now</span>
				</div>
				<h3></h3>
				<p></p>
				<p class="buzz-tags"></p>
				<div class="buzz-footer">
					<span class="buzz-author">Posted by <strong></strong></span>
				</div>
				<div class="buzz-actions">
					<button class="useful-button" type="button" data-count="${usefulCount}" aria-pressed="false">
						<i class="fi fi-rr-heart" aria-hidden="true"></i>
						<span>Useful ${usefulCount}</span>
					</button>
					<button class="save-button" type="button" aria-pressed="false">Save</button>
					<button class="delete-button" type="button">Delete</button>
					<a class="view-button" href="#">View Buzz</a>
				</div>
			</div>`;
		const cardImage = card.querySelector('.buzz-image img');
		cardImage.src = imageSrc || categoryImages[category];
		cardImage.alt = imageAlt || categoryLabels[category];
		card.querySelector('.buzz-author strong').textContent = author;
		card.querySelector('.delete-button').hidden = !userCreated;
		card.querySelector('h3').textContent = title;
		card.querySelector('.buzz-card-content > p:first-of-type').textContent = description;
		card.querySelector('.buzz-tags').textContent = tags || 'SM Mall of Asia | Community Find';
		return card;
	};

	const additionalBuzzes = [
		{
			category: 'sulit',
			title: 'Affordable rice bundles available today',
			description: 'The supermarket has value rice bundles that are useful for families doing their weekly grocery run.',
			tags: 'SM Supermarket (SM Mall of Asia) | Grocery',
			imageSrc: 'Images/rice%20-%20latest%20buzzes.png',
			imageAlt: 'Rice bundles',
			author: 'TipidTita',
			minutesAgo: 360,
			usefulCount: 16
		},
		{
			category: 'sale',
			title: 'Weekend dining promos are available',
			description: 'Several restaurants are offering combo meals and discounts during the weekend.',
			tags: 'SM Mall of Asia | Dining',
			imageSrc: 'Images/BuzzFeed%20Images/Food.png',
			imageAlt: 'Food finds',
			author: 'KainTayo',
			minutesAgo: 480,
			usefulCount: 20
		},
		{
			category: 'recommendation',
			title: 'Good school supply bundles for students',
			description: 'Found practical notebooks and school supplies sold in bundles at the department store.',
			tags: 'Department Store (SM Mall of Asia) | School Supplies',
			imageSrc: 'Images/school%20supplies%20-%20latest%20buzzes.png',
			imageAlt: 'School supplies',
			author: 'CampusSaver',
			minutesAgo: 720,
			usefulCount: 23
		},
		{
			category: 'advice',
			title: 'Bring a reusable bag for quick errands',
			description: 'A reusable bag makes it easier to carry small purchases when visiting multiple stores.',
			tags: 'SM Mall of Asia | Practical Tips',
			imageSrc: 'Images/less%20crowd%20-%20latest%20buzzess.png',
			imageAlt: 'Mall visit advice',
			author: 'PracticalPH',
			minutesAgo: 1080,
			usefulCount: 13
		}
	];

	if (loadMoreButton) {
		loadMoreButton.addEventListener('click', () => {
			const isExpanded = loadMoreButton.dataset.expanded === 'true';

			if (isExpanded) {
				buzzList.querySelectorAll('[data-loaded-buzz="true"]').forEach((card) => card.remove());
				loadMoreButton.textContent = 'Load More Buzzes';
				loadMoreButton.dataset.expanded = 'false';
			} else {
				additionalBuzzes.forEach((buzz) => {
					const card = createBuzzCard({ ...buzz, userCreated: false });
					card.dataset.loadedBuzz = 'true';
					buzzList.appendChild(card);
				});
				loadMoreButton.textContent = 'Show Less Buzzes';
				loadMoreButton.dataset.expanded = 'true';
			}

			updateBuzzTimes();
			updateBuzzes();
		});
	}

	const validateBuzzImage = (file) => new Promise((resolve) => {
		const image = new Image();
		const objectUrl = URL.createObjectURL(file);
		image.onload = () => {
			URL.revokeObjectURL(objectUrl);
			const ratio = image.width / image.height;
			const matchesRecommendedRatio = [4 / 3, 16 / 9].some((targetRatio) => Math.abs(ratio - targetRatio) <= 0.12);

			if (image.width < 800 || image.height < 600) {
				resolve('Please choose an image at least 800 x 600 pixels.');
				return;
			}
			if (!matchesRecommendedRatio) {
				resolve('Please use a 4:3 or 16:9 image so it displays properly.');
				return;
			}
			resolve('');
		};
		image.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			resolve('This image could not be read. Please choose another file.');
		};
		image.src = objectUrl;
	});

	if (createBuzzForm) {
		createBuzzForm.addEventListener('submit', async (event) => {
			event.preventDefault();
			const formData = new FormData(createBuzzForm);
			const imageFile = formData.get('image');
			let imageSrc = '';
			if (imageError) {
				imageError.textContent = '';
				imageError.hidden = true;
			}

			if (!(imageFile instanceof File) || imageFile.size === 0) {
				if (imageError) {
					imageError.textContent = 'Please choose an image before posting your buzz.';
					imageError.hidden = false;
				}
				return;
			}

			if (imageFile instanceof File && imageFile.size > 0) {
				const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
				if (!allowedTypes.includes(imageFile.type)) {
					if (imageError) {
						imageError.textContent = 'Please choose a JPG, PNG, or WEBP image.';
						imageError.hidden = false;
					}
					return;
				}
				if (imageFile.size > 5 * 1024 * 1024) {
					if (imageError) {
						imageError.textContent = 'Please choose an image smaller than 5 MB.';
						imageError.hidden = false;
					}
					return;
				}
				const imageValidationError = await validateBuzzImage(imageFile);
				if (imageValidationError) {
					if (imageError) {
						imageError.textContent = imageValidationError;
						imageError.hidden = false;
					}
					return;
				}

				imageSrc = await new Promise((resolve) => {
					const reader = new FileReader();
					reader.addEventListener('load', () => resolve(reader.result));
					reader.readAsDataURL(imageFile);
				});
			}

			const card = createBuzzCard({
				category: formData.get('category'),
				title: formData.get('title').trim(),
				description: formData.get('description').trim(),
				tags: formData.get('tags').trim(),
				imageSrc,
				imageAlt: imageFile.name
			});
			buzzList.prepend(card);
			createBuzzForm.reset();
			closeCreateBuzzModal();
			updateBuzzTimes();
			updateBuzzes();
		});
	}
});
   