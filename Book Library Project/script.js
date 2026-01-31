
let books = [];  
let cart = [];


document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    renderBooks();
    updateCartCount();
});

function loadBooks() {

    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            books = data;
            renderBooks();
        })
        .catch(error => {
            console.error('Error loading books:', error);
        });
}

function renderBooks(booksToShow = books) {
    const grid = document.getElementById('books-grid');
    grid.innerHTML = '';
    
    if (booksToShow.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6c757d;">No books found. Try different keywords!</div>';
        return;
    }
    
    booksToShow.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <img src="${book.img}" alt="${book.title}" class="book-image" 
                 onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80'">
            <div class="book-title">${book.title}</div>
            <div class="book-details">${book.details}</div>
            <div class="book-price">₹${book.price}</div>
            <div class="book-buttons">
                <button class="buy-now" onclick="buyNow(${book.id})">Buy Now</button>
                <button class="add-cart" onclick="addToCart(${book.id})">Add to Cart</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function searchBooks() {
    const query = document.getElementById('search').value.toLowerCase();
    const filtered = books.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.details.toLowerCase().includes(query)
    );
    renderBooks(filtered);
}

function addToCart(id) {
    const book = books.find(b => b.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        book.quantity = 1;
        cart.push(book);
    }
    updateCartCount();
    alert(`${book.title} added to cart!`);
}

function buyNow(id) {
    const book = books.find(b => b.id === id);
    alert(`Thank you for buying "${book.title}" for ₹${book.price}!`);
}

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.getElementById('cart-count').textContent = total;
}

function showBooks() {
    document.getElementById('books-page').style.display = 'block';
    document.getElementById('cart-page').style.display = 'none';
    renderBooks();
}

function showCart() {
    document.getElementById('books-page').style.display = 'none';
    document.getElementById('cart-page').style.display = 'block';
    
    const cartDiv = document.getElementById('cart-items');
    const totalDiv = document.getElementById('cart-total');
    const emptyDiv = document.getElementById('empty-cart');
    
    if (cart.length === 0) {
        totalDiv.style.display = 'none';
        emptyDiv.style.display = 'block';
        return;
    }
    
    emptyDiv.style.display = 'none';
    cartDiv.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const qty = item.quantity || 1;
        const itemTotal = item.price * qty;
        total += itemTotal;
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <strong>${item.title}</strong>
                <div style="color: #6c757d; font-size: 14px;">₹${item.price} × ${qty}</div>
            </div>
            <div>
                <strong>₹${itemTotal}</strong>
                <button onclick="removeFromCart(${item.id})" style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 10px;">Remove</button>
            </div>
        `;
        cartDiv.appendChild(div);
    });
    
    totalDiv.textContent = `Total: ₹${total}`;
    totalDiv.style.display = 'block';
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    showCart();
}
