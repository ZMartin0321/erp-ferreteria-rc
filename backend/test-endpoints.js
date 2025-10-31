const API_URL = "http://localhost:4000/api";
let authToken = "";
let testUserId = null;
let testProductId = null;
let testSaleId = null;
let testPurchaseId = null;

// Helper function for fetch requests
async function makeRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.response = {
      status: response.status,
      data: await response.text(),
    };
    throw error;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else if (options.responseType === "arraybuffer") {
    return await response.arrayBuffer();
  }
  return await response.text();
}

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

async function testEndpoint(name, testFn) {
  try {
    await testFn();
    success(`${name} - PASSED`);
    return true;
  } catch (err) {
    error(`${name} - FAILED: ${err.message}`);
    if (err.response) {
      console.log("   Response:", err.response.status, err.response.data);
    }
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

  // ==================== AUTH ENDPOINTS ====================
  section("MÓDULO DE AUTENTICACIÓN");

  // Test 1: Register
  (await testEndpoint(
    "POST /auth/register - Crear usuario de prueba",
    async () => {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: "Test User",
        email: `test${Date.now()}@test.com`,
        password: "test123",
        role: "admin",
      });
      testUserId = response.data.id;
      info(`Usuario creado con ID: ${testUserId}`);
    }
  ))
    ? passed++
    : failed++;

  // Test 2: Login
  (await testEndpoint("POST /auth/login - Iniciar sesión", async () => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: "admin@erp.com",
      password: "admin123",
    });
    authToken = response.data.token;
    info(`Token obtenido: ${authToken.substring(0, 30)}...`);
  }))
    ? passed++
    : failed++;

  // Configurar token para próximas peticiones
  const axiosAuth = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${authToken}` },
  });

  // ==================== CATEGORIES ENDPOINTS ====================
  section("MÓDULO DE CATEGORÍAS");

  // Test 3: Get all categories
  (await testEndpoint("GET /categories - Listar categorías", async () => {
    const response = await axiosAuth.get("/categories");
    info(`Categorías encontradas: ${response.data.length}`);
    if (response.data.length > 0) {
      info(`Primera categoría: ${response.data[0].name}`);
    }
  }))
    ? passed++
    : failed++;

  // Test 4: Create category
  let testCategoryId;
  (await testEndpoint("POST /categories - Crear categoría", async () => {
    const response = await axiosAuth.post("/categories", {
      name: "Categoría Test",
      description: "Test description",
    });
    testCategoryId = response.data.id;
    info(`Categoría creada con ID: ${testCategoryId}`);
  }))
    ? passed++
    : failed++;

  // Test 5: Get category by ID
  (await testEndpoint(
    "GET /categories/:id - Obtener categoría por ID",
    async () => {
      const response = await axiosAuth.get(`/categories/${testCategoryId}`);
      info(`Categoría obtenida: ${response.data.name}`);
    }
  ))
    ? passed++
    : failed++;

  // Test 6: Update category
  (await testEndpoint(
    "PUT /categories/:id - Actualizar categoría",
    async () => {
      const response = await axiosAuth.put(`/categories/${testCategoryId}`, {
        name: "Categoría Actualizada",
        description: "Updated description",
      });
      info(`Categoría actualizada: ${response.data.name}`);
    }
  ))
    ? passed++
    : failed++;

  // ==================== PRODUCTS ENDPOINTS ====================
  section("MÓDULO DE PRODUCTOS");

  // Test 7: Get all products
  (await testEndpoint("GET /products - Listar productos", async () => {
    const response = await axiosAuth.get("/products");
    info(`Productos encontrados: ${response.data.length}`);
    if (response.data.length > 0) {
      testProductId = response.data[0].id;
      info(`Primer producto: ${response.data[0].name} (ID: ${testProductId})`);
    }
  }))
    ? passed++
    : failed++;

  // Test 8: Create product
  (await testEndpoint("POST /products - Crear producto", async () => {
    const response = await axiosAuth.post("/products", {
      name: "Producto Test",
      description: "Test product description",
      sku: `SKU-TEST-${Date.now()}`,
      price: 99.99,
      stock: 100,
      categoryId: testCategoryId,
    });
    testProductId = response.data.id;
    info(
      `Producto creado con ID: ${testProductId}, Stock: ${response.data.stock}`
    );
  }))
    ? passed++
    : failed++;

  // Test 9: Get product by ID
  (await testEndpoint(
    "GET /products/:id - Obtener producto por ID",
    async () => {
      const response = await axiosAuth.get(`/products/${testProductId}`);
      info(
        `Producto obtenido: ${response.data.name}, Precio: $${response.data.price}`
      );
    }
  ))
    ? passed++
    : failed++;

  // Test 10: Update product
  (await testEndpoint("PUT /products/:id - Actualizar producto", async () => {
    const response = await axiosAuth.put(`/products/${testProductId}`, {
      name: "Producto Actualizado",
      price: 149.99,
      stock: 150,
    });
    info(
      `Producto actualizado: ${response.data.name}, Nuevo precio: $${response.data.price}`
    );
  }))
    ? passed++
    : failed++;

  // Test 11: Get low stock products
  (await testEndpoint(
    "GET /products/low-stock - Productos con stock bajo",
    async () => {
      const response = await axiosAuth.get("/products/low-stock");
      info(`Productos con stock bajo: ${response.data.length}`);
    }
  ))
    ? passed++
    : failed++;

  // ==================== SUPPLIERS ENDPOINTS ====================
  section("MÓDULO DE PROVEEDORES");

  // Test 12: Get all suppliers
  let testSupplierId;
  (await testEndpoint("GET /suppliers - Listar proveedores", async () => {
    const response = await axiosAuth.get("/suppliers");
    info(`Proveedores encontrados: ${response.data.length}`);
    if (response.data.length > 0) {
      testSupplierId = response.data[0].id;
      info(`Primer proveedor: ${response.data[0].name}`);
    }
  }))
    ? passed++
    : failed++;

  // Test 13: Create supplier
  (await testEndpoint("POST /suppliers - Crear proveedor", async () => {
    const response = await axiosAuth.post("/suppliers", {
      name: "Proveedor Test",
      contact: "Juan Pérez",
      email: `supplier${Date.now()}@test.com`,
      phone: "1234567890",
    });
    testSupplierId = response.data.id;
    info(`Proveedor creado con ID: ${testSupplierId}`);
  }))
    ? passed++
    : failed++;

  // Test 14: Get supplier by ID
  (await testEndpoint(
    "GET /suppliers/:id - Obtener proveedor por ID",
    async () => {
      const response = await axiosAuth.get(`/suppliers/${testSupplierId}`);
      info(`Proveedor obtenido: ${response.data.name}`);
    }
  ))
    ? passed++
    : failed++;

  // Test 15: Update supplier
  (await testEndpoint("PUT /suppliers/:id - Actualizar proveedor", async () => {
    const response = await axiosAuth.put(`/suppliers/${testSupplierId}`, {
      name: "Proveedor Actualizado",
      contact: "María García",
    });
    info(`Proveedor actualizado: ${response.data.name}`);
  }))
    ? passed++
    : failed++;

  // ==================== PURCHASES ENDPOINTS ====================
  section("MÓDULO DE COMPRAS");

  // Test 16: Create purchase
  (await testEndpoint("POST /purchases - Crear compra", async () => {
    const response = await axiosAuth.post("/purchases", {
      supplierId: testSupplierId,
      items: [
        {
          productId: testProductId,
          quantity: 10,
          unitPrice: 50,
        },
      ],
    });
    testPurchaseId = response.data.id;
    info(
      `Compra creada con ID: ${testPurchaseId}, Total: $${response.data.total}`
    );
  }))
    ? passed++
    : failed++;

  // Test 17: Get all purchases
  (await testEndpoint("GET /purchases - Listar compras", async () => {
    const response = await axiosAuth.get("/purchases");
    info(`Compras encontradas: ${response.data.length}`);
  }))
    ? passed++
    : failed++;

  // Test 18: Get purchase by ID
  (await testEndpoint(
    "GET /purchases/:id - Obtener compra por ID",
    async () => {
      const response = await axiosAuth.get(`/purchases/${testPurchaseId}`);
      info(
        `Compra obtenida: ID ${response.data.id}, Estado: ${response.data.status}`
      );
    }
  ))
    ? passed++
    : failed++;

  // Test 19: Receive purchase
  (await testEndpoint(
    "POST /purchases/:id/receive - Recibir compra",
    async () => {
      const response = await axiosAuth.post(
        `/purchases/${testPurchaseId}/receive`
      );
      info(`Compra recibida, nuevo estado: ${response.data.status}`);
    }
  ))
    ? passed++
    : failed++;

  // ==================== SALES ENDPOINTS ====================
  section("MÓDULO DE VENTAS");

  // Test 20: Create sale
  (await testEndpoint("POST /sales - Crear venta", async () => {
    const response = await axiosAuth.post("/sales", {
      clientName: "Cliente Test",
      items: [
        {
          productId: testProductId,
          quantity: 2,
          unitPrice: 149.99,
        },
      ],
    });
    testSaleId = response.data.id;
    info(`Venta creada con ID: ${testSaleId}, Total: $${response.data.total}`);
  }))
    ? passed++
    : failed++;

  // Test 21: Get all sales
  (await testEndpoint("GET /sales - Listar ventas", async () => {
    const response = await axiosAuth.get("/sales");
    info(`Ventas encontradas: ${response.data.length}`);
  }))
    ? passed++
    : failed++;

  // Test 22: Get sale by ID
  (await testEndpoint("GET /sales/:id - Obtener venta por ID", async () => {
    const response = await axiosAuth.get(`/sales/${testSaleId}`);
    info(
      `Venta obtenida: Cliente ${response.data.clientName}, Total: $${response.data.total}`
    );
  }))
    ? passed++
    : failed++;

  // Test 23: Mark sale as paid
  (await testEndpoint(
    "POST /sales/:id/paid - Marcar venta como pagada",
    async () => {
      const response = await axiosAuth.post(`/sales/${testSaleId}/paid`);
      info(`Venta marcada como pagada, estado: ${response.data.status}`);
    }
  ))
    ? passed++
    : failed++;

  // ==================== REPORTS ENDPOINTS ====================
  section("MÓDULO DE REPORTES");

  // Test 24: Get dashboard data
  (await testEndpoint(
    "GET /reports/dashboard - Obtener datos del dashboard",
    async () => {
      const response = await axiosAuth.get("/reports/dashboard");
      info(
        `KPIs: ${response.data.productsCount} productos, ${response.data.salesCount} ventas, ${response.data.purchasesCount} compras`
      );
    }
  ))
    ? passed++
    : failed++;

  // Test 25: Get invoice PDF
  (await testEndpoint(
    "GET /reports/invoice/:id - Generar factura PDF",
    async () => {
      const response = await axiosAuth.get(`/reports/invoice/${testSaleId}`, {
        responseType: "arraybuffer",
      });
      const pdfSize = response.data.byteLength;
      info(`PDF generado correctamente, tamaño: ${pdfSize} bytes`);
    }
  ))
    ? passed++
    : failed++;

  // Test 26: Get sales report PDF
  (await testEndpoint(
    "GET /reports/sales - Generar reporte de ventas PDF",
    async () => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();

      const response = await axiosAuth.get("/reports/sales", {
        params: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        },
        responseType: "arraybuffer",
      });
      const pdfSize = response.data.byteLength;
      info(`Reporte de ventas generado, tamaño: ${pdfSize} bytes`);
    }
  ))
    ? passed++
    : failed++;

  // ==================== CLEANUP - DELETE TEST DATA ====================
  section("LIMPIEZA - ELIMINAR DATOS DE PRUEBA");

  // Delete test sale
  (await testEndpoint(
    "DELETE /sales/:id - Eliminar venta de prueba",
    async () => {
      await axiosAuth.delete(`/sales/${testSaleId}`);
      info(`Venta ${testSaleId} eliminada`);
    }
  ))
    ? passed++
    : failed++;

  // Delete test purchase
  (await testEndpoint(
    "DELETE /purchases/:id - Eliminar compra de prueba",
    async () => {
      await axiosAuth.delete(`/purchases/${testPurchaseId}`);
      info(`Compra ${testPurchaseId} eliminada`);
    }
  ))
    ? passed++
    : failed++;

  // Delete test product
  (await testEndpoint(
    "DELETE /products/:id - Eliminar producto de prueba",
    async () => {
      await axiosAuth.delete(`/products/${testProductId}`);
      info(`Producto ${testProductId} eliminado`);
    }
  ))
    ? passed++
    : failed++;

  // Delete test supplier
  (await testEndpoint(
    "DELETE /suppliers/:id - Eliminar proveedor de prueba",
    async () => {
      await axiosAuth.delete(`/suppliers/${testSupplierId}`);
      info(`Proveedor ${testSupplierId} eliminado`);
    }
  ))
    ? passed++
    : failed++;

  // Delete test category
  (await testEndpoint(
    "DELETE /categories/:id - Eliminar categoría de prueba",
    async () => {
      await axiosAuth.delete(`/categories/${testCategoryId}`);
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
  console.log(`${colors.cyan}📈 Total de pruebas: ${total}${colors.reset}`);
  console.log(
    `${colors.magenta}🎯 Porcentaje de éxito: ${percentage}%${colors.reset}\n`
  );

  if (failed === 0) {
    console.log(
      colors.green +
        "🎉 ¡TODOS LOS ENDPOINTS FUNCIONAN PERFECTAMENTE! 🎉" +
        colors.reset +
        "\n"
    );
  } else {
    console.log(
      colors.yellow +
        "⚠️  Algunos endpoints necesitan atención" +
        colors.reset +
        "\n"
    );
  }
}

// Ejecutar pruebas
runTests().catch((err) => {
  console.error(
    colors.red + "💥 Error fatal en las pruebas:" + colors.reset,
    err.message
  );
  process.exit(1);
});
