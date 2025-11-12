import React, { useEffect, useState } from "react";
import api from "../servicios/api";

export default function Ventas() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    clientName: "",
    status: "draft",
    items: [],
  });
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);

  useEffect(() => {
    loadSales();
    loadProducts();
  }, []);

  const loadSales = async () => {
    try {
      const response = await api.get("/sales");
      // El backend devuelve { success, data, pagination }
      setSales(response.data.data || []);
    } catch (error) {
      console.error("Error al cargar ventas:", error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      // El backend devuelve { message, count, data }
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProducts([]);
    }
  };

  const openModal = (sale = null) => {
    console.log("📝 abrirModal llamado con:", sale);
    if (sale) {
      setEditingSale(sale);

      // Transformar items del backend para que coincidan con el formato del formulario
      const transformedItems = (sale.items || []).map((item) => ({
        productId: item.productId,
        productName: item.product?.name || `Producto ID: ${item.productId}`,
        price: parseFloat(item.unitPrice || item.price || 0),
        quantity: parseInt(item.quantity || 1),
      }));

      const newFormData = {
        clientName: sale.clientName || "",
        status: sale.status || "draft",
        items: transformedItems,
      };

      console.log(
        "✏️ Configurando datos del formulario para edicion:",
        newFormData
      );
      setFormData(newFormData);
    } else {
      setEditingSale(null);
      const newFormData = {
        clientName: "",
        status: "draft",
        items: [],
      };
      console.log(
        "➕ Configurando datos del formulario para nueva venta:",
        newFormData
      );
      setFormData(newFormData);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSale(null);
    setFormData({
      clientName: "",
      status: "draft",
      items: [],
    });
    setSelectedProduct("");
    setProductQuantity(1);
  };

  const addProductToSale = () => {
    if (!selectedProduct) return;

    const product = products.find((p) => p.id === parseInt(selectedProduct));
    if (!product) return;

    const existingItem = formData.items.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      setFormData({
        ...formData,
        items: formData.items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + productQuantity }
            : item
        ),
      });
    } else {
      setFormData({
        ...formData,
        items: [
          ...formData.items,
          {
            productId: product.id,
            productName: product.name,
            price: parseFloat(product.price),
            quantity: productQuantity,
          },
        ],
      });
    }

    setSelectedProduct("");
    setProductQuantity(1);
  };

  const removeProductFromSale = (productId) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.productId !== productId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      alert("⚠️ Debes agregar al menos un producto a la venta");
      return;
    }

    try {
      // Transformar items para que coincidan con el backend
      const payload = {
        clientName: formData.clientName,
        status: formData.status,
        items: formData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price || item.unitPrice,
          discount: 0,
          tax: 0,
        })),
      };

      if (editingSale) {
        await api.put(`/sales/${editingSale.id}`, payload);
      } else {
        await api.post("/sales", payload);
      }
      loadSales();
      closeModal();
      alert("✅ Venta guardada exitosamente");
    } catch (error) {
      console.error("Error al guardar la venta:", error);
      alert(
        "❌ Error al guardar la venta: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta venta?")) return;

    try {
      await api.delete(`/sales/${id}`);
      alert("✅ Venta eliminada exitosamente");
      loadSales();
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
      alert(
        "❌ Error al eliminar la venta: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const downloadInvoice = async (saleId) => {
    setDownloadingId(saleId);
    try {
      const response = await api.get(`/reports/invoice/${saleId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `factura-${saleId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar la factura:", error);
      alert("Error al descargar la factura");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">💰</div>
          <div className="text-purple-600 font-semibold text-xl">
            Cargando ventas...
          </div>
        </div>
      </div>
    );
  }

  const totalVentas = Array.isArray(sales)
    ? sales.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0)
    : 0;
  const ventasPagadas = Array.isArray(sales)
    ? sales.filter((s) => s.status === "paid").length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 -m-4 p-8">
      {/* Header épico */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white p-8 rounded-3xl shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-7xl animate-bounce">💰</div>
            <div>
              <h1 className="text-5xl font-black mb-2">Gestión de Ventas</h1>
              <p className="text-purple-100 text-lg">
                Facturación y control de ingresos
              </p>
            </div>
          </div>

          {/* KPIs de ventas */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
              <div className="text-sm text-purple-100">Total Ventas</div>
              <div className="text-4xl font-black">{sales.length}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
              <div className="text-sm text-purple-100">Pagadas</div>
              <div className="text-4xl font-black">{ventasPagadas}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
              <div className="text-sm text-purple-100">Ingresos Total</div>
              <div className="text-4xl font-black">
                ${totalVentas.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Botón Nueva Venta */}
          <div className="mt-6">
            <button
              onClick={() => openModal()}
              className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-3"
            >
              <span className="text-2xl">➕</span>
              Nueva Venta
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-5 text-right text-sm font-black uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-6xl mb-4">🧾</div>
                    <div className="text-gray-500 text-xl font-semibold">
                      No hay ventas registradas
                    </div>
                    <p className="text-gray-400 mt-2">
                      ¡Comienza a vender ahora!
                    </p>
                  </td>
                </tr>
              ) : (
                Array.isArray(sales) &&
                sales.map((sale, index) => (
                  <tr
                    key={sale.id}
                    className="group hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-5">
                      <div className="inline-block bg-gradient-to-br from-purple-100 to-pink-100 px-4 py-2 rounded-xl font-mono text-sm font-bold text-purple-700">
                        #{sale.id}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {sale.clientName[0].toUpperCase()}
                        </div>
                        <div className="font-semibold text-gray-800 text-lg">
                          {sale.clientName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="text-2xl font-black text-green-600">
                        ${parseFloat(sale.total).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                          sale.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : sale.status === "draft"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full animate-pulse ${
                            sale.status === "paid"
                              ? "bg-green-500"
                              : sale.status === "draft"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        ></span>
                        {sale.status === "paid"
                          ? "Pagada"
                          : sale.status === "draft"
                            ? "Borrador"
                            : sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-gray-600 font-semibold">
                        {new Date(sale.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(sale.createdAt).toLocaleTimeString("es-ES")}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => downloadInvoice(sale.id)}
                          disabled={downloadingId === sale.id}
                          className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {downloadingId === sale.id ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Descargando...
                              </>
                            ) : (
                              <>
                                <span className="text-xl">📄</span>
                                PDF
                              </>
                            )}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                        </button>

                        <button
                          onClick={() => openModal(sale)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                          title="Editar venta"
                        >
                          <span className="text-xl">✏️</span>
                        </button>

                        <button
                          onClick={() => handleDelete(sale.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                          title="Eliminar venta"
                        >
                          <span className="text-xl">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de formulario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-3xl">
              <h2 className="text-3xl font-black">
                {editingSale ? "✏️ Editar Venta" : "➕ Nueva Venta"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Debug info */}
              {process.env.NODE_ENV === "development" && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-xs">
                  <strong>Debug:</strong> formData ={" "}
                  {JSON.stringify({
                    clientName: formData.clientName,
                    status: formData.status,
                    itemsCount: formData.items.length,
                  })}
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    value={formData.clientName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Estado *
                  </label>
                  <select
                    value={formData.status || "draft"}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
                    required
                  >
                    <option value="draft">Borrador</option>
                    <option value="paid">Pagada</option>
                    <option value="pending">Pendiente</option>
                  </select>
                </div>
              </div>

              {/* Sección de productos */}
              <div className="border-2 border-purple-200 rounded-2xl p-6 bg-purple-50">
                <h3 className="text-xl font-black text-purple-700 mb-4">
                  🛒 Productos de la Venta
                </h3>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="col-span-2">
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
                    >
                      <option value="">Seleccionar producto</option>
                      {products.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name} - ${parseFloat(prod.price).toFixed(2)}{" "}
                          (Stock: {prod.stock})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={productQuantity}
                      onChange={(e) =>
                        setProductQuantity(parseInt(e.target.value) || 1)
                      }
                      className="w-24 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
                      placeholder="Cant."
                    />
                    <button
                      type="button"
                      onClick={addProductToSale}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    >
                      ➕
                    </button>
                  </div>
                </div>

                {/* Lista de productos agregados */}
                {formData.items.length > 0 && (
                  <div className="bg-white rounded-xl p-4 space-y-2">
                    {formData.items.map((item, index) => {
                      const price = parseFloat(item.price || 0);
                      const quantity = parseInt(item.quantity || 0);
                      const subtotal = price * quantity;
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-purple-50 p-3 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-bold text-gray-800">
                              {item.productName ||
                                `Producto ID: ${item.productId}`}
                            </div>
                            <div className="text-sm text-gray-600">
                              {quantity} x ${price.toFixed(2)} = $
                              {subtotal.toFixed(2)}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeProductFromSale(item.productId)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-bold transition-all"
                          >
                            🗑️
                          </button>
                        </div>
                      );
                    })}

                    <div className="border-t-2 border-purple-200 pt-3 mt-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-gray-600">
                          <span className="font-semibold">Subtotal:</span>
                          <span className="font-bold">
                            $
                            {formData.items
                              .reduce(
                                (sum, item) => sum + item.price * item.quantity,
                                0
                              )
                              .toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                          <span className="font-semibold">IVA (16%):</span>
                          <span className="font-bold">
                            $
                            {(
                              formData.items.reduce(
                                (sum, item) => sum + item.price * item.quantity,
                                0
                              ) * 0.16
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-purple-200">
                          <span className="text-xl font-black text-gray-700">
                            Total:
                          </span>
                          <span className="text-3xl font-black text-green-600">
                            $
                            {(
                              formData.items.reduce(
                                (sum, item) => sum + item.price * item.quantity,
                                0
                              ) * 1.16
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  {editingSale ? "Guardar Cambios" : "Crear Venta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
