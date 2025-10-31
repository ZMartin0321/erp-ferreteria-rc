/**
 * Script para diagnosticar el error en la base de datos
 */

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: "erp_ferreteria_rc",
  multipleStatements: false,
};

async function diagnose() {
  let connection;

  try {
    console.log("🔄 Conectando a MySQL...");
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Conectado\n");

    // Verificar estructura de suppliers
    console.log("📋 Estructura de tabla suppliers:");
    const [columns] = await connection.query("DESCRIBE suppliers");
    columns.forEach((col) => {
      console.log(
        `  - ${col.Field}: ${col.Type} ${col.Null === "NO" ? "NOT NULL" : ""}`
      );
    });

    console.log("\n📋 Estructura de tabla customers:");
    const [custColumns] = await connection.query("DESCRIBE customers");
    custColumns.forEach((col) => {
      console.log(
        `  - ${col.Field}: ${col.Type} ${col.Null === "NO" ? "NOT NULL" : ""}`
      );
    });

    console.log("\n📋 Estructura de tabla products:");
    const [prodColumns] = await connection.query("DESCRIBE products");
    prodColumns.forEach((col) => {
      console.log(
        `  - ${col.Field}: ${col.Type} ${col.Null === "NO" ? "NOT NULL" : ""}`
      );
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

diagnose();
