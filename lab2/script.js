const allBooks = [
    { id: 1, title: "Кобзар", author: "Тарас Шевченко", price: 350, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Slastion-Bandurist_Samiylo_Yasnij.jpg/220px-Slastion-Bandurist_Samiylo_Yasnij.jpg" },
    { id: 2, title: "Тіні забутих предків", author: "Михайло Коцюбинський", price: 280, image: "https://upload.wikimedia.org/wikipedia/uk/thumb/e/e3/Tini_predkiv.jpg/250px-Tini_predkiv.jpg" },
    { id: 3, title: "Захар Беркут", author: "Іван Франко", price: 300, image: "https://upload.wikimedia.org/wikipedia/uk/thumb/e/e5/%D0%9F%D0%BE%D1%81%D1%82%D0%B5%D1%80_%D1%84%D1%96%D0%BB%D1%8C%D0%BC%D1%83_%D0%97%D0%B0%D1%85%D0%B0%D1%80_%D0%91%D0%B5%D1%80%D0%BA%D1%83%D1%82_%282019%29.jpg/250px-%D0%9F%D0%BE%D1%81%D1%82%D0%B5%D1%80_%D1%84%D1%96%D0%BB%D1%8C%D0%BC%D1%83_%D0%97%D0%B0%D1%85%D0%B0%D1%80_%D0%91%D0%B5%D1%80%D0%BA%D1%83%D1%82_%282019%29.jpg" },
    { id: 4, title: "Лісова пісня", author: "Леся Українка", price: 250, image: "https://static.yakaboo.ua/media/cloudflare/product/webp/600x840/c/o/cover_858_1.jpg" },
    { id: 5, title: "Кайдашева сім'я", author: "Іван Нечуй-Левицький", price: 220, image: "https://chitaka.com.ua/wp-content/uploads/2022/03/Kajdasheva-simya-1.jpg" },
    { id: 6, title: "Місто", author: "Валер'ян Підмогильний", price: 310, image: "https://upload.wikimedia.org/wikipedia/commons/4/43/Misto_Pidmohylnyy_1928.jpg" },
    { id: 7, title: "Тигролови", author: "Іван Багряний", price: 290, image: "https://static.yakaboo.ua/media/catalog/product/i/m/img347_144.jpg" },
    { id: 8, title: "Intermezzo", author: "Михайло Коцюбинський", price: 180, image: "https://static.yakaboo.ua/media/cloudflare/product/webp/600x840/c/o/cover_65_102.jpg" }
];

const bookContainer = document.getElementById('book-container');
const cartContainer = document.getElementById('cart-items-container');
const cartTotalElement = document.getElementById('cart-total');
const emptyCartMsg = document.getElementById('empty-cart-msg');
const favoritesContainer = document.getElementById('favorites-items-container');
const emptyFavoritesMsg = document.getElementById('empty-favorites-msg');

let cart = [];
let favorites = [];

const STORAGE_KEYS = {
    cart: 'bookstore_cart',
    favorites: 'bookstore_favorites'
};

function loadState() {
    const storedCart = localStorage.getItem(STORAGE_KEYS.cart);
    const storedFavorites = localStorage.getItem(STORAGE_KEYS.favorites);

    try {
        cart = storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        cart = [];
    }

    try {
        favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
        favorites = [];
    }
}

function saveCart() {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
}

function saveFavorites() {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
}

function renderBooks() {
    bookContainer.innerHTML = '';

    const randomBooks = allBooks.sort(() => 0.5 - Math.random());

    for (let i = 0; i < randomBooks.length; i++) {
        const book = randomBooks[i];

        const article = document.createElement('article');
        article.classList.add('book-card');
        
        const isInCart = cart.some(item => item.id === book.id);
        const isFavorite = favorites.some(item => item.id === book.id);

        article.innerHTML = `
            <div class="book-image">
                <img src="${book.image}" alt="${book.title}" style="width:100%; height:100%; object-fit:cover;">
                <button class="favorite-btn ${isFavorite ? 'is-favorite' : ''}" data-book-id="${book.id}" onclick="toggleFavorite(${book.id}, this)" aria-label="Улюблене">
                    ${isFavorite ? '♥' : '♡'}
                </button>
            </div>
            <h3>${book.title}</h3>
            <p class="author">Автор: ${book.author}</p>
            <p class="rating">Рейтинг: ★★★★★</p>
            <p class="price">${book.price} грн</p>
            <div class="book-actions">
                <button class="buy-btn" data-book-id="${book.id}" onclick="addToCart(${book.id}, this)">
                    ${isInCart ? 'У кошику' : 'Купити'}
                </button>
            </div>
        `;

        bookContainer.appendChild(article);
    }

    updateCartButtons();
}

function addToCart(bookId, buttonElement) {
    const book = allBooks.find(b => b.id === bookId);
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...book, quantity: 1 });
    }

    saveCart();

    buttonElement.textContent = "У кошику";
    buttonElement.style.backgroundColor = "#27ae60";
    buttonElement.style.transform = "scale(0.95)";
    setTimeout(() => {
        buttonElement.style.transform = "scale(1)";
    }, 100);

    renderCart();
}

function renderCart() {
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        emptyCartMsg.style.display = 'block';
        cartTotalElement.innerText = '0';
        updateCartButtons();
        return;
    } else {
        emptyCartMsg.style.display = 'none';
    }

    let totalSum = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalSum += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        cartItem.innerHTML = `
            <span>${item.title} (${item.author})</span>
            <div class="cart-controls">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity} шт.</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button class="delete-btn" onclick="removeFromCart(${item.id})">Видалити</button>
            </div>
            <div>${itemTotal} грн</div>
        `;
        
        cartContainer.appendChild(cartItem);
    });

    cartTotalElement.innerText = totalSum;
    updateCartButtons();
}

function changeQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            renderCart();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

function updateCartButtons() {
    const buttons = document.querySelectorAll('.buy-btn');
    buttons.forEach(button => {
        const bookId = Number(button.dataset.bookId);
        const isInCart = cart.some(item => item.id === bookId);
        button.textContent = isInCart ? 'У кошику' : 'Купити';
        button.style.backgroundColor = isInCart ? '#27ae60' : '#2c3e50';
    });
}

function toggleFavorite(bookId, buttonElement) {
    const existingFavorite = favorites.find(item => item.id === bookId);

    if (existingFavorite) {
        favorites = favorites.filter(item => item.id !== bookId);
        buttonElement.classList.remove('is-favorite');
        buttonElement.textContent = '♡';
    } else {
        const book = allBooks.find(b => b.id === bookId);
        if (book) {
            favorites.push({ ...book });
            buttonElement.classList.add('is-favorite');
            buttonElement.textContent = '♥';
        }
    }

    saveFavorites();
    renderFavorites();
}

function renderFavorites() {
    favoritesContainer.innerHTML = '';

    if (favorites.length === 0) {
        emptyFavoritesMsg.style.display = 'block';
        return;
    } else {
        emptyFavoritesMsg.style.display = 'none';
    }

    favorites.forEach(item => {
        const favoriteItem = document.createElement('div');
        favoriteItem.classList.add('favorite-item');

        favoriteItem.innerHTML = `
            <div class="favorite-info">
                <span>${item.title} (${item.author})</span>
                <span class="favorite-price">${item.price} грн</span>
            </div>
            <div class="favorite-controls">
                <button class="delete-btn" onclick="removeFromFavorites(${item.id})">Видалити</button>
            </div>
        `;

        favoritesContainer.appendChild(favoriteItem);
    });
}

function removeFromFavorites(id) {
    favorites = favorites.filter(item => item.id !== id);
    saveFavorites();
    renderFavorites();
    syncFavoriteButtons();
}

function syncFavoriteButtons() {
    const buttons = document.querySelectorAll('.favorite-btn');
    buttons.forEach(button => {
        const bookId = Number(button.dataset.bookId);
        const isFavorite = favorites.some(item => item.id === bookId);
        button.classList.toggle('is-favorite', isFavorite);
        button.textContent = isFavorite ? '♥' : '♡';
    });
}

loadState();
renderBooks();
renderCart();
renderFavorites();