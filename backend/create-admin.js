const axios = require("axios");

const BASE_URL = "http://localhost:4000/api";

async function register() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Administrador",
      email: "admin@ferreteria.com",
      password: "admin123",
      role: "admin",
    });
    console.log("✅ Usuario admin registrado exitosamente");
    console.log("Email: admin@ferreteria.com");
    console.log("Password: admin123");
  } catch (error) {
    if (error.response?.data?.message?.includes("ya existe")) {
      console.log("ℹ️ El usuario admin ya existe");
    } else {
      console.error("❌ Error:", error.response?.data || error.message);
      console.error("Full error:", error);
    }
  }
}

register();
