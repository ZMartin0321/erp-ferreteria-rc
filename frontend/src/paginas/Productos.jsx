import { useState, useEffect } from "react";
import api from "../servicios/api";
import TarjetaProducto from "../componentes/TarjetaProducto";
import GaleriaImagenes from "../componentes/GaleriaImagenes";
import EstadoVacio from "../componentes/EstadoVacio";
import { branding } from "../configuracion/branding";

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    cost: "",
    stock: "",
    minStock: "",
    maxStock: "",
    location: "",
    unit: "pieza",
    categoryId: "",
    brand: "",
    model: "",
    barcode: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      // El backend devuelve { message, count, data }
      const productsList = response.data.data || [];
      console.log(`📦 Productos cargados: ${productsList.length}`);
      setProducts(productsList);
    } catch (error) {
      console.error("❌ Error al cargar productos:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = () => {
    api.get("/categories").then((r) => setCategories(r.data));
  };

  // Generar SKU automático basado en el nombre del producto y categoría
  const generateSKU = (productName, categoryId) => {
    if (!productName || !categoryId) return "";

    const category = categories.find((c) => c.id === parseInt(categoryId));
    const categoryPrefix = category
      ? category.name.substring(0, 3).toUpperCase()
      : "PRD";
    const namePrefix = productName
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, "");
    const timestamp = Date.now().toString().slice(-4);

    return `${categoryPrefix}-${namePrefix}-${timestamp}`;
  };

  // Actualizar SKU cuando cambia el nombre o categoría (solo para productos nuevos)
  useEffect(() => {
    if (!editingProduct && formData.name && formData.categoryId) {
      const newSKU = generateSKU(formData.name, formData.categoryId);
      setFormData((prev) => ({ ...prev, sku: newSKU }));
    }
  }, [formData.name, formData.categoryId, editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingProduct) {
        response = await api.put(`/products/${editingProduct.id}`, formData);
        console.log("✅ Producto actualizado:", response.data);
        alert("✅ Producto actualizado exitosamente");
      } else {
        response = await api.post("/products", formData);
        console.log("✅ Producto creado:", response.data);
        alert("✅ Producto creado exitosamente");
      }

      // Recargar productos y cerrar modal
      await fetchProducts();
      closeModal();
    } catch (error) {
      console.error("❌ Error al guardar el producto:", error);
      alert(
        "❌ Error al guardar el producto: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await api.delete(`/products/${id}`);
        alert("✅ Producto eliminado exitosamente");
        fetchProducts();
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        alert(
          "❌ Error al eliminar el producto: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const openModal = (product = null) => {
    console.log("📝 abrirModal llamado con:", product);
    if (product) {
      setEditingProduct(product);
      const newFormData = {
        name: product.name,
        sku: product.sku,
        description: product.description || "",
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
      };
      console.log(
        "✏️ Configurando datos del formulario para edicion:",
        newFormData
      );
      setFormData(newFormData);
    } else {
      setEditingProduct(null);
      const newFormData = {
        name: "",
        sku: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
      };
      console.log(
        "➕ Configurando datos del formulario para nuevo producto:",
        newFormData
      );
      setFormData(newFormData);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
    });
  };

  const handleImageUpload = async (productId, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("imagen", file);

    setUploadingImage(true);
    try {
      await api.post(`/products/${productId}/imagen`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Imagen subida exitosamente");
      fetchProducts();
      setSelectedImage(null);
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert(
        "❌ Error al subir imagen: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (productId, imageUrl) => {
    if (!window.confirm("¿Deseas eliminar esta imagen?")) return;

    try {
      await api.delete(`/products/${productId}/imagen`, {
        data: { imageUrl },
      });
      alert("✅ Imagen eliminada exitosamente");
      fetchProducts();
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      alert(
        "❌ Error al eliminar imagen: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const getProductImage = (product) => {
    try {
      // Parsear images si es string JSON
      let images = product.images;
      if (typeof images === "string") {
        images = JSON.parse(images);
      }

      if (images && Array.isArray(images) && images.length > 0) {
        const imagePath = images[0];

        // Si es URL externa completa (http/https), devolverla directamente
        if (imagePath.startsWith("http")) {
          return imagePath;
        }

        // Construir URL completa para imágenes locales
        const apiUrl =
          import.meta.env.VITE_API_URL || "http://localhost:4000/api";
        const baseUrl = apiUrl.replace("/api", "");
        return `${baseUrl}${imagePath}`;
      }
    } catch (error) {
      console.error("Error al parsear images:", error);
    }
    return null;
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.sku || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📦</div>
          <div className="text-blue-600 font-semibold text-xl">
            Cargando productos...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 -m-4 p-8">
      {/* Header épico */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8 rounded-3xl shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-7xl animate-bounce">📦</div>
            <div>
              <h1 className="text-5xl font-black mb-2">Gestión de Productos</h1>
              <p className="text-blue-100 text-lg">
                Control total de tu inventario en tiempo real
              </p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
            <div className="text-sm text-blue-100">Total Productos</div>
            <div className="text-5xl font-black">{products.length}</div>
          </div>
        </div>
      </div>

      {/* Buscador y botón de nuevo producto */}
      <div className="mb-8 flex gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-3xl">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-5 text-lg rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all shadow-lg bg-white"
          />
        </div>
        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-5 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-3"
        >
          <span className="text-2xl">➕</span>
          <span className="text-lg">Nuevo Producto</span>
        </button>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-5 text-right text-sm font-black uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-6xl mb-4">📭</div>
                    <div className="text-gray-500 text-xl font-semibold">
                      {searchTerm
                        ? "No se encontraron productos"
                        : "No hay productos registrados"}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, index) => (
                  <tr
                    key={p.id}
                    className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {getProductImage(p) ? (
                          <div className="w-16 h-16 rounded-xl shadow-lg overflow-hidden bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                            <img
                              src={getProductImage(p)}
                              alt={p.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-white border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <svg
                              className="w-6 h-6 text-gray-400 mb-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-xs text-gray-400 font-medium">
                              Sin foto
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-800 text-lg group-hover:text-purple-600 transition-colors">
                            {p.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {p.description || "Sin descripción"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-block bg-gray-100 px-3 py-1 rounded-lg font-mono text-sm font-semibold text-gray-700">
                        {p.sku}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                        <span>🏷️</span>
                        {p.category?.name || "Sin categoría"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="text-2xl font-black text-green-600">
                        ${parseFloat(p.price).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div
                        className={`inline-block px-4 py-2 rounded-xl font-bold text-lg ${
                          p.stock > 50
                            ? "bg-green-100 text-green-700"
                            : p.stock > 10
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700 animate-pulse"
                        }`}
                      >
                        {p.stock} uds
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {p.stock > 10 ? (
                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Disponible
                        </span>
                      ) : p.stock > 0 ? (
                        <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                          Stock Bajo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                          Agotado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <label
                          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-110 transition-all cursor-pointer"
                          title="Subir imagen"
                        >
                          📷
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                handleImageUpload(p.id, e.target.files[0]);
                                e.target.value = "";
                              }
                            }}
                          />
                        </label>
                        <button
                          onClick={() => openModal(p)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-110 transition-all"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-110 transition-all"
                          title="Eliminar"
                        >
                          🗑️
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-3xl">
              <h2 className="text-3xl font-black">
                {editingProduct ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-gray-700 font-bold mb-2">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Ej: Martillo de Acero"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-mono"
                    placeholder="MAR-001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Categoría *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Precio *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="0"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-700 font-bold mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Descripción del producto..."
                    rows="3"
                  ></textarea>
                </div>
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
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  {editingProduct ? "Guardar Cambios" : "Crear Producto"}
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
