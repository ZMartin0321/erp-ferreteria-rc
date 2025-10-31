import { useState, useEffect } from "react";
import api from "../services/api";
import { EmptyStates } from "../components/EmptyState";

export default function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [formData, setFormData] = useState({
    customerId: "",
    clientName: "",
    validUntil: "",
    status: "draft",
    notes: "",
    items: [],
  });
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);

  useEffect(() => {
    fetchQuotations();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchQuotations = async () => {
    try {
      const res = await api.get("/quotations");
      setQuotations(res.data.data || []);
    } catch (error) {
      console.error("Error loading quotations:", error);
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data.data || []);
    } catch (error) {
      console.error("Error loading customers:", error);
      setCustomers([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    }
  };

  const handleConvertToSale = async (quotationId) => {
    if (!confirm("¿Convertir esta cotización en venta?")) return;

    // Cerrar el modal antes de procesar
    setSelectedQuotation(null);

    try {
      const response = await api.post(
        `/quotations/${quotationId}/convert-to-sale`
      );

      // Crear la venta con los datos de la cotización
      if (response.data.data && response.data.data.saleData) {
        const saleData = response.data.data.saleData;
        await api.post("/sales", saleData);

        alert("✅ Cotización convertida a venta exitosamente");
        fetchQuotations();
      }
    } catch (error) {
      console.error("Error al convertir:", error);
      alert("❌ Error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta cotización?")) return;
    try {
      await api.delete(`/quotations/${id}`);
      alert("✅ Cotización eliminada");
      fetchQuotations();
    } catch (error) {
      alert("❌ Error al eliminar");
    }
  };

  const openModal = (quotation = null) => {
    if (quotation) {
      setEditingQuotation(quotation);
      const transformedItems = (quotation.items || []).map((item) => ({
        productId: item.productId,
        productName: item.product?.name || `Producto ID: ${item.productId}`,
        price: parseFloat(item.unitPrice || 0),
        quantity: parseInt(item.quantity || 1),
      }));
      setFormData({
        customerId: quotation.customerId || "",
        clientName: quotation.clientName || "",
        validUntil: quotation.validUntil || "",
        status: quotation.status || "draft",
        notes: quotation.notes || "",
        items: transformedItems,
      });
    } else {
      setEditingQuotation(null);
      setFormData({
        customerId: "",
        clientName: "",
        validUntil: "",
        status: "draft",
        notes: "",
        items: [],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingQuotation(null);
    setFormData({
      customerId: "",
      clientName: "",
      validUntil: "",
      status: "draft",
      notes: "",
      items: [],
    });
    setSelectedProduct("");
    setProductQuantity(1);
  };

  const addProductToQuotation = () => {
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

  const removeProductFromQuotation = (productId) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.productId !== productId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      alert("⚠️ Debes agregar al menos un producto a la cotización");
      return;
    }

    // Obtener nombre del cliente si se seleccionó uno
    let clientName = formData.clientName;
    if (formData.customerId && !clientName) {
      const customer = customers.find(
        (c) => c.id === parseInt(formData.customerId)
      );
      clientName = customer?.name || "";
    }

    try {
      const payload = {
        customerId: formData.customerId || null,
        clientName: clientName,
        validUntil: formData.validUntil || null,
        status: formData.status,
        notes: formData.notes,
        items: formData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      };

      if (editingQuotation) {
        await api.put(`/quotations/${editingQuotation.id}`, payload);
      } else {
        await api.post("/quotations", payload);
      }

      fetchQuotations();
      closeModal();
      alert("✅ Cotización guardada exitosamente");
    } catch (error) {
      console.error("Error saving quotation:", error);
      alert(
        "❌ Error al guardar la cotización: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Borrador",
      },
      sent: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Enviada",
      },
      accepted: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Aceptada",
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Rechazada",
      },
      expired: {
        bg: "bg-orange-100",
        text: "text-orange-800",
        label: "Expirada",
      },
    };
    const badge = badges[status] || badges.draft;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  const stats = {
    total: Array.isArray(quotations) ? quotations.length : 0,
    pending: Array.isArray(quotations)
      ? quotations.filter((q) => q.status === "sent" || q.status === "draft")
          .length
      : 0,
    approved: Array.isArray(quotations)
      ? quotations.filter((q) => q.status === "accepted").length
      : 0,
    totalAmount: Array.isArray(quotations)
      ? quotations.reduce((sum, q) => sum + parseFloat(q.total || 0), 0)
      : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando cotizaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cotizaciones
            </h1>
            <p className="text-gray-600">
              {stats.total} cotizaciones registradas
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nueva Cotización
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprobadas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.approved}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${stats.totalAmount.toLocaleString("es-MX")}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quotations List */}
        {!Array.isArray(quotations) || quotations.length === 0 ? (
          <EmptyStates.NoQuotations />
        ) : (
          <div className="space-y-4">
            {quotations.map((quotation) => {
              const customer = Array.isArray(customers)
                ? customers.find((c) => c.id === quotation.customerId)
                : null;
              return (
                <div
                  key={quotation.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {quotation.quotationNumber || `COT-${quotation.id}`}
                          </h3>
                          {getStatusBadge(quotation.status)}
                        </div>
                        <p className="text-gray-600">
                          <span className="font-medium">Cliente:</span>{" "}
                          {customer?.name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(quotation.createdAt).toLocaleDateString(
                            "es-MX",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-3xl font-bold text-purple-600">
                          $
                          {parseFloat(quotation.total).toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Products Preview */}
                    {quotation.QuotationItems &&
                      quotation.QuotationItems.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Productos:
                          </h4>
                          <div className="space-y-2">
                            {quotation.QuotationItems.slice(0, 3).map(
                              (item, idx) => {
                                const product = products.find(
                                  (p) => p.id === item.productId
                                );
                                return (
                                  <div
                                    key={idx}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-gray-600">
                                      {product?.name || "Producto"} x{" "}
                                      {item.quantity}
                                    </span>
                                    <span className="font-medium text-gray-900">
                                      $
                                      {parseFloat(item.subtotal).toLocaleString(
                                        "es-MX"
                                      )}
                                    </span>
                                  </div>
                                );
                              }
                            )}
                            {quotation.QuotationItems.length > 3 && (
                              <p className="text-xs text-gray-500">
                                +{quotation.QuotationItems.length - 3} productos
                                más
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      {quotation.status === "pending" && (
                        <button
                          onClick={() => handleConvertToSale(quotation.id)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Convertir a Venta
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedQuotation(quotation)}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => handleDelete(quotation.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-xl flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedQuotation.quotationNumber ||
                    `COT-${selectedQuotation.id}`}
                </h2>
                <p className="text-purple-100 text-sm">
                  {new Date(selectedQuotation.createdAt).toLocaleDateString(
                    "es-MX"
                  )}
                </p>
              </div>
              <button
                onClick={() => setSelectedQuotation(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Información del Cliente
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 font-medium">
                    {selectedQuotation.clientName || "N/A"}
                  </p>
                </div>
              </div>

              {selectedQuotation.notes && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Notas
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedQuotation.notes}</p>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Productos
                </h3>
                <div className="space-y-3">
                  {selectedQuotation.items &&
                  selectedQuotation.items.length > 0 ? (
                    selectedQuotation.items.map((item, idx) => {
                      const product = Array.isArray(products)
                        ? products.find((p) => p.id === item.productId)
                        : null;
                      const subtotal =
                        parseFloat(item.unitPrice || 0) *
                        parseInt(item.quantity || 0);
                      return (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {product?.name ||
                                item.product?.name ||
                                "Producto"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Cantidad: {item.quantity} x $
                              {parseFloat(item.unitPrice).toFixed(2)}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-purple-600">
                            ${subtotal.toFixed(2)}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No hay productos en esta cotización
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-bold">
                    ${parseFloat(selectedQuotation.subtotal || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>IVA (16%):</span>
                  <span className="font-bold">
                    ${parseFloat(selectedQuotation.tax || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-purple-600">
                    ${parseFloat(selectedQuotation.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setSelectedQuotation(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cerrar
                </button>
                {selectedQuotation.status === "accepted" && (
                  <button
                    onClick={() => handleConvertToSale(selectedQuotation.id)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg font-bold flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Convertir a Venta
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center z-10">
              <h2 className="text-2xl font-black flex items-center gap-3">
                ✏️ {editingQuotation ? "Editar Cotización" : "Nueva Cotización"}
              </h2>
              <button
                onClick={closeModal}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Cliente Section */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Cliente (Opcional)
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => {
                      const customerId = e.target.value;
                      const customer = customers.find(
                        (c) => c.id === parseInt(customerId)
                      );
                      setFormData({
                        ...formData,
                        customerId: customerId,
                        clientName: customer?.name || "",
                      });
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
                  >
                    <option value="">Seleccionar cliente...</option>
                    {Array.isArray(customers) &&
                      customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Válido Hasta
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) =>
                      setFormData({ ...formData, validUntil: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Estado *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
                    required
                  >
                    <option value="draft">Borrador</option>
                    <option value="sent">Enviada</option>
                    <option value="accepted">Aceptada</option>
                    <option value="rejected">Rechazada</option>
                    <option value="expired">Expirada</option>
                  </select>
                </div>
              </div>

              {/* Products Section */}
              <div className="border-2 border-purple-200 rounded-2xl p-6 bg-purple-50">
                <h3 className="text-xl font-black text-purple-700 mb-4">
                  🛒 Productos de la Cotización
                </h3>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="col-span-2">
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
                    >
                      <option value="">Seleccionar producto</option>
                      {Array.isArray(products) &&
                        products.map((prod) => (
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
                      onClick={addProductToQuotation}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    >
                      ➕
                    </button>
                  </div>
                </div>

                {/* Items List */}
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
                              removeProductFromQuotation(item.productId)
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

              {/* Notes */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
                  rows="3"
                  placeholder="Condiciones, términos, observaciones..."
                ></textarea>
              </div>

              {/* Buttons */}
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
                  {editingQuotation ? "Guardar Cambios" : "Crear Cotización"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
