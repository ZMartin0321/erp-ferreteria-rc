import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get("/suppliers");
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error loading suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (supplier = null) => {
    console.log("📝 openModal called with:", supplier);
    if (supplier) {
      setEditingSupplier(supplier);
      const newFormData = {
        name: supplier.name,
        contact: supplier.contact || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        address: supplier.address || "",
      };
      console.log("✏️ Setting form data for editing:", newFormData);
      setFormData(newFormData);
    } else {
      setEditingSupplier(null);
      const newFormData = {
        name: "",
        contact: "",
        phone: "",
        email: "",
        address: "",
      };
      console.log("➕ Setting form data for new supplier:", newFormData);
      setFormData(newFormData);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
    setFormData({
      name: "",
      contact: "",
      phone: "",
      email: "",
      address: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier.id}`, formData);
        alert("✅ Proveedor actualizado exitosamente");
      } else {
        await api.post("/suppliers", formData);
        alert("✅ Proveedor creado exitosamente");
      }
      fetchSuppliers();
      closeModal();
    } catch (error) {
      console.error("Error saving supplier:", error);
      alert(
        "❌ Error al guardar el proveedor: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este proveedor?")) return;

    try {
      await api.delete(`/suppliers/${id}`);
      alert("✅ Proveedor eliminado exitosamente");
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert(
        "❌ Error al eliminar el proveedor: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏢</div>
          <div className="text-orange-600 font-semibold text-xl">
            Cargando proveedores...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 -m-4 p-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white p-8 rounded-3xl shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-7xl animate-bounce">🏢</div>
              <div>
                <h1 className="text-5xl font-black mb-2">Proveedores</h1>
                <p className="text-orange-100 text-lg">
                  Gestión de proveedores y contactos
                </p>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-3"
            >
              <span className="text-2xl">➕</span>
              Nuevo Proveedor
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
              <div className="text-sm text-orange-100">Total Proveedores</div>
              <div className="text-4xl font-black">{suppliers.length}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
              <div className="text-sm text-orange-100">Activos</div>
              <div className="text-4xl font-black">{suppliers.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de proveedores */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <div className="text-gray-500 text-xl font-semibold">
                      No hay proveedores registrados
                    </div>
                    <p className="text-gray-400 mt-2">
                      ¡Agrega tu primer proveedor!
                    </p>
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier, index) => (
                  <tr
                    key={supplier.id}
                    className="group hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-5">
                      <div className="inline-block bg-gradient-to-br from-orange-100 to-red-100 px-4 py-2 rounded-xl font-mono text-sm font-bold text-orange-700">
                        #{supplier.id}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {supplier.name[0].toUpperCase()}
                        </div>
                        <div className="font-semibold text-gray-800 text-lg">
                          {supplier.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-gray-700">
                        {supplier.contact || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-gray-700 font-mono">
                        {supplier.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-gray-700">
                        {supplier.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(supplier)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                          title="Editar proveedor"
                        >
                          <span className="text-xl">✏️</span>
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                          title="Eliminar proveedor"
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-3xl">
              <h2 className="text-3xl font-black">
                {editingSupplier ? "✏️ Editar Proveedor" : "➕ Nuevo Proveedor"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-gray-700 font-bold mb-2">
                    Nombre del Proveedor *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-4 focus:ring-orange-100 transition-all"
                    placeholder="Ej: Distribuidora ABC"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    value={formData.contact || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-4 focus:ring-orange-100 transition-all"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-4 focus:ring-orange-100 transition-all font-mono"
                    placeholder="555-0123"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-700 font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-4 focus:ring-orange-100 transition-all"
                    placeholder="contacto@proveedor.com"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-700 font-bold mb-2">
                    Dirección
                  </label>
                  <textarea
                    value={formData.address || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-4 focus:ring-orange-100 transition-all"
                    placeholder="Dirección completa del proveedor..."
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
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  {editingSupplier ? "Guardar Cambios" : "Crear Proveedor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
