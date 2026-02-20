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

let cart = [];

function renderBooks() {
    bookContainer.innerHTML = '';

    const randomBooks = allBooks.sort(() => 0.5 - Math.random());

    for (let i = 0; i < randomBooks.length; i++) {
        const book = randomBooks[i];

        const article = document.createElement('article');
        article.classList.add('book-card');
        
        article.innerHTML = `
            <div class="book-image"><img src="${book.image}" alt="${book.title}" style="width:100%; height:100%; object-fit:cover;"></div>
            <h3>${book.title}</h3>
            <p class="author">Автор: ${book.author}</p>
            <p class="rating">Рейтинг: ★★★★★</p>
            <p class="price">${book.price} грн</p>
            <button onclick="addToCart(${book.id}, this)">Купити</button>
        `;

        bookContainer.appendChild(article);
    }
}

function addToCart(bookId, buttonElement) {
    const book = allBooks.find(b => b.id === bookId);
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...book, quantity: 1 });
    }

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
}

function changeQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            renderCart();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

renderBooks();