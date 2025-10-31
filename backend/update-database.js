/**
 * Script para actualizar la base de datos automáticamente
 * Ejecuta los scripts SQL de inicialización y población
 */

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  multipleStatements: true,
};

async function updateDatabase() {
  let connection;

  try {
    console.log("🔄 Conectando a MySQL...");
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Conectado exitosamente\n");

    // BORRAR BASE DE DATOS EXISTENTE
    console.log("🗑️  Borrando base de datos existente...");
    await connection.query("DROP DATABASE IF EXISTS erp_ferreteria_rc");
    console.log("✅ Base de datos borrada\n");

    // Leer script de inicialización
    console.log("📖 Leyendo script de inicialización...");
    const initSQL = fs.readFileSync(
      path.join(__dirname, "..", "database", "init.sql"),
      "utf8"
    );

    // Leer script de población
    console.log("📖 Leyendo script de población...");
    const seedSQL = fs.readFileSync(
      path.join(__dirname, "..", "database", "seed.sql"),
      "utf8"
    );

    // Ejecutar script de inicialización
    console.log("🏗️  Ejecutando script de inicialización...");
    await connection.query(initSQL);
    console.log("✅ Base de datos creada/actualizada\n");

    // Seleccionar la base de datos
    await connection.query("USE erp_ferreteria_rc");

    // Limpiar datos existentes
    console.log("🧹 Limpiando datos existentes...");
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    await connection.query("TRUNCATE TABLE products");
    await connection.query("TRUNCATE TABLE categories");
    await connection.query("TRUNCATE TABLE suppliers");
    await connection.query("TRUNCATE TABLE customers");
    await connection.query("TRUNCATE TABLE users");
    await connection.query("TRUNCATE TABLE sales");
    await connection.query("TRUNCATE TABLE sale_items");
    await connection.query("TRUNCATE TABLE purchases");
    await connection.query("TRUNCATE TABLE purchase_items");
    await connection.query("TRUNCATE TABLE quotations");
    await connection.query("TRUNCATE TABLE quotation_items");
    await connection.query("TRUNCATE TABLE inventory_movements");
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("✅ Datos limpiados\n");

    // Ejecutar script de población
    console.log("🌱 Ejecutando script de población...");
    await connection.query(seedSQL);
    console.log("✅ Datos insertados correctamente\n");

    // Verificar productos con imágenes
    console.log("🔍 Verificando productos con imágenes...");
    const [products] = await connection.query(
      "SELECT id, name, images FROM products LIMIT 5"
    );

    console.log("\n📦 Productos de ejemplo:");
    products.forEach((product) => {
      const images = JSON.parse(product.images || "[]");
      console.log(`  - ${product.name}: ${images.length} imagen(es)`);
    });

    console.log("\n✅ Base de datos actualizada exitosamente!");
    console.log("🎉 Todos los productos ahora tienen imágenes JSON\n");
  } catch (error) {
    console.error("❌ Error al actualizar la base de datos:", error.message);
    if (error.sql) {
      console.error("SQL que falló:", error.sql.substring(0, 200) + "...");
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("👋 Conexión cerrada");
    }
  }
}

// Ejecutar
updateDatabase();
