#!/usr/bin/env node

/**
 * Script de inicialización de base de datos para Railway
 *
 * Este script lee los archivos SQL y los ejecuta en la base de datos de Railway
 * Se puede ejecutar manualmente después del primer deploy
 */

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

async function initDatabase() {
  console.log("🚀 Iniciando configuración de base de datos para Railway...\n");

  // Configuración de la conexión
  const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
  };

  console.log("📊 Conectando a la base de datos...");
  console.log(`   Host: ${config.host}`);
  console.log(`   Puerto: ${config.port}`);
  console.log(`   Database: ${config.database}\n`);

  let connection;

  try {
    connection = await mysql.createConnection(config);
    console.log("✅ Conexión exitosa\n");

    // Leer y ejecutar init.sql
    const initPath = path.join(__dirname, "..", "basedatos", "init.sql");
    console.log("📝 Ejecutando init.sql...");

    if (fs.existsSync(initPath)) {
      const initSQL = fs.readFileSync(initPath, "utf8");
      await connection.query(initSQL);
      console.log("✅ Tablas creadas exitosamente\n");
    } else {
      console.log("⚠️  init.sql no encontrado\n");
    }

    // Leer y ejecutar seed.sql
    const seedPath = path.join(__dirname, "..", "basedatos", "seed.sql");
    console.log("📝 Ejecutando seed.sql...");

    if (fs.existsSync(seedPath)) {
      const seedSQL = fs.readFileSync(seedPath, "utf8");
      await connection.query(seedSQL);
      console.log("✅ Datos de prueba insertados exitosamente\n");
    } else {
      console.log("⚠️  seed.sql no encontrado\n");
    }

    // Verificar datos
    const [users] = await connection.query(
      "SELECT COUNT(*) as count FROM users"
    );
    const [products] = await connection.query(
      "SELECT COUNT(*) as count FROM products"
    );
    const [categories] = await connection.query(
      "SELECT COUNT(*) as count FROM categories"
    );

    console.log("📊 Resumen de datos:");
    console.log(`   Usuarios: ${users[0].count}`);
    console.log(`   Productos: ${products[0].count}`);
    console.log(`   Categorías: ${categories[0].count}\n`);

    console.log("🎉 ¡Base de datos inicializada correctamente!\n");
    console.log("📌 Credenciales de acceso:");
    console.log("   Email: admin@ferreteria.com");
    console.log("   Password: admin123\n");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:");
    console.error(error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("👋 Conexión cerrada");
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
