// 1. База даних книг (масив об'єктів)
const allBooks = [
    { id: 1, title: "Кобзар", author: "Тарас Шевченко", price: 350, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Slastion-Bandurist_Samiylo_Yasnij.jpg/220px-Slastion-Bandurist_Samiylo_Yasnij.jpg" },
    { id: 2, title: "Тіні забутих предків", author: "Михайло Коцюбинський", price: 280, image: "https://upload.wikimedia.org/wikipedia/uk/thumb/e/e3/Tini_predkiv.jpg/250px-Tini_predkiv.jpg" },
    { id: 3, title: "Захар Беркут", author: "Іван Франко", price: 300, image: "https://upload.wikimedia.org/wikipedia/uk/thumb/e/e5/%D0%9F%D0%BE%D1%81%D1%82%D0%B5%D1%80_%D1%84%D1%96%D0%BB%D1%8C%D0%BC%D1%83_%D0%97%D0%B0%D1%85%D0%B0%D1%80_%D0%91%D0%B5%D1%80%D0%BA%D1%83%D1%82_%282019%29.jpg/250px-%D0%9F%D0%BE%D1%81%D1%82%D0%B5%D1%80_%D1%84%D1%96%D0%BB%D1%8C%D0%BC%D1%83_%D0%97%D0%B0%D1%85%D0%B0%D1%80_%D0%91%D0%B5%D1%80%D0%BA%D1%83%D1%82_%282019%29.jpg" },
    { id: 4, title: "Лісова пісня", author: "Леся Українка", price: 250, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Lesya_Ukrainka_Monument_in_Lutsk.jpg/220px-Lesya_Ukrainka_Monument_in_Lutsk.jpg" },
    { id: 5, title: "Кайдашева сім'я", author: "Іван Нечуй-Левицький", price: 220, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Nechuy-Levytsky_Ivan.jpg/220px-Nechuy-Levytsky_Ivan.jpg" }
];

// Вибираємо елементи з DOM
const bookContainer = document.getElementById('book-container');
const cartContainer = document.getElementById('cart-items-container');
const cartTotalElement = document.getElementById('cart-total');
const emptyCartMsg = document.getElementById('empty-cart-msg');

let cart = []; // Масив для зберігання товарів у кошику

// --- ЗАВДАННЯ 1: Генерація списку книг через цикл for ---
function renderBooks() {
    // Очищаємо контейнер
    bookContainer.innerHTML = '';

    // Перемішуємо масив книг випадковим чином (щоб список змінювався при оновленні)
    // Це виконує вимогу "список змінюється при оновленні сторінки"
    const randomBooks = allBooks.sort(() => 0.5 - Math.random());

    // Цикл for для проходу по книгах
    for (let i = 0; i < randomBooks.length; i++) {
        const book = randomBooks[i];

        // Створюємо HTML картки книги
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

// --- ЗАВДАННЯ 2: Додавання до кошика та зміна кнопки ---
function addToCart(bookId, buttonElement) {
    // Знаходимо книгу в базі
    const book = allBooks.find(b => b.id === bookId);
    
    // Перевіряємо, чи є вже книга в кошику
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...book, quantity: 1 });
    }

    // Змінюємо стиль кнопки (Вимога варіанту)
    buttonElement.textContent = "У кошику";
    buttonElement.style.backgroundColor = "#27ae60"; // Зелений колір
    buttonElement.style.transform = "scale(0.95)";
    setTimeout(() => {
        buttonElement.style.transform = "scale(1)";
    }, 100);

    renderCart();
}

// --- ЗАВДАННЯ 3: Відображення кошика та підрахунок суми ---
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

    // Цикл для генерації елементів кошика
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

    // Оновлення загальної суми
    cartTotalElement.innerText = totalSum;
}

// Функція зміни кількості (+/-)
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

// Функція видалення товару
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

// Запускаємо генерацію книг при завантаженні сторінки
renderBooks();