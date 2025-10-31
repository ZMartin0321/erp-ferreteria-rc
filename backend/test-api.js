// Script de pruebas de endpoints usando fetch nativo de Node.js
const API_URL = "http://localhost:4000/api";
let authToken = "";
let testProductId = null;
let testSaleId = null;
let testPurchaseId = null;
let testSupplierId = null;
let testCategoryId = null;

// Colores para consola
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(emoji, message, color = colors.reset) {
  console.log(`${color}${emoji} ${message}${colors.reset}`);
}

function success(message) {
  log("✅", message, colors.green);
}

function error(message) {
  log("❌", message, colors.red);
}

function info(message) {
  log("📋", message, colors.cyan);
}

function section(message) {
  console.log("\n" + colors.magenta + "═".repeat(60) + colors.reset);
  log("🎯", message, colors.magenta);
  console.log(colors.magenta + "═".repeat(60) + colors.reset + "\n");
}

// Helper para hacer peticiones
async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  if (contentType && contentType.includes("application/pdf")) {
    return await response.arrayBuffer();
  }
  return await response.text();
}

async function testEndpoint(name, testFn) {
  try {
    await testFn();
    success(`${name} - PASSED`);
    return true;
  } catch (err) {
    error(`${name} - FAILED: ${err.message}`);
    return false;
  }
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  console.log(
    "\n" +
      colors.blue +
      "🚀 INICIANDO PRUEBAS DE ENDPOINTS - ERP FERRETERÍA RC" +
      colors.reset
  );
  console.log(colors.blue + "━".repeat(60) + colors.reset + "\n");

  // ==================== AUTH ====================
  section("MÓDULO DE AUTENTICACIÓN");

  (await testEndpoint("POST /auth/login - Iniciar sesión", async () => {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "admin@erp.com",
        password: "admin123",
      }),
    });
    authToken = data.token;
    info(`Token obtenido: ${authToken.substring(0, 30)}...`);
  }))
    ? passed++
    : failed++;

  // ==================== CATEGORIES ====================
  section("MÓDULO DE CATEGORÍAS");

  (await testEndpoint("GET /categories - Listar categorías", async () => {
    const data = await request("/categories");
    info(`Categorías encontradas: ${data.length}`);
    if (data.length > 0) {
      info(`Primera categoría: ${data[0].name}`);
    }
  }))
    ? passed++
    : failed++;

  (await testEndpoint("POST /categories - Crear categoría", async () => {
    const data = await request("/categories", {
      method: "POST",
      body: JSON.stringify({
        name: `Categoría Test ${Date.now()}`,
        description: "Test description",
      }),
    });
    testCategoryId = data.id;
    info(`Categoría creada con ID: ${testCategoryId}`);
  }))
    ? passed++
    : failed++;

  (await testEndpoint(
    "GET /categories/:id - Obtener categoría por ID",
    async () => {
      const data = await request(`/categories/${testCategoryId}`);
      info(`Categoría obtenida: ${data.name}`);
    }
  ))
    ? passed++
    : failed++;

  (await testEndpoint(
    "PUT /categories/:id - Actualizar categoría",
    async () => {
      const data = await request(`/categories/${testCategoryId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: "Categoría Actualizada",
          description: "Updated",
        }),
      });
      info(`Categoría actualizada: ${data.name}`);
    }
  ))
    ? passed++
    : failed++;

  // ==================== PRODUCTS ====================
  section("MÓDULO DE PRODUCTOS");

  (await testEndpoint("GET /products - Listar productos", async () => {
    const data = await request("/products");
    info(`Productos encontrados: ${data.length}`);
    if (data.length > 0) {
      testProductId = data[0].id;
      info(`Primer producto: ${data[0].name} (ID: ${testProductId})`);
    }
  }))
    ? passed++
    : failed++;

  (await testEndpoint("POST /products - Crear producto", async () => {
    const data = await request("/products", {
      method: "POST",
      body: JSON.stringify({
        name: "Producto Test",
        description: "Test product",
        sku: `SKU-${Date.now()}`,
        price: 99.99,
        stock: 100,
        categoryId: testCategoryId,
      }),
    });
    testProductId = data.id;
    info(`Producto creado con ID: ${testProductId}, Stock: ${data.stock}`);
  }))
    ? passed++
    : failed++;

  (await testEndpoint(
    "GET /products/:id - Obtener producto por ID",
    async () => {
      const data = await request(`/products/${testProductId}`);
      info(`Producto: ${data.name}, Precio: $${data.price}`);
    }
  ))
    ? passed++
    : failed++;

  (await testEndpoint("PUT /products/:id - Actualizar producto", async () => {
    const data = await request(`/products/${testProductId}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "Producto Actualizado",
        price: 149.99,
        stock: 150,
      }),
    });
    info(`Producto actualizado: ${data.name}, Precio: $${data.price}`);
  }))
    ? passed++
    : failed++;

  (await testEndpoint(
    "GET /products/low-stock - Productos con stock bajo",
    async () => {
      const data = await request("/products/low-stock");
      info(`Productos con stock bajo: ${data.length}`);
    }
  ))
    ? passed++
    : failed++;

  // ==================== SUPPLIERS ====================
  section("MÓDULO DE PROVEEDORES");

  (await testEndpoint("GET /suppliers - Listar proveedores", async () => {
    const data = await request("/suppliers");
    info(`Proveedores encontrados: ${data.length}`);
    if (data.length > 0) {
      testSupplierId = data[0].id;
      info(`Primer proveedor: ${data[0].name}`);
    }
  }))
    ? passed++
    : failed++;

  (await testEndpoint("POST /suppliers - Crear proveedor", async () => {
    const data = await request("/suppliers", {
      method: "POST",
      body: JSON.stringify({
        name: "Proveedor Test",
        contact: "Juan Pérez",
        email: `supplier${Date.now()}@test.com`,
        phone: "1234567890",
      }),
    });
    testSupplierId = data.id;
    info(`Proveedor creado con ID: ${testSupplierId}`);
  }))
    ? passed++
    : failed++;

  (await testEndpoint(
    "GET /suppliers/:id - Obtener proveedor por ID",
    async () => {
      const data = await request(`/suppliers/${testSupplierId}`);
      info(`Proveedor: ${data.name}`);
    }
  ))
    ? passed++
    : failed++;

  (await testEndpoint("PUT /suppliers/:id - Actualizar proveedor", async () => {
    const data = await request(`/suppliers/${testSupplierId}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "Proveedor Actualizado",
        contact: "María García",
      }),
    });
    info(`Proveedor actualizado: ${data.name}`);
  }))
    ? passed++
    : failed++;

  // ==================== PURCHASES ====================
  section("MÓDULO DE COMPRAS");

  (await testEndpoint("POST /purchases - Crear compra", async () => {
    const data = await request("/purchases", {
      method: "POST",
      body: JSON.stringify({
        supplierId: testSupplierId,
        items: [
          {
            productId: testProductId,
            quantity: 10,
            unitPrice: 50,
          },
        ],
      }),
    });
    testPurchaseId = data.id;
    info(`Compra creada con ID: ${testPurchaseId}, Total: $${data.total}`);
  }))
    ? passed++
    : failed++;

  (await testEndpoint("GET /purchases - Listar compras", async () => {
    const data = await request("/purchases");
    info(`Compras encontradas: ${data.length}`);
  }))
    ? passed++
    : failed++;

  (await testEndpoint(
    "GET /purchases/:id - Obtener compra por ID",
    async () => {
      const data = await request(`/purchases/${testPurchaseId}`);
      info(`Compra: ID ${data.id}, Estado: ${data.status}`);
    }
  ))
    ? passed++
    : failed++;

  (await testEndpoint(
    "POST /purchases/:id/receive - Recibir compra",
    async () => {
      const data = await request(`/purchases/${testPurchaseId}/receive`, {
        method: "POST",
      });
      info(`Compra recibida, estado: ${data.status}`);
    }
  ))
    ? passed++
    : failed++;

  // ==================== SALES ====================
  section("MÓDULO DE VENTAS");

  (await testEndpoint("POST /sales - Crear venta", async () => {
    const data = await request("/sales", {
      method: "POST",
      body: JSON.stringify({
        clientName: "Cliente Test",
        items: [
          {
            productId: testProductId,
            quantity: 2,
            unitPrice: 149.99,
          },
        ],
      }),
    });
    testSaleId = data.id;
    info(`Venta creada con ID: ${testSaleId}, Total: $${data.total}`);
  }))
    ? passed++
    : failed++;

  (await testEndpoint("GET /sales - Listar ventas", async () => {
    const data = await request("/sales");
    info(`Ventas encontradas: ${data.length}`);
  }))
    ? passed++
    : failed++;

  (await testEndpoint("GET /sales/:id - Obtener venta por ID", async () => {
    const data = await request(`/sales/${testSaleId}`);
    info(`Venta: Cliente ${data.clientName}, Total: $${data.total}`);
  }))
    ? passed++
    : failed++;

  (await testEndpoint(
    "POST /sales/:id/paid - Marcar venta como pagada",
    async () => {
      const data = await request(`/sales/${testSaleId}/paid`, {
        method: "POST",
      });
      info(`Venta pagada, estado: ${data.status}`);
    }
  ))
    ? passed++
    : failed++;

  // ==================== REPORTS ====================
  section("MÓDULO DE REPORTES");

  (await testEndpoint(
    "GET /reports/dashboard - Datos del dashboard",
    async () => {
      const data = await request("/reports/dashboard");
      info(
        `KPIs: ${data.productsCount} productos, ${data.salesCount} ventas, ${data.purchasesCount} compras`
      );
    }
  ))
    ? passed++
    : failed++;

  (await testEndpoint(
    "GET /reports/invoice/:id - Generar factura PDF",
    async () => {
      const data = await request(`/reports/invoice/${testSaleId}`);
      const pdfSize = data.byteLength || data.length;
      info(`PDF generado, tamaño: ${pdfSize} bytes`);
    }
  ))
    ? passed++
    : failed++;

  (await testEndpoint(
    "GET /reports/sales - Reporte de ventas PDF",
    async () => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();

      const data = await request(
        `/reports/sales?startDate=${
          startDate.toISOString().split("T")[0]
        }&endDate=${endDate.toISOString().split("T")[0]}`
      );
      const pdfSize = data.byteLength || data.length;
      info(`Reporte generado, tamaño: ${pdfSize} bytes`);
    }
  ))
    ? passed++
    : failed++;

  // ==================== CLEANUP ====================
  section("LIMPIEZA - ELIMINAR DATOS DE PRUEBA");

  (await testEndpoint("DELETE /sales/:id - Eliminar venta", async () => {
    await request(`/sales/${testSaleId}`, { method: "DELETE" });
    info(`Venta ${testSaleId} eliminada`);
  }))
    ? passed++
    : failed++;

  (await testEndpoint("DELETE /purchases/:id - Eliminar compra", async () => {
    await request(`/purchases/${testPurchaseId}`, { method: "DELETE" });
    info(`Compra ${testPurchaseId} eliminada`);
  }))
    ? passed++
    : failed++;

  (await testEndpoint("DELETE /products/:id - Eliminar producto", async () => {
    await request(`/products/${testProductId}`, { method: "DELETE" });
    info(`Producto ${testProductId} eliminado`);
  }))
    ? passed++
    : failed++;

  (await testEndpoint(
    "DELETE /suppliers/:id - Eliminar proveedor",
    async () => {
      await request(`/suppliers/${testSupplierId}`, { method: "DELETE" });
      info(`Proveedor ${testSupplierId} eliminado`);
    }
  ))
    ? passed++
    : failed++;

  (await testEndpoint(
    "DELETE /categories/:id - Eliminar categoría",
    async () => {
      await request(`/categories/${testCategoryId}`, { method: "DELETE" });
      info(`Categoría ${testCategoryId} eliminada`);
    }
  ))
    ? passed++
    : failed++;

  // ==================== RESULTS ====================
  console.log("\n" + colors.blue + "━".repeat(60) + colors.reset);
  console.log(colors.blue + "📊 RESULTADOS FINALES" + colors.reset);
  console.log(colors.blue + "━".repeat(60) + colors.reset + "\n");

  const total = passed + failed;
  const percentage = ((passed / total) * 100).toFixed(2);

  console.log(`${colors.green}✅ Pruebas exitosas: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ Pruebas fallidas: ${failed}${colors.reset}`);
  console.log(`${colors.cyan}📈 Total: ${total}${colors.reset}`);
  console.log(`${colors.magenta}🎯 Éxito: ${percentage}%${colors.reset}\n`);

  if (failed === 0) {
    console.log(
      colors.green +
        "🎉 ¡TODOS LOS ENDPOINTS FUNCIONAN PERFECTAMENTE! 🎉" +
        colors.reset +
        "\n"
    );
  } else {
    console.log(
      colors.yellow + "⚠️  Algunos endpoints fallaron" + colors.reset + "\n"
    );
  }
}

runTests().catch((err) => {
  console.error(colors.red + "💥 Error fatal:" + colors.reset, err.message);
  process.exit(1);
});
