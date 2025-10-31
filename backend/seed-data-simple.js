/**
 * Script simple para insertar datos de ventas y compras
 */

const { Sequelize } = require("sequelize");

// Conexión directa a la base de datos
const sequelize = new Sequelize("erp_ferreteria_rc", "root", "1999", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  logging: false,
});

async function insertData() {
  try {
    console.log("🔌 Conectando a la base de datos...");
    await sequelize.authenticate();
    console.log("✅ Conexión exitosa\n");

    // Limpiar datos existentes
    console.log("🧹 Limpiando datos existentes...");
    await sequelize.query("DELETE FROM sale_items");
    await sequelize.query("DELETE FROM sales");
    await sequelize.query("DELETE FROM purchase_items");
    await sequelize.query("DELETE FROM purchases");
    console.log("✅ Datos antiguos eliminados\n");

    // Obtener clientes, proveedores, productos y usuario
    console.log("� Obteniendo datos base...");
    const [customers] = await sequelize.query(
      "SELECT id, name FROM customers LIMIT 5"
    );
    const [suppliers] = await sequelize.query(
      "SELECT id, name FROM suppliers LIMIT 3"
    );
    const [products] = await sequelize.query(
      "SELECT id, name, price FROM products LIMIT 10"
    );
    const [users] = await sequelize.query("SELECT id FROM users LIMIT 1");

    const userId = users.length > 0 ? users[0].id : 1;

    console.log(`✅ ${customers.length} clientes encontrados`);
    console.log(`✅ ${suppliers.length} proveedores encontrados`);
    console.log(`✅ ${products.length} productos encontrados\n`);

    if (products.length === 0) {
      console.log(
        "❌ No hay productos. Por favor ejecuta primero el seed de productos."
      );
      process.exit(1);
    }

    // Insertar ventas con clientes relacionados
    console.log("💰 Insertando ventas con clientes relacionados...");
    const salesData = [
      {
        invoiceNumber: "SALE-2025-00001",
        clientName: customers[0]?.name || "Juan Pérez García",
        customerId: customers[0]?.id || null,
        status: "completed",
        paymentStatus: "paid",
        paymentMethod: "cash",
      },
      {
        invoiceNumber: "SALE-2025-00002",
        clientName: customers[1]?.name || "Constructora ABC S.A.",
        customerId: customers[1]?.id || null,
        status: "completed",
        paymentStatus: "paid",
        paymentMethod: "card",
      },
      {
        invoiceNumber: "SALE-2025-00003",
        clientName: customers[2]?.name || "María González López",
        customerId: customers[2]?.id || null,
        status: "completed",
        paymentStatus: "partial",
        paymentMethod: "credit",
      },
      {
        invoiceNumber: "SALE-2025-00004",
        clientName: customers[3]?.name || "Cliente Mostrador",
        customerId: customers[3]?.id || null,
        status: "completed",
        paymentStatus: "paid",
        paymentMethod: "cash",
      },
      {
        invoiceNumber: "SALE-2025-00005",
        clientName: customers[4]?.name || "Roberto Martínez",
        customerId: customers[4]?.id || null,
        status: "draft",
        paymentStatus: "pending",
        paymentMethod: "transfer",
      },
    ];

    for (const saleData of salesData) {
      // Calcular totales basados en productos aleatorios
      const numItems = Math.floor(Math.random() * 3) + 2; // 2-4 items
      let subtotal = 0;

      // Calcular subtotal sumando productos
      for (let i = 0; i < numItems; i++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = parseFloat(product.price) || 100;
        subtotal += quantity * price;
      }

      const discount = saleData.invoiceNumber === "SALE-2025-00002" ? 50 : 0;
      const tax = subtotal * 0.16;
      const total = subtotal + tax - discount;

      await sequelize.query(`
        INSERT INTO sales (invoiceNumber, clientName, customerId, userId, status, paymentStatus, paymentMethod, subtotal, tax, discount, total, createdAt, updatedAt)
        VALUES ('${saleData.invoiceNumber}', '${saleData.clientName}', ${saleData.customerId}, ${userId}, '${saleData.status}', '${saleData.paymentStatus}', '${saleData.paymentMethod}', ${subtotal.toFixed(2)}, ${tax.toFixed(2)}, ${discount}, ${total.toFixed(2)}, NOW(), NOW())
      `);

      console.log(
        `  ✅ ${saleData.invoiceNumber} - ${saleData.clientName} - $${total.toFixed(2)}`
      );
    }
    console.log(`✅ ${salesData.length} ventas insertadas\n`);

    // Insertar items de ventas con productos relacionados
    console.log("📦 Insertando items de ventas con productos reales...");
    const [sales] = await sequelize.query(
      "SELECT id, invoiceNumber FROM sales ORDER BY id DESC LIMIT 5"
    );

    for (const sale of sales) {
      const numItems = Math.floor(Math.random() * 3) + 2; // 2-4 items por venta

      for (let i = 0; i < numItems; i++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const unitPrice = parseFloat(product.price) || 100;
        const tax = unitPrice * quantity * 0.16;

        await sequelize.query(`
          INSERT INTO sale_items (saleId, productId, quantity, unitPrice, discount, tax, createdAt, updatedAt)
          VALUES (${sale.id}, ${product.id}, ${quantity}, ${unitPrice}, 0, ${tax}, NOW(), NOW())
        `);
      }
      console.log(`  ✅ ${sale.invoiceNumber} - ${numItems} productos`);
    }
    console.log(`✅ Items de venta insertados\n`);

    // Insertar compras con proveedores relacionados
    console.log("🏢 Insertando compras con proveedores relacionados...");
    const purchasesData = [
      {
        purchaseNumber: "PURCH-2025-00001",
        supplierId: suppliers[0]?.id || 1,
        status: "received",
        paymentStatus: "paid",
        paymentMethod: "transfer",
      },
      {
        purchaseNumber: "PURCH-2025-00002",
        supplierId: suppliers[1]?.id || 2,
        status: "received",
        paymentStatus: "paid",
        paymentMethod: "cash",
      },
      {
        purchaseNumber: "PURCH-2025-00003",
        supplierId: suppliers[2]?.id || 1,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "credit",
      },
    ];

    for (const purchaseData of purchasesData) {
      // Calcular totales basados en productos aleatorios
      const numItems = Math.floor(Math.random() * 4) + 3; // 3-6 items
      let subtotal = 0;

      // Calcular subtotal sumando productos
      for (let i = 0; i < numItems; i++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 10) + 5;
        const price = (parseFloat(product.price) || 100) * 0.65; // Precio de compra más bajo
        subtotal += quantity * price;
      }

      const discount =
        purchaseData.purchaseNumber === "PURCH-2025-00002" ? 100 : 0;
      const tax = subtotal * 0.16;
      const total = subtotal + tax - discount;

      await sequelize.query(`
        INSERT INTO purchases (purchaseNumber, supplierId, userId, status, paymentStatus, paymentMethod, subtotal, tax, discount, total, createdAt, updatedAt)
        VALUES ('${purchaseData.purchaseNumber}', ${purchaseData.supplierId}, ${userId}, '${purchaseData.status}', '${purchaseData.paymentStatus}', '${purchaseData.paymentMethod}', ${subtotal.toFixed(2)}, ${tax.toFixed(2)}, ${discount}, ${total.toFixed(2)}, NOW(), NOW())
      `);

      // Obtener el nombre del proveedor
      const [supplier] = await sequelize.query(
        `SELECT name FROM suppliers WHERE id = ${purchaseData.supplierId}`
      );
      const supplierName = supplier[0]?.name || "Proveedor";

      console.log(
        `  ✅ ${purchaseData.purchaseNumber} - ${supplierName} - $${total.toFixed(2)}`
      );
    }
    console.log(`✅ ${purchasesData.length} compras insertadas\n`);

    // Insertar items de compras con productos relacionados
    console.log("📦 Insertando items de compras con productos reales...");
    const [purchases] = await sequelize.query(
      "SELECT id, purchaseNumber FROM purchases ORDER BY id DESC LIMIT 10"
    );

    for (const purchase of purchases) {
      const numItems = Math.floor(Math.random() * 4) + 3; // 3-6 items por compra

      for (let i = 0; i < numItems; i++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 15) + 5;
        const unitPrice = (parseFloat(product.price) || 100) * 0.65;

        await sequelize.query(`
          INSERT INTO purchase_items (purchaseId, productId, quantity, unitPrice, createdAt, updatedAt)
          VALUES (${purchase.id}, ${product.id}, ${quantity}, ${unitPrice}, NOW(), NOW())
        `);
      }
      console.log(`  ✅ ${purchase.purchaseNumber} - ${numItems} productos`);
    }
    console.log(`✅ Items de compra insertados\n`);

    // Mostrar resumen
    const [salesCount] = await sequelize.query(
      "SELECT COUNT(*) as total FROM sales"
    );
    const [purchasesCount] = await sequelize.query(
      "SELECT COUNT(*) as total FROM purchases"
    );

    console.log("\n✅ ¡Datos insertados exitosamente!");
    console.log(`📊 Total de ventas: ${salesCount[0].total}`);
    console.log(`📊 Total de compras: ${purchasesCount[0].total}`);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

insertData();
