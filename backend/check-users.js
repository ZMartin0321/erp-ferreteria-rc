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

async function checkUsers() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos\n");

    const [users] = await sequelize.query(
      "SELECT id, name, email, role, createdAt FROM users"
    );

    if (users.length === 0) {
      console.log("❌ No hay usuarios en la base de datos");
      console.log("💡 Ejecuta el seed.sql para crear datos de prueba");
    } else {
      console.log(`📋 Usuarios encontrados: ${users.length}\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🎭 Role: ${user.role}`);
        console.log(`   📅 Creado: ${user.createdAt}`);
        console.log("");
      });
    }

    await sequelize.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkUsers();
