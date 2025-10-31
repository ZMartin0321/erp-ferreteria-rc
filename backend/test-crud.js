const axios = require("axios");

const BASE_URL = "http://localhost:4000/api";
let token = "";

async function login() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: "admin@ferreteria.com",
      password: "admin123",
    });
    token = response.data.token;
    console.log("✅ LOGIN exitoso");
    console.log("Token:", token.substring(0, 20) + "...");
    return true;
  } catch (error) {
    console.error(
      "❌ LOGIN falló:",
      error.response?.data?.message || error.message
    );
    return false;
  }
}

async function testProducts() {
  console.log("\n📦 PROBANDO PRODUCTOS...");

  try {
    // Listar productos
    const list = await axios.get(`${BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(
      `✅ Listar productos: ${list.data.length} productos encontrados`
    );

    // Crear producto
    const newProduct = await axios.post(
      `${BASE_URL}/products`,
      {
        name: "Producto Test",
        sku: "TEST-001",
        description: "Producto de prueba",
        price: 10.5,
        stock: 100,
        categoryId: 1,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(`✅ Crear producto: ID ${newProduct.data.id}`);

    const productId = newProduct.data.id;

    // Actualizar producto
    await axios.put(
      `${BASE_URL}/products/${productId}`,
      {
        name: "Producto Test Actualizado",
        sku: "TEST-001",
        description: "Producto actualizado",
        price: 15.75,
        stock: 150,
        categoryId: 1,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(`✅ Actualizar producto: ID ${productId}`);

    // Eliminar producto
    await axios.delete(`${BASE_URL}/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ Eliminar producto: ID ${productId}`);
  } catch (error) {
    console.error(
      "❌ Error en productos:",
      error.response?.data?.message || error.message
    );
  }
}

async function testSales() {
  console.log("\n💰 PROBANDO VENTAS...");

  try {
    // Listar ventas
    const list = await axios.get(`${BASE_URL}/sales`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ Listar ventas: ${list.data.length} ventas encontradas`);

    // Crear venta
    const newSale = await axios.post(
      `${BASE_URL}/sales`,
      {
        clientName: "Cliente Test",
        status: "draft",
        items: [
          { productId: 1, quantity: 2, unitPrice: 12.5, discount: 0, tax: 0 },
        ],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(`✅ Crear venta: ID ${newSale.data.id}`);

    const saleId = newSale.data.id;

    // Actualizar venta
    await axios.put(
      `${BASE_URL}/sales/${saleId}`,
      {
        clientName: "Cliente Test Actualizado",
        status: "draft",
        items: [
          { productId: 1, quantity: 3, unitPrice: 12.5, discount: 0, tax: 0 },
        ],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(`✅ Actualizar venta: ID ${saleId}`);

    // Eliminar venta
    await axios.delete(`${BASE_URL}/sales/${saleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ Eliminar venta: ID ${saleId}`);
  } catch (error) {
    console.error(
      "❌ Error en ventas:",
      error.response?.data?.message || error.message
    );
  }
}

async function testPurchases() {
  console.log("\n🛒 PROBANDO COMPRAS...");

  try {
    // Listar compras
    const list = await axios.get(`${BASE_URL}/purchases`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ Listar compras: ${list.data.length} compras encontradas`);

    // Crear compra
    const newPurchase = await axios.post(
      `${BASE_URL}/purchases`,
      {
        supplierId: 1,
        status: "pending",
        items: [{ productId: 1, quantity: 10, unitPrice: 10.0 }],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(`✅ Crear compra: ID ${newPurchase.data.id}`);

    const purchaseId = newPurchase.data.id;

    // Actualizar compra
    await axios.put(
      `${BASE_URL}/purchases/${purchaseId}`,
      {
        supplierId: 1,
        status: "pending",
        items: [{ productId: 1, quantity: 15, unitPrice: 9.5 }],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(`✅ Actualizar compra: ID ${purchaseId}`);

    // Eliminar compra
    await axios.delete(`${BASE_URL}/purchases/${purchaseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ Eliminar compra: ID ${purchaseId}`);
  } catch (error) {
    console.error(
      "❌ Error en compras:",
      error.response?.data?.message || error.message
    );
  }
}

async function runTests() {
  console.log("🚀 INICIANDO PRUEBAS DE CRUD...\n");

  const loggedIn = await login();
  if (!loggedIn) {
    console.log(
      "\n❌ No se pudo hacer login. Verifica que el usuario admin@ferreteria.com existe."
    );
    return;
  }

  await testProducts();
  await testSales();
  await testPurchases();

  console.log("\n✅ TODAS LAS PRUEBAS COMPLETADAS\n");
}

runTests();
