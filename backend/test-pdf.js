const axios = require("axios");
const fs = require("fs");

const BASE_URL = "http://localhost:4000/api";
let token = "";

async function login() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: "admin@ferreteria.com",
      password: "admin123",
    });
    token = response.data.token;
    console.log("✅ LOGIN exitoso");
    return true;
  } catch (error) {
    console.error(
      "❌ LOGIN falló:",
      error.response?.data?.message || error.message
    );
    console.log(
      "\n💡 SOLUCIÓN: Registra el usuario primero desde http://localhost:5173/register"
    );
    console.log("   Email: admin@ferreteria.com");
    console.log("   Password: admin123\n");
    return false;
  }
}

async function createSale() {
  try {
    const response = await axios.post(
      `${BASE_URL}/sales`,
      {
        clientName: "Cliente PDF Test",
        status: "paid",
        items: [
          { productId: 1, quantity: 2, unitPrice: 12.5, discount: 0, tax: 0 },
          { productId: 2, quantity: 1, unitPrice: 5.75, discount: 0, tax: 0 },
        ],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(`✅ Venta creada: ID ${response.data.id}`);
    return response.data.id;
  } catch (error) {
    console.error(
      "❌ Error creando venta:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

async function downloadPDF(saleId) {
  try {
    console.log(`\n📄 Descargando PDF de venta #${saleId}...`);

    const response = await axios.get(`${BASE_URL}/reports/invoice/${saleId}`, {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${token}` },
    });

    const filename = `factura-${saleId}-test.pdf`;
    fs.writeFileSync(filename, response.data);

    console.log(`✅ PDF generado exitosamente: ${filename}`);
    console.log(`📁 Ubicación: ${__dirname}\\${filename}`);
    return true;
  } catch (error) {
    console.error(
      "❌ Error generando PDF:",
      error.response?.data || error.message
    );
    if (error.response?.status === 500) {
      console.log("\n🔍 Error del servidor. Verifica los logs del backend.");
    }
    return false;
  }
}

async function testPDF() {
  console.log("🚀 PROBANDO GENERACIÓN DE PDF...\n");

  const loggedIn = await login();
  if (!loggedIn) return;

  const saleId = await createSale();
  if (!saleId) return;

  await downloadPDF(saleId);

  console.log("\n✅ PRUEBA COMPLETADA\n");
}

testPDF();
