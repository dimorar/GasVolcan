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
function updateStock(productId, newStock) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.map(p => p.id === productId ? { ...p, stock: newStock } : p);
    localStorage.setItem('products', JSON.stringify(products));
    renderAdminTable();
}
function checkRoleAccess(userRole) {
    const adminNav = document.getElementById('nav-admin');
    if (adminNav && userRole !== 'Admin') {
        adminNav.classList.add('hidden');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
    renderAdminTable();
    updateCartCount();
    cargarComunas();
    initRegisterValidation();
    initContactValidation();
    initLogin();
});
console.log('GasVolcan App iniciada correctamente.');
window.addEventListener('beforeunload', () => {});
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify([
        { id: 'G-05', name: 'Gas 5Kg', price: 10500, stock: 15, img: 'https://via.placeholder.com/150/004b87/ffffff?text=Gas+5Kg' },
        { id: 'G-11', name: 'Gas 11Kg', price: 16800, stock: 3, img: 'https://via.placeholder.com/150/004b87/ffffff?text=Gas+11Kg' },
        { id: 'G-15', name: 'Gas 15Kg', price: 21500, stock: 20, img: 'https://via.placeholder.com/150/004b87/ffffff?text=Gas+15Kg' },
        { id: 'G-45', name: 'Gas 45Kg', price: 62000, stock: 2, img: 'https://via.placeholder.com/150/004b87/ffffff?text=Gas+45Kg' }
    ]));
}
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
        { id: 1, rut: '12345678-K', nombre: 'Admin Sistema', email: 'admin@duoc.cl' }
    ]));
}
function renderProductos() {
    const contenedor = document.getElementById('product-list');
    if (!contenedor) return;
    const productos = JSON.parse(localStorage.getItem('products')) || [];

    contenedor.innerHTML = productos.map(p => `
        <div class="product-card" style="border:1px solid #ccc; padding:10px; margin:10px; text-align:center;">
            <img src="${p.img}" alt="${p.name}" style="width:120px; height:auto;">
            <h3>${p.name}</h3>
            <p>Precio: $${p.price.toLocaleString('es-CL')} | <strong>Stock: ${p.stock}</strong></p>
            <input type="number" id="cant-${p.id}" value="1" min="1" max="${p.stock}" style="width:50px;">
            <button onclick="agregarAlCarrito('${p.id}')" ${p.stock === 0 ? 'disabled' : ''}>
                ${p.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
            </button>
        </div>
    `).join('');
}
function agregarAlCarrito(id) {
    const productos = JSON.parse(localStorage.getItem('products')) || [];
    let carrito = JSON.parse(localStorage.getItem('cart')) || [];
    const prod = productos.find(p => p.id === id);
    const cantidadDeseada = parseInt(document.getElementById(`cant-${id}`).value) || 1;

    const enCarrito = carrito.filter(item => item === id).length;

    if (enCarrito + cantidadDeseada > prod.stock) {
        alert(`No puedes agregar más. El límite en stock es de ${prod.stock} unidades.`);
        return;
    }

    for (let i = 0; i < cantidadDeseada; i++) {
        carrito.push(id);
    }

    localStorage.setItem('cart', JSON.stringify(carrito));
    actualizarCarrito();
}
function actualizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('cart')) || [];
    const productos = JSON.parse(localStorage.getItem('products')) || [];
    const tabla = document.getElementById('cart-items-body');
    const totalEl = document.getElementById('cart-total');

    if (document.getElementById('cart-count')) {
        document.getElementById('cart-count').innerText = carrito.length;
    }

    if (!tabla) return;

    // Contar duplicados
    const resumen = {};
    carrito.forEach(id => resumen[id] = (resumen[id] || 0) + 1);

    let total = 0;
    tabla.innerHTML = Object.keys(resumen).map(id => {
        const p = productos.find(item => item.id === id);
        const cant = resumen[id];
        const subtotal = p.price * cant;
        total += subtotal;

        return `
            <tr>
                <td>${p.name}</td>
                <td>$${p.price.toLocaleString('es-CL')}</td>
                <td>
                    <button onclick="modificarCantidad('${id}', -1)">-</button>
                    ${cant}
                    <button onclick="modificarCantidad('${id}', 1)">+</button>
                </td>
                <td>$${subtotal.toLocaleString('es-CL')}</td>
                <td><button onclick="eliminarDelCarrito('${id}')">Quitar</button></td>
            </tr>
        `;
    }).join('');

    if (totalEl) totalEl.innerText = total.toLocaleString('es-CL');
}
function modificarCantidad(id, cambio) {
    let carrito = JSON.parse(localStorage.getItem('cart')) || [];
    const prod = JSON.parse(localStorage.getItem('products')).find(p => p.id === id);

    if (cambio === 1) {
        const enCarrito = carrito.filter(item => item === id).length;
        if (enCarrito + 1 > prod.stock) {
            alert(`Alcanzaste el tope máximo de stock (${prod.stock})`);
            return;
        }
        carrito.push(id);
    } else {
        const index = carrito.indexOf(id);
        if (index !== -1) carrito.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(carrito));
    actualizarCarrito();
}
function eliminarDelCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem('cart')) || [];
    carrito = carrito.filter(item => item !== id);
    localStorage.setItem('cart', JSON.stringify(carrito));
    actualizarCarrito();
}
