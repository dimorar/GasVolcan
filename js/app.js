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
function cargarComunas() {
    const selectComuna = document.getElementById('reg-comuna');
    if (!selectComuna) return;

    const comunas = ['Macul', 'Santiago', 'Providencia', 'La Florida', 'Peñalolén'];
    selectComuna.innerHTML = '<option value="">Seleccione Comuna</option>';
    comunas.forEach(c => {
        selectComuna.innerHTML += `<option value="${c}">${c}</option>`;
    });
}
function initRegisterValidation() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const rut = document.getElementById('reg-rut').value;
        const email = document.getElementById('reg-email').value;

        if (!validarRut(rut)) {
            alert('RUN inválido. Verifique el formato.');
            return;
        }
        if (!validarCorreo(email)) {
            alert('Correo debe pertenecer a @duoc.cl, @profesor.duoc.cl o @gmail.com');
            return;
        }
        alert('Registro exitoso.');
    });
}
function initContactValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Mensaje enviado con éxito. Nos pondremos en contacto pronto.');
        form.reset();
    });
}
function initLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
    });
}
function renderAdminTable() {
    const tbody = document.getElementById('admin-product-list');
    if (!tbody) return;

    const products = JSON.parse(localStorage.getItem('products')) || [];
    tbody.innerHTML = '';

    products.forEach(p => {
        const isCritical = p.stock <= p.stockCritico;
        tbody.innerHTML += `
            <tr class="${isCritical ? 'stock-critical' : ''}">
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>$${p.price.toLocaleString('es-CL')}</td>
                <td>${p.stock}</td>
                <td>${isCritical ? '⚠️ CRÍTICO' : 'OK'}</td>
            </tr>
        `;
    });
}
