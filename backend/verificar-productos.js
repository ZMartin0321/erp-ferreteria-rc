require("dotenv").config();
const { Product } = require("./src/modelos");

async function checkProducts() {
  try {
    const products = await Product.findAll({
      order: [["id", "DESC"]],
      limit: 10,
    });

    console.log("\n📦 Últimos 10 productos en la base de datos:\n");
    console.log("Total de productos:", await Product.count());
    console.log("\nProductos:");

    products.forEach((p) => {
      console.log(`\nID: ${p.id}`);
      console.log(`Nombre: ${p.name}`);
      console.log(`SKU: ${p.sku}`);
      console.log(`Stock: ${p.stock}`);
      console.log(`Precio: $${p.price}`);
      console.log(`Creado: ${p.createdAt}`);
      console.log("---");
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkProducts();
