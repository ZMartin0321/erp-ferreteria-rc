/**
 * Script CORREGIDO para insertar datos relacionados correctamente
 * Los totales de ventas coincidirán exactamente con los items
 */

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("erp_ferreteria_rc", "root", "1999", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  logging: false,
});

async function insertCorrectData() {
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

    // Obtener datos base
    console.log("📋 Obteniendo datos base...");
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

    console.log(
      `✅ ${customers.length} clientes, ${suppliers.length} proveedores, ${products.length} productos\n`
    );

    if (products.length === 0) {
      console.log("❌ No hay productos.");
      process.exit(1);
    }

    // ==================== VENTAS ====================
    console.log("💰 Insertando ventas con totales correctos...\n");

    const salesConfig = [
      {
        invoiceNumber: "SALE-2025-00001",
        customerIndex: 0,
        status: "completed",
        paymentStatus: "paid",
        paymentMethod: "cash",
        itemsConfig: [
          { productIndex: 0, quantity: 2 },
          { productIndex: 1, quantity: 1 },
          { productIndex: 2, quantity: 3 },
        ],
      },
      {
        invoiceNumber: "SALE-2025-00002",
        customerIndex: 1,
        status: "completed",
        paymentStatus: "paid",
        paymentMethod: "card",
        discount: 50,
        itemsConfig: [
          { productIndex: 3, quantity: 1 },
          { productIndex: 4, quantity: 2 },
        ],
      },
      {
        invoiceNumber: "SALE-2025-00003",
        customerIndex: 2,
        status: "completed",
        paymentStatus: "partial",
        paymentMethod: "credit",
        itemsConfig: [
          { productIndex: 5, quantity: 1 },
          { productIndex: 6, quantity: 1 },
          { productIndex: 7, quantity: 2 },
        ],
      },
      {
        invoiceNumber: "SALE-2025-00004",
        customerIndex: 3,
        status: "completed",
        paymentStatus: "paid",
        paymentMethod: "cash",
        itemsConfig: [
          { productIndex: 8, quantity: 3 },
          { productIndex: 9, quantity: 1 },
        ],
      },
      {
        invoiceNumber: "SALE-2025-00005",
        customerIndex: 4,
        status: "draft",
        paymentStatus: "pending",
        paymentMethod: "transfer",
        itemsConfig: [
          { productIndex: 0, quantity: 1 },
          { productIndex: 3, quantity: 2 },
          { productIndex: 6, quantity: 1 },
        ],
      },
    ];

    for (const saleConfig of salesConfig) {
      const customer = customers[saleConfig.customerIndex] || customers[0];

      // 1. Insertar la venta con totales en 0
      await sequelize.query(`
        INSERT INTO sales (invoiceNumber, clientName, customerId, userId, status, paymentStatus, paymentMethod, subtotal, tax, discount, total, createdAt, updatedAt)
        VALUES ('${saleConfig.invoiceNumber}', '${customer.name}', ${customer.id}, ${userId}, '${saleConfig.status}', '${saleConfig.paymentStatus}', '${saleConfig.paymentMethod}', 0, 0, 0, 0, NOW(), NOW())
      `);

      // 2. Obtener el ID de la venta recién creada
      const [saleResult] = await sequelize.query(
        `SELECT id FROM sales WHERE invoiceNumber = '${saleConfig.invoiceNumber}'`
      );
      const saleId = saleResult[0].id;

      // 3. Insertar los items y calcular subtotal
      let subtotal = 0;
      const itemsDetails = [];

      for (const itemConfig of saleConfig.itemsConfig) {
        const product = products[itemConfig.productIndex % products.length];
        const quantity = itemConfig.quantity;
        const unitPrice = parseFloat(product.price) || 100;
        const itemSubtotal = unitPrice * quantity;
        const itemTax = itemSubtotal * 0.16;

        subtotal += itemSubtotal;

        await sequelize.query(`
          INSERT INTO sale_items (saleId, productId, quantity, unitPrice, discount, tax, createdAt, updatedAt)
          VALUES (${saleId}, ${product.id}, ${quantity}, ${unitPrice}, 0, ${itemTax.toFixed(2)}, NOW(), NOW())
        `);

        itemsDetails.push(`${quantity}x ${product.name}`);
      }

      // 4. Calcular totales finales
      const discount = saleConfig.discount || 0;
      const tax = subtotal * 0.16;
      const total = subtotal + tax - discount;

      // 5. Actualizar la venta con los totales correctos
      await sequelize.query(`
        UPDATE sales 
        SET subtotal = ${subtotal.toFixed(2)}, 
            tax = ${tax.toFixed(2)}, 
            discount = ${discount}, 
            total = ${total.toFixed(2)}
        WHERE id = ${saleId}
      `);

      console.log(`  ✅ ${saleConfig.invoiceNumber} - ${customer.name}`);
      console.log(`     Items: ${itemsDetails.join(", ")}`);
      console.log(`     Total: $${total.toFixed(2)}\n`);
    }

    console.log(`✅ ${salesConfig.length} ventas insertadas correctamente\n`);

    // ==================== COMPRAS ====================
    console.log("🏢 Insertando compras con totales correctos...\n");

    const purchasesConfig = [
      {
        purchaseNumber: "PURCH-2025-00001",
        supplierIndex: 0,
        status: "received",
        paymentStatus: "paid",
        paymentMethod: "transfer",
        itemsConfig: [
          { productIndex: 0, quantity: 10 },
          { productIndex: 1, quantity: 15 },
          { productIndex: 2, quantity: 8 },
        ],
      },
      {
        purchaseNumber: "PURCH-2025-00002",
        supplierIndex: 1,
        status: "received",
        paymentStatus: "paid",
        paymentMethod: "cash",
        discount: 100,
        itemsConfig: [
          { productIndex: 3, quantity: 20 },
          { productIndex: 4, quantity: 12 },
        ],
      },
      {
        purchaseNumber: "PURCH-2025-00003",
        supplierIndex: 2,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "credit",
        itemsConfig: [
          { productIndex: 5, quantity: 25 },
          { productIndex: 6, quantity: 18 },
          { productIndex: 7, quantity: 10 },
        ],
      },
    ];

    for (const purchaseConfig of purchasesConfig) {
      const supplier =
        suppliers[purchaseConfig.supplierIndex % suppliers.length];

      // 1. Insertar la compra con totales en 0
      await sequelize.query(`
        INSERT INTO purchases (purchaseNumber, supplierId, userId, status, paymentStatus, paymentMethod, subtotal, tax, discount, total, createdAt, updatedAt)
        VALUES ('${purchaseConfig.purchaseNumber}', ${supplier.id}, ${userId}, '${purchaseConfig.status}', '${purchaseConfig.paymentStatus}', '${purchaseConfig.paymentMethod}', 0, 0, 0, 0, NOW(), NOW())
      `);

      // 2. Obtener el ID de la compra
      const [purchaseResult] = await sequelize.query(
        `SELECT id FROM purchases WHERE purchaseNumber = '${purchaseConfig.purchaseNumber}'`
      );
      const purchaseId = purchaseResult[0].id;

      // 3. Insertar los items y calcular subtotal
      let subtotal = 0;
      const itemsDetails = [];

      for (const itemConfig of purchaseConfig.itemsConfig) {
        const product = products[itemConfig.productIndex % products.length];
        const quantity = itemConfig.quantity;
        const unitPrice = (parseFloat(product.price) || 100) * 0.65; // Precio de compra 65% del precio de venta
        const itemSubtotal = unitPrice * quantity;

        subtotal += itemSubtotal;

        await sequelize.query(`
          INSERT INTO purchase_items (purchaseId, productId, quantity, unitPrice, createdAt, updatedAt)
          VALUES (${purchaseId}, ${product.id}, ${quantity}, ${unitPrice.toFixed(2)}, NOW(), NOW())
        `);

        itemsDetails.push(`${quantity}x ${product.name}`);
      }

      // 4. Calcular totales finales
      const discount = purchaseConfig.discount || 0;
      const tax = subtotal * 0.16;
      const total = subtotal + tax - discount;

      // 5. Actualizar la compra con los totales correctos
      await sequelize.query(`
        UPDATE purchases 
        SET subtotal = ${subtotal.toFixed(2)}, 
            tax = ${tax.toFixed(2)}, 
            discount = ${discount}, 
            total = ${total.toFixed(2)}
        WHERE id = ${purchaseId}
      `);

      console.log(`  ✅ ${purchaseConfig.purchaseNumber} - ${supplier.name}`);
      console.log(`     Items: ${itemsDetails.join(", ")}`);
      console.log(`     Total: $${total.toFixed(2)}\n`);
    }

    console.log(
      `✅ ${purchasesConfig.length} compras insertadas correctamente\n`
    );

    // Mostrar resumen final
    const [salesCount] = await sequelize.query(
      "SELECT COUNT(*) as total FROM sales"
    );
    const [purchasesCount] = await sequelize.query(
      "SELECT COUNT(*) as total FROM purchases"
    );

    console.log("\n✅ ¡Datos insertados exitosamente!");
    console.log(`📊 Total de ventas: ${salesCount[0].total}`);
    console.log(`📊 Total de compras: ${purchasesCount[0].total}`);
    console.log(
      "\n💡 Los totales en la lista coinciden EXACTAMENTE con los items de cada venta/compra"
    );

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

insertCorrectData();
