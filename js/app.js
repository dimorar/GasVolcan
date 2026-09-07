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