const API_URL = 'http://localhost:5000/api';

function checkAuth() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const loginLink = document.getElementById('loginLink');
  const logoutLink = document.getElementById('logoutLink');
  const addProductLink = document.getElementById('addProductLink');
  const followingLink = document.getElementById('followingLink');

  if (token) {
    loginLink.style.display = 'none';
    logoutLink.style.display = 'inline';
    if (role === 'seller') {
      addProductLink.style.display = 'inline';
    }
    if (role === 'user') {
      followingLink.style.display = 'inline';
    }
  } else {
    loginLink.style.display = 'inline';
    logoutLink.style.display = 'none';
    addProductLink.style.display = 'none';
    followingLink.style.display = 'none';
    window.location.href = 'login.html';
  }
}

async function login(data) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('role', result.user.role);
      alert('Login successful');
      window.location.href = 'index.html';
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function register(data) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('role', result.user.role);
      alert('Account created successfully');
      window.location.href = 'index.html';
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.href = 'login.html';
}

async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const result = await response.json();
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = '';
    result.products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image || 'default.png'}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Category: ${product.category}</p>
        <p>Seller: ${product.seller.username}</p>
      `;
      productsContainer.appendChild(productCard);
    });
  } catch (error) {
    alert('Error fetching products: ' + error.message);
  }
}

// Search for products
async function searchProducts() {
  const searchQuery = document.getElementById('searchInput').value;
  try {
    const response = await fetch(`${API_URL}/products?search=${searchQuery}`);
    const result = await response.json();
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = '';
    result.products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image || 'default.png'}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Category: ${product.category}</p>
        <p>Seller: ${product.seller.username}</p>
      `;
      productsContainer.appendChild(productCard);
    });
  } catch (error) {
    alert('Error during search: ' + error.message);
  }
}

async function addProduct(formData) {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    });
    const result = await response.json();
    if (response.ok) {
      alert('Product added successfully');
      window.location.href = 'index.html';
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert('Error adding product: ' + error.message);
  }
}

async function followSeller(sellerId) {
  try {
    const response = await fetch(`${API_URL}/users/follow/${sellerId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    const result = await response.json();
    if (response.ok) {
      alert('Seller followed successfully');
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert('Error following seller: ' + error.message);
  }
}

async function fetchFollowingProducts() {
  try {
    const response = await fetch(`${API_URL}/users/following-products`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    const result = await response.json();
    const productsContainer = document.getElementById('followingProductsContainer');
    productsContainer.innerHTML = '';
    if (result.products.length === 0) {
      productsContainer.innerHTML = '<p>No products available from followed sellers</p>';
      return;
    }
    result.products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image || 'default.png'}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Category: ${product.category}</p>
        <p>Seller: ${product.seller.username}</p>
      `;
      productsContainer.appendChild(productCard);
    });
  } catch (error) {
    alert('Error fetching products: ' + error.message);
  }
}