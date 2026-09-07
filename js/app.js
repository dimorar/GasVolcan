function renderCatalog() {
    const container = document.getElementById('product-list');
    if (!container) return;

    const products = JSON.parse(localStorage.getItem('products')) || [];
    container.innerHTML = '';

    products.forEach(p => {
        container.innerHTML += `
            <div class="product-card">
                <h3>${p.name}</h3>
                <p><strong>$${p.price.toLocaleString('es-CL')}</strong></p>
                <button class="btn" onclick="addToCart('${p.id}')">Agregar al Carrito</button>
            </div>
        `;
    });
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}
function calculateTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    let total = 0;

    cart.forEach(id => {
        const prod = products.find(p => p.id === id);
        if (prod) total += prod.price;
    });

    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.innerText = total.toLocaleString('es-CL');
}
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = cart.length;
    calculateTotal();
}
