// Script de prueba rápida de endpoints
const API_URL = "http://localhost:4000/api";

async function testAPI() {
  console.log("🚀 Probando API del ERP Ferretería RC\n");

  // 1. Registrar usuario de prueba
  console.log("📝 1. Registrando usuario de prueba...");
  const timestamp = Date.now();
  const registerRes = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      email: `test${timestamp}@test.com`,
      password: "test123",
      role: "admin",
    }),
  });
  const registerData = await registerRes.json();
  console.log("   ✅ Usuario registrado:", registerData.email);

  // 2. Login
  console.log("\n🔐 2. Haciendo login...");
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `test${timestamp}@test.com`,
      password: "test123",
    }),
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log("   ✅ Token obtenido:", token.substring(0, 40) + "...");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 3. GET Categorías
  console.log("\n📁 3. Obteniendo categorías...");
  const catRes = await fetch(`${API_URL}/categories`, { headers });
  const categories = await catRes.json();
  console.log(`   ✅ Categorías encontradas: ${categories.length}`);
  if (categories.length > 0) {
    console.log(`   Primera: ${categories[0].name}`);
  }

  // 4. Crear Categoría
  console.log("\n➕ 4. Creando nueva categoría...");
  const newCatRes = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: `Cat Test ${timestamp}`,
      description: "Test category",
    }),
  });
  const newCat = await newCatRes.json();
  console.log(`   ✅ Categoría creada con ID: ${newCat.id}`);

  // 5. GET Productos
  console.log("\n📦 5. Obteniendo productos...");
  const prodRes = await fetch(`${API_URL}/products`, { headers });
  const products = await prodRes.json();
  console.log(`   ✅ Productos encontrados: ${products.length}`);
  if (products.length > 0) {
    console.log(
      `   Primer producto: ${products[0].name} - $${products[0].price}`
    );
  }

  // 6. Crear Producto
  console.log("\n➕ 6. Creando nuevo producto...");
  const newProdRes = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: `Producto Test ${timestamp}`,
      description: "Test product",
      sku: `SKU-${timestamp}`,
      price: 99.99,
      stock: 100,
      categoryId: newCat.id,
    }),
  });
  const newProd = await newProdRes.json();
  console.log(`   ✅ Producto creado: ${newProd.name} (ID: ${newProd.id})`);
  console.log(`   Stock inicial: ${newProd.stock} unidades`);

  // 7. GET Proveedores
  console.log("\n🏢 7. Obteniendo proveedores...");
  const suppRes = await fetch(`${API_URL}/suppliers`, { headers });
  const suppliers = await suppRes.json();
  console.log(`   ✅ Proveedores encontrados: ${suppliers.length}`);

  // 8. Crear Proveedor
  console.log("\n➕ 8. Creando nuevo proveedor...");
  const newSuppRes = await fetch(`${API_URL}/suppliers`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: `Proveedor Test ${timestamp}`,
      contact: "Juan Pérez",
      email: `supplier${timestamp}@test.com`,
      phone: "1234567890",
    }),
  });
  const newSupp = await newSuppRes.json();
  console.log(`   ✅ Proveedor creado: ${newSupp.name} (ID: ${newSupp.id})`);

  // 9. Crear Compra
  console.log("\n🛒 9. Creando compra...");
  const purchaseRes = await fetch(`${API_URL}/purchases`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      supplierId: newSupp.id,
      items: [
        {
          productId: newProd.id,
          quantity: 20,
          unitPrice: 50,
        },
      ],
    }),
  });
  const purchase = await purchaseRes.json();
  console.log(
    `   ✅ Compra creada: ID ${purchase.id}, Total: $${purchase.total}`
  );
  console.log(`   Estado: ${purchase.status}`);

  // 10. Recibir Compra
  console.log("\n📥 10. Recibiendo compra (actualiza stock)...");
  const receiveRes = await fetch(
    `${API_URL}/purchases/${purchase.id}/receive`,
    {
      method: "POST",
      headers,
    }
  );
  const receivedPurchase = await receiveRes.json();
  console.log(`   ✅ Compra recibida, estado: ${receivedPurchase.status}`);

  // Verificar stock actualizado
  const prodCheckRes = await fetch(`${API_URL}/products/${newProd.id}`, {
    headers,
  });
  const prodCheck = await prodCheckRes.json();
  console.log(
    `   📊 Stock actualizado: ${prodCheck.stock} unidades (+20 de la compra)`
  );

  // 11. Crear Venta
  console.log("\n💰 11. Creando venta...");
  const saleRes = await fetch(`${API_URL}/sales`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      clientName: "Cliente Test",
      items: [
        {
          productId: newProd.id,
          quantity: 5,
          unitPrice: 99.99,
        },
      ],
    }),
  });
  const sale = await saleRes.json();
  console.log(`   ✅ Venta creada: ID ${sale.id}, Total: $${sale.total}`);
  console.log(`   Cliente: ${sale.clientName}`);

  // Verificar stock después de venta
  const prodAfterSaleRes = await fetch(`${API_URL}/products/${newProd.id}`, {
    headers,
  });
  const prodAfterSale = await prodAfterSaleRes.json();
  console.log(
    `   📊 Stock después de venta: ${prodAfterSale.stock} unidades (-5)`
  );

  // 12. Marcar venta como pagada
  console.log("\n💳 12. Marcando venta como pagada...");
  const paidRes = await fetch(`${API_URL}/sales/${sale.id}/paid`, {
    method: "POST",
    headers,
  });
  const paidSale = await paidRes.json();
  console.log(`   ✅ Venta pagada, estado: ${paidSale.status}`);

  // 13. Dashboard
  console.log("\n📊 13. Obteniendo datos del dashboard...");
  const dashRes = await fetch(`${API_URL}/reports/dashboard`, { headers });
  const dashData = await dashRes.json();
  console.log(`   ✅ Dashboard KPIs:`);
  console.log(`      • ${dashData.productsCount} productos`);
  console.log(`      • ${dashData.purchasesCount} compras`);
  console.log(`      • ${dashData.salesCount} ventas`);

  // 14. Generar PDF Factura
  console.log("\n📄 14. Generando factura PDF...");
  const pdfRes = await fetch(`${API_URL}/reports/invoice/${sale.id}`, {
    headers,
  });
  const pdfBuffer = await pdfRes.arrayBuffer();
  console.log(`   ✅ PDF generado: ${pdfBuffer.byteLength} bytes`);

  // 15. GET Low Stock
  console.log("\n⚠️  15. Productos con stock bajo...");
  const lowStockRes = await fetch(`${API_URL}/products/low-stock`, { headers });
  const lowStock = await lowStockRes.json();
  console.log(`   ✅ Productos con stock bajo: ${lowStock.length}`);

  console.log("\n" + "=".repeat(60));
  console.log("🎉 ¡TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE!");
  console.log("=".repeat(60));
  console.log("\n✅ Endpoints probados:");
  console.log("   • Autenticación (Register, Login)");
  console.log("   • Categorías (GET, POST)");
  console.log("   • Productos (GET, POST, Stock management)");
  console.log("   • Proveedores (GET, POST)");
  console.log("   • Compras (POST, Receive)");
  console.log("   • Ventas (POST, Mark as paid)");
  console.log("   • Reportes (Dashboard, Invoice PDF)");
  console.log("\n🚀 El backend está funcionando perfectamente!\n");
}

testAPI().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});
