const bcrypt = require("bcryptjs");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "erp_ferreteria_rc",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

async function fixPasswords() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos\n");

    // Generar hash para "admin123"
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("🔐 Generando nueva contraseña...");
    console.log("📝 Contraseña:", password);
    console.log("🔒 Hash:", hashedPassword);
    console.log("");

    // Actualizar todos los usuarios con la nueva contraseña hasheada
    const [result] = await sequelize.query(
      "UPDATE users SET password = ? WHERE 1=1",
      { replacements: [hashedPassword] }
    );

    console.log(
      `✅ ${result.affectedRows} usuarios actualizados con la nueva contraseña\n`
    );
    console.log("🎉 Ahora puedes iniciar sesión con:");
    console.log("   📧 Email: admin@ferreteria.com");
    console.log("   🔑 Contraseña: admin123");

    await sequelize.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

fixPasswords();
