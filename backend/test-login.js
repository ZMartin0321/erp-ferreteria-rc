const axios = require("axios");

async function testLogin() {
  try {
    console.log("🔐 Probando login...");

    const response = await axios.post("http://localhost:4000/api/auth/login", {
      email: "admin@ferreteria.com",
      password: "admin123",
    });

    console.log("✅ Login exitoso!");
    console.log("📝 Usuario:", response.data.user.name);
    console.log("📧 Email:", response.data.user.email);
    console.log("🎭 Role:", response.data.user.role);
    console.log("🔑 Token:", response.data.token.substring(0, 50) + "...");
  } catch (error) {
    console.error("❌ Error en login:");
    console.error("Mensaje:", error.response?.data?.message || error.message);
    console.error("Status:", error.response?.status);
  }
}

testLogin();
