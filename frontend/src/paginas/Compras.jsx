import React, { useEffect, useState } from "react";
import api from "../servicios/api";

export default function Compras() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    supplierId: "",
    status: "pending",
    items: [],
  });
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);
  const [productPrice, setProductPrice] = useState(0);

  useEffect(() => {
    loadPurchases();
    loadSuppliers();
    loadProducts();
  }, []);

  const loadPurchases = async () => {
    try {
      const response = await api.get("/purchases");
      // El backend devuelve { success, data, pagination }
      setPurchases(response.data.data || []);
    } catch (error) {
      console.error("Error al cargar compras:", error);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const response = await api.get("/suppliers");
      setSuppliers(response.data || []);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
      setSuppliers([]);
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

  const openModal = (purchase = null) => {
    console.log("📝 abrirModal llamado con:", purchase);
    if (purchase) {
      setEditingPurchase(purchase);

      // Transformar items del backend para que coincidan con el formato del formulario
      const transformedItems = (purchase.items || []).map((item) => ({
        productId: item.productId,
        productName: item.product?.name || `Producto ID: ${item.productId}`,
        price: parseFloat(item.unitPrice || item.price || 0),
        quantity: parseInt(item.quantity || 1),
      }));

      const newFormData = {
        supplierId: purchase.supplierId || "",
        status: purchase.status || "pending",
        items: transformedItems,
      };

      console.log(
        "✏️ Configurando datos del formulario para edicion:",
        newFormData
      );
      setFormData(newFormData);
    } else {
      setEditingPurchase(null);
      const newFormData = {
        supplierId: "",
        status: "pending",
        items: [],
      };
      console.log(
        "➕ Configurando datos del formulario para nueva compra:",
        newFormData
      );
      setFormData(newFormData);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPurchase(null);
    setFormData({
      supplierId: "",
      status: "pending",
      items: [],
    });
    setSelectedProduct("");
    setProductQuantity(1);
    setProductPrice(0);
  };

  const addProductToPurchase = () => {
    if (!selectedProduct || productPrice <= 0) return;

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
            price: parseFloat(productPrice),
            quantity: productQuantity,
          },
        ],
      });
    }

    setSelectedProduct("");
    setProductQuantity(1);
    setProductPrice(0);
  };

  const removeProductFromPurchase = (productId) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.productId !== productId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      alert("⚠️ Debes agregar al menos un producto a la compra");
      return;
    }

    try {
      // Transformar items para que coincidan con el backend
      const payload = {
        supplierId: formData.supplierId,
        status: formData.status,
        items: formData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price || item.unitPrice,
        })),
      };

      if (editingPurchase) {
        await api.put(`/purchases/${editingPurchase.id}`, payload);
      } else {
        await api.post("/purchases", payload);
      }
      loadPurchases();
      closeModal();
      alert("✅ Compra guardada exitosamente");
    } catch (error) {
      console.error("Error al guardar la compra:", error);
      alert(
        "❌ Error al guardar la compra: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta compra?")) return;

    try {
      await api.delete(`/purchases/${id}`);
      alert("✅ Compra eliminada exitosamente");
      loadPurchases();
    } catch (error) {
      console.error("Error al eliminar la compra:", error);
      alert(
        "❌ Error al eliminar la compra: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const markAsReceived = async (purchaseId) => {
    setProcessingId(purchaseId);
    try {
      await api.post(`/purchases/${purchaseId}/receive`);
      // Animación de éxito
      const successDiv = document.createElement("div");
      successDiv.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 2rem 3rem; border-radius: 1.5rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; animation: scaleIn 0.3s ease-out;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
          <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">¡Compra Recibida!</div>
          <div style="font-size: 1rem; opacity: 0.9;">Stock actualizado correctamente</div>
        </div>
      `;
      document.body.appendChild(successDiv);
      setTimeout(() => successDiv.remove(), 2000);

      loadPurchases();
    } catch (error) {
      console.error("Error al marcar como recibida:", error);
      alert("❌ Error al recibir compra");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🛒</div>
          <div className="text-green-600 font-semibold text-xl">
            Cargando compras...
          </div>
        </div>
      </div>
    );
  }

  const totalCompras = Array.isArray(purchases)
    ? purchases.reduce((sum, p) => sum + parseFloat(p.total || 0), 0)
    : 0;
  const comprasRecibidas = Array.isArray(purchases)
    ? purchases.filter((p) => p.status === "received").length
    : 0;
  const comprasPendientes = Array.isArray(purchases)
    ? purchases.filter((p) => p.status === "pending").length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 -m-4 p-8">
      {/* Header épico */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-8 rounded-3xl shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-7xl animate-bounce">🛒</div>
            <div>
              <h1 className="text-5xl font-black mb-2">Gestión de Compras</h1>
              <p className="text-green-100 text-lg">
                Control de adquisiciones y proveedores
              </p>
            </div>
          </div>

          {/* KPIs de compras */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
              <div className="text-sm text-green-100">Total Compras</div>
              <div className="text-4xl font-black">{purchases.length}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
              <div className="text-sm text-green-100">Recibidas</div>
              <div className="text-4xl font-black text-white">
                {comprasRecibidas}
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
              <div className="text-sm text-green-100">Pendientes</div>
              <div className="text-4xl font-black text-yellow-300">
                {comprasPendientes}
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
              <div className="text-sm text-green-100">Total Inversión</div>
              <div className="text-4xl font-black">
                ${totalCompras.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Botón Nueva Compra */}
          <div className="mt-6">
            <button
              onClick={() => openModal()}
              className="bg-white text-green-600 px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-3"
            >
              <span className="text-2xl">➕</span>
              Nueva Compra
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de compras */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                  Proveedor
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
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <div className="text-gray-500 text-xl font-semibold">
                      No hay compras registradas
                    </div>
                    <p className="text-gray-400 mt-2">
                      ¡Crea tu primera orden de compra!
                    </p>
                  </td>
                </tr>
              ) : (
                Array.isArray(purchases) &&
                purchases.map((purchase, index) => (
                  <tr
                    key={purchase.id}
                    className="group hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-5">
                      <div className="inline-block bg-gradient-to-br from-green-100 to-emerald-100 px-4 py-2 rounded-xl font-mono text-sm font-bold text-green-700">
                        #{purchase.id}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {(purchase.supplier?.name || "N")[0].toUpperCase()}
                        </div>
                        <div className="font-semibold text-gray-800 text-lg">
                          {purchase.supplier?.name || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="text-2xl font-black text-red-600">
                        ${parseFloat(purchase.total).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                          purchase.status === "received"
                            ? "bg-green-100 text-green-700"
                            : purchase.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 animate-pulse"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            purchase.status === "received"
                              ? "bg-green-500"
                              : purchase.status === "pending"
                                ? "bg-yellow-500 animate-pulse"
                                : "bg-red-500"
                          }`}
                        ></span>
                        {purchase.status === "received"
                          ? "Recibida"
                          : purchase.status === "pending"
                            ? "Pendiente"
                            : purchase.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-gray-600 font-semibold">
                        {new Date(purchase.createdAt).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(purchase.createdAt).toLocaleTimeString(
                          "es-ES"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {purchase.status === "pending" && (
                          <button
                            onClick={() => markAsReceived(purchase.id)}
                            disabled={processingId === purchase.id}
                            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              {processingId === purchase.id ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Procesando...
                                </>
                              ) : (
                                <>
                                  <span className="text-xl">✅</span>
                                  Recibir
                                </>
                              )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                          </button>
                        )}

                        {purchase.status === "received" && (
                          <div className="inline-flex items-center gap-2 text-green-600 font-semibold">
                            <span className="text-2xl">✓</span>
                            Completada
                          </div>
                        )}

                        <button
                          onClick={() => openModal(purchase)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                          title="Editar compra"
                        >
                          <span className="text-xl">✏️</span>
                        </button>

                        <button
                          onClick={() => handleDelete(purchase.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                          title="Eliminar compra"
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
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-3xl">
              <h2 className="text-3xl font-black">
                {editingPurchase ? "✏️ Editar Compra" : "➕ Nueva Compra"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Debug info */}
              {process.env.NODE_ENV === "development" && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-xs">
                  <strong>Debug:</strong> formData ={" "}
                  {JSON.stringify({
                    supplierId: formData.supplierId,
                    status: formData.status,
                    itemsCount: formData.items.length,
                  })}
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Proveedor *
                  </label>
                  <select
                    value={formData.supplierId || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, supplierId: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all"
                    required
                  >
                    <option value="">Seleccionar proveedor</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name} - {supplier.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Estado *
                  </label>
                  <select
                    value={formData.status || "pending"}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all"
                    required
                  >
                    <option value="pending">Pendiente</option>
                    <option value="received">Recibida</option>
                  </select>
                </div>
              </div>

              {/* Sección de productos */}
              <div className="border-2 border-green-200 rounded-2xl p-6 bg-green-50">
                <h3 className="text-xl font-black text-green-700 mb-4">
                  📦 Productos de la Compra
                </h3>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="col-span-2">
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all"
                    >
                      <option value="">Seleccionar producto</option>
                      {products.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name} (Stock actual: {prod.stock})
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all"
                      placeholder="Cantidad"
                    />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={productPrice}
                      onChange={(e) =>
                        setProductPrice(parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all"
                      placeholder="Precio"
                    />
                    <button
                      type="button"
                      onClick={addProductToPurchase}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
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
                          className="flex items-center justify-between bg-green-50 p-3 rounded-lg"
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
                              removeProductFromPurchase(item.productId)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-bold transition-all"
                          >
                            🗑️
                          </button>
                        </div>
                      );
                    })}

                    <div className="border-t-2 border-green-200 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-black text-gray-700">
                          Total:
                        </span>
                        <span className="text-3xl font-black text-red-600">
                          $
                          {formData.items
                            .reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            )
                            .toFixed(2)}
                        </span>
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
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  {editingPurchase ? "Guardar Cambios" : "Crear Compra"}
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
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
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
