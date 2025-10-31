const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("erp_ferreteria_rc", "root", "1999", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

async function seedQuotations() {
  try {
    console.log("🔌 Conectando a la base de datos...");
    await sequelize.authenticate();
    console.log("✅ Conexión exitosa\n");

    // Obtener datos existentes
    console.log("📋 Obteniendo datos base...");
    const [customers] = await sequelize.query(
      "SELECT id, name FROM customers ORDER BY id LIMIT 5"
    );
    const [products] = await sequelize.query(
      "SELECT id, name, price FROM products ORDER BY id LIMIT 10"
    );
    const [users] = await sequelize.query(
      "SELECT id FROM users ORDER BY id LIMIT 1"
    );

    if (customers.length === 0 || products.length === 0) {
      console.log(
        "❌ No hay clientes o productos en la base de datos. Ejecuta primero seed-correct-data.js"
      );
      process.exit(1);
    }

    console.log(
      `✅ ${customers.length} clientes, ${products.length} productos, ${users.length} usuarios\n`
    );

    // Limpiar cotizaciones existentes
    console.log("🧹 Limpiando cotizaciones existentes...");
    await sequelize.query("DELETE FROM quotation_items");
    await sequelize.query("DELETE FROM quotations");
    console.log("✅ Datos antiguos eliminados\n");

    // Configuración de cotizaciones con items específicos
    const quotationsConfig = [
      {
        quotationNumber: "COT-2025-00001",
        customerId: customers[0]?.id || null,
        clientName: customers[0]?.name || "Cliente General",
        status: "sent",
        validUntil: "2025-11-30",
        notes: "Cotización para materiales de construcción",
        itemsConfig: [
          { productIndex: 0, quantity: 5 },
          { productIndex: 1, quantity: 3 },
        ],
      },
      {
        quotationNumber: "COT-2025-00002",
        customerId: customers[1]?.id || null,
        clientName: customers[1]?.name || "Cliente 2",
        status: "accepted",
        validUntil: "2025-12-15",
        notes: "Cotización aprobada - lista para conversión a venta",
        itemsConfig: [
          { productIndex: 2, quantity: 2 },
          { productIndex: 3, quantity: 1 },
          { productIndex: 4, quantity: 4 },
        ],
      },
      {
        quotationNumber: "COT-2025-00003",
        customerId: customers[2]?.id || null,
        clientName: customers[2]?.name || "Cliente 3",
        status: "draft",
        validUntil: "2025-11-20",
        notes: "Borrador - pendiente de revisión",
        itemsConfig: [{ productIndex: 5, quantity: 10 }],
      },
      {
        quotationNumber: "COT-2025-00004",
        customerId: customers[3]?.id || null,
        clientName: customers[3]?.name || "Cliente 4",
        status: "rejected",
        validUntil: "2025-10-31",
        notes: "Cliente decidió no proceder con la compra",
        itemsConfig: [
          { productIndex: 6, quantity: 1 },
          { productIndex: 7, quantity: 2 },
        ],
      },
      {
        quotationNumber: "COT-2025-00005",
        customerId: customers[4]?.id || null,
        clientName: customers[4]?.name || "Cliente 5",
        status: "accepted",
        validUntil: "2025-12-31",
        notes: "Proyecto de remodelación - aprobado",
        itemsConfig: [
          { productIndex: 8, quantity: 3 },
          { productIndex: 9, quantity: 5 },
          { productIndex: 0, quantity: 2 },
        ],
      },
    ];

    console.log("💰 Insertando cotizaciones con totales correctos...\n");

    for (const config of quotationsConfig) {
      // Paso 1: Insertar cotización con totales en 0
      const [result] = await sequelize.query(
        `INSERT INTO quotations 
        (quotationNumber, customerId, clientName, status, validUntil, notes, userId, subtotal, tax, discount, total, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, NOW(), NOW())`,
        {
          replacements: [
            config.quotationNumber,
            config.customerId,
            config.clientName,
            config.status,
            config.validUntil,
            config.notes,
            users[0]?.id || null,
          ],
        }
      );

      const quotationId = result;

      // Paso 2: Insertar items
      let subtotal = 0;
      const itemsDetails = [];

      for (const itemConfig of config.itemsConfig) {
        const product = products[itemConfig.productIndex];
        if (!product) continue;

        const quantity = itemConfig.quantity;
        const unitPrice = parseFloat(product.price);
        const itemSubtotal = unitPrice * quantity;
        subtotal += itemSubtotal;

        await sequelize.query(
          `INSERT INTO quotation_items 
          (quotationId, productId, productName, quantity, unitPrice, discount, tax, subtotal, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, 0, 0, ?, NOW(), NOW())`,
          {
            replacements: [
              quotationId,
              product.id,
              product.name,
              quantity,
              unitPrice,
              itemSubtotal,
            ],
          }
        );

        itemsDetails.push(
          `${quantity}x ${product.name} ($${unitPrice.toFixed(2)})`
        );
      }

      // Paso 3: Calcular totales finales
      const tax = subtotal * 0.16; // IVA 16%
      const discount = 0;
      const total = subtotal + tax - discount;

      // Paso 4: Actualizar cotización con totales correctos
      await sequelize.query(
        `UPDATE quotations 
        SET subtotal = ?, tax = ?, discount = ?, total = ?
        WHERE id = ?`,
        {
          replacements: [
            subtotal.toFixed(2),
            tax.toFixed(2),
            discount.toFixed(2),
            total.toFixed(2),
            quotationId,
          ],
        }
      );

      console.log(`  ✅ ${config.quotationNumber} - ${config.clientName}`);
      console.log(`     Items: ${itemsDetails.join(", ")}`);
      console.log(`     Estado: ${config.status}`);
      console.log(
        `     Subtotal: $${subtotal.toFixed(2)} + IVA: $${tax.toFixed(2)} = Total: $${total.toFixed(2)}\n`
      );
    }

    console.log("✅ 5 cotizaciones insertadas correctamente\n");
    console.log("📊 Resumen por estado:");
    const [statusSummary] = await sequelize.query(
      "SELECT status, COUNT(*) as count, SUM(total) as total FROM quotations GROUP BY status"
    );
    statusSummary.forEach((s) => {
      console.log(
        `   ${s.status}: ${s.count} cotizaciones ($${parseFloat(s.total).toFixed(2)})`
      );
    });

    console.log(
      "\n💡 Las cotizaciones con estado 'accepted' pueden convertirse a ventas"
    );

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await sequelize.close();
    process.exit(1);
  }
}

seedQuotations();
