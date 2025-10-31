/**
 * Script para crear datos de ejemplo de ventas y compras
 */

const db = require("./src/config/db");
const {
  Sale,
  SaleItem,
  Purchase,
  PurchaseItem,
  Product,
  Customer,
  Supplier,
  User,
} = require("./src/models");

async function seedData() {
  try {
    console.log("🔌 Conectando a la base de datos...");
    await db.authenticate();
    console.log("✅ Conexión exitosa");

    // Obtener productos, clientes, proveedores y usuarios
    const products = await Product.findAll({ limit: 10 });
    const customers = await Customer.findAll();
    const suppliers = await Supplier.findAll();
    const users = await User.findAll({ limit: 1 });

    if (products.length === 0) {
      console.log("❌ No hay productos en la base de datos");
      return;
    }

    console.log(`📦 Productos encontrados: ${products.length}`);
    console.log(`👥 Clientes encontrados: ${customers.length}`);
    console.log(`🏢 Proveedores encontrados: ${suppliers.length}`);
    console.log(`👤 Usuarios encontrados: ${users.length}`);

    // Crear clientes si no existen
    if (customers.length === 0) {
      console.log("📝 Creando clientes de ejemplo...");
      const newCustomers = await Customer.bulkCreate([
        {
          name: "Juan Pérez García",
          email: "juan.perez@email.com",
          phone: "555-0101",
          address: "Av. Principal 123",
          city: "Ciudad de México",
          state: "CDMX",
          customerType: "individual",
          creditLimit: 10000,
          creditDays: 30,
        },
        {
          name: "Constructora ABC S.A.",
          email: "contacto@constructoraabc.com",
          phone: "555-0202",
          address: "Blvd. Empresarial 456",
          city: "Monterrey",
          state: "Nuevo León",
          customerType: "business",
          creditLimit: 50000,
          creditDays: 60,
        },
        {
          name: "María González López",
          email: "maria.gonzalez@email.com",
          phone: "555-0303",
          address: "Calle Reforma 789",
          city: "Guadalajara",
          state: "Jalisco",
          customerType: "individual",
          creditLimit: 5000,
          creditDays: 15,
        },
      ]);
      customers.push(...newCustomers);
      console.log(`✅ ${newCustomers.length} clientes creados`);
    }

    // Crear proveedores si no existen
    if (suppliers.length === 0) {
      console.log("📝 Creando proveedores de ejemplo...");
      const newSuppliers = await Supplier.bulkCreate([
        {
          name: "Ferretería Industrial del Norte",
          contact: "Roberto Martínez",
          email: "ventas@ferretera-norte.com",
          phone: "555-1001",
          address: "Zona Industrial 100",
          city: "Monterrey",
          state: "Nuevo León",
          paymentTerms: "30 días",
          creditLimit: 100000,
        },
        {
          name: "Distribuidora de Herramientas SA",
          contact: "Laura Sánchez",
          email: "pedidos@dist-herramientas.com",
          phone: "555-2002",
          address: "Parque Industrial 200",
          city: "Querétaro",
          state: "Querétaro",
          paymentTerms: "45 días",
          creditLimit: 150000,
        },
      ]);
      suppliers.push(...newSuppliers);
      console.log(`✅ ${newSuppliers.length} proveedores creados`);
    }

    // Crear 5 ventas de ejemplo
    console.log("\n💰 Creando ventas de ejemplo...");
    const salesData = [
      {
        clientName: customers[0]?.name || "Cliente General",
        customerId: customers[0]?.id || null,
        userId: users[0]?.id || null,
        status: "completed",
        paymentStatus: "paid",
        paymentMethod: "cash",
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
      },
      {
        clientName: customers[1]?.name || "Cliente Empresa",
        customerId: customers[1]?.id || null,
        userId: users[0]?.id || null,
        status: "completed",
        paymentStatus: "paid",
        paymentMethod: "card",
        subtotal: 0,
        tax: 0,
        discount: 50,
        total: 0,
      },
      {
        clientName: customers[2]?.name || "Cliente María",
        customerId: customers[2]?.id || null,
        userId: users[0]?.id || null,
        status: "completed",
        paymentStatus: "pending",
        paymentMethod: "credit",
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
      },
      {
        clientName: "Cliente Mostrador",
        customerId: null,
        userId: users[0]?.id || null,
        status: "completed",
        paymentStatus: "paid",
        paymentMethod: "cash",
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
      },
      {
        clientName: customers[0]?.name || "Cliente Juan",
        customerId: customers[0]?.id || null,
        userId: users[0]?.id || null,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "transfer",
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
      },
    ];

    for (let i = 0; i < salesData.length; i++) {
      const saleData = salesData[i];
      const year = new Date().getFullYear();
      saleData.saleNumber = `SALE-${year}-${String(i + 1).padStart(5, "0")}`;

      // Crear la venta
      const sale = await Sale.create(saleData);

      // Agregar 2-3 items aleatorios
      const numItems = Math.floor(Math.random() * 2) + 2;
      let subtotal = 0;

      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const unitPrice = parseFloat(product.price) || 100;
        const itemTotal = quantity * unitPrice;

        await SaleItem.create({
          saleId: sale.id,
          productId: product.id,
          quantity: quantity,
          unitPrice: unitPrice,
          subtotal: itemTotal,
          discount: 0,
          tax: itemTotal * 0.16,
          total: itemTotal * 1.16,
        });

        subtotal += itemTotal;
      }

      // Actualizar totales de la venta
      const tax = subtotal * 0.16;
      const total = subtotal + tax - saleData.discount;

      await sale.update({
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
      });

      console.log(
        `✅ Venta #${sale.saleNumber} creada - Total: $${total.toFixed(2)}`
      );
    }

    // Crear 4 compras de ejemplo
    console.log("\n📦 Creando compras de ejemplo...");
    const purchasesData = [
      {
        supplierId: suppliers[0]?.id || null,
        userId: users[0]?.id || null,
        status: "received",
        paymentStatus: "paid",
        paymentMethod: "transfer",
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
      },
      {
        supplierId: suppliers[1]?.id || null,
        userId: users[0]?.id || null,
        status: "received",
        paymentStatus: "paid",
        paymentMethod: "cash",
        subtotal: 0,
        tax: 0,
        discount: 100,
        total: 0,
      },
      {
        supplierId: suppliers[0]?.id || null,
        userId: users[0]?.id || null,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "credit",
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
      },
      {
        supplierId: suppliers[1]?.id || null,
        userId: users[0]?.id || null,
        status: "ordered",
        paymentStatus: "pending",
        paymentMethod: "transfer",
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
      },
    ];

    for (let i = 0; i < purchasesData.length; i++) {
      const purchaseData = purchasesData[i];
      const year = new Date().getFullYear();
      purchaseData.purchaseNumber = `PURCH-${year}-${String(i + 1).padStart(
        5,
        "0"
      )}`;

      // Crear la compra
      const purchase = await Purchase.create(purchaseData);

      // Agregar 2-4 items aleatorios
      const numItems = Math.floor(Math.random() * 3) + 2;
      let subtotal = 0;

      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 10) + 5;
        const unitPrice =
          parseFloat(product.cost) || parseFloat(product.price) * 0.6 || 80;
        const itemTotal = quantity * unitPrice;

        await PurchaseItem.create({
          purchaseId: purchase.id,
          productId: product.id,
          quantity: quantity,
          unitPrice: unitPrice,
          subtotal: itemTotal,
          discount: 0,
          tax: itemTotal * 0.16,
          total: itemTotal * 1.16,
        });

        subtotal += itemTotal;
      }

      // Actualizar totales de la compra
      const tax = subtotal * 0.16;
      const total = subtotal + tax - purchaseData.discount;

      await purchase.update({
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
      });

      console.log(
        `✅ Compra #${purchase.purchaseNumber} creada - Total: $${total.toFixed(
          2
        )}`
      );
    }

    console.log("\n✅ ¡Datos de ejemplo creados exitosamente!");
    console.log(`📊 Total de ventas: ${salesData.length}`);
    console.log(`📊 Total de compras: ${purchasesData.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedData();
