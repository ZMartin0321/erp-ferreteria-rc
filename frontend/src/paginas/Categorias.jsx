import React, { useEffect, useState } from "react";
import api from "../servicios/api";

export default function Categorias() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error al cargar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category = null) => {
    console.log("📝 abrirModal llamado con:", category);
    if (category) {
      setEditingCategory(category);
      const newFormData = {
        name: category.name,
        description: category.description || "",
      };
      console.log(
        "✏️ Configurando datos del formulario para edicion:",
        newFormData
      );
      setFormData(newFormData);
    } else {
      setEditingCategory(null);
      const newFormData = {
        name: "",
        description: "",
      };
      console.log(
        "➕ Configurando datos del formulario para nueva categoria:",
        newFormData
      );
      setFormData(newFormData);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
        alert("✅ Categoría actualizada exitosamente");
      } else {
        await api.post("/categories", formData);
        alert("✅ Categoría creada exitosamente");
      }
      fetchCategories();
      closeModal();
    } catch (error) {
      console.error("Error al guardar la categoria:", error);
      alert(
        "❌ Error al guardar la categoría: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;

    try {
      await api.delete(`/categories/${id}`);
      alert("✅ Categoría eliminada exitosamente");
      fetchCategories();
    } catch (error) {
      console.error("Error al eliminar la categoria:", error);
      alert(
        "❌ Error al eliminar la categoría: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📂</div>
          <div className="text-indigo-600 font-semibold text-xl">
            Cargando categorías...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -m-4 p-8">
      {/* Encabezado */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 rounded-3xl shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-7xl animate-bounce">📂</div>
              <div>
                <h1 className="text-5xl font-black mb-2">Categorías</h1>
                <p className="text-indigo-100 text-lg">
                  Organiza tus productos por categorías
                </p>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-3"
            >
              <span className="text-2xl">➕</span>
              Nueva Categoría
            </button>
          </div>

          {/* Indicadores clave */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
              <div className="text-sm text-indigo-100">Total Categorías</div>
              <div className="text-4xl font-black">{categories.length}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
              <div className="text-sm text-indigo-100">Activas</div>
              <div className="text-4xl font-black">{categories.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <div className="text-gray-500 text-xl font-semibold">
              No hay categorías registradas
            </div>
            <p className="text-gray-400 mt-2">¡Crea tu primera categoría!</p>
          </div>
        ) : (
          categories.map((category, index) => (
            <div
              key={category.id}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-3xl font-bold border-2 border-white/30">
                    {category.name[0].toUpperCase()}
                  </div>
                  <div className="text-white/80 font-mono text-sm">
                    #{category.id}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-indigo-100 text-sm">
                  {category.description || "Sin descripción"}
                </p>
              </div>

              <div className="p-6 flex gap-2">
                <button
                  onClick={() => openModal(category)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-xl">✏️</span>
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-xl">🗑️</span>
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de formulario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl">
              <h2 className="text-3xl font-black">
                {editingCategory ? "✏️ Editar Categoría" : "➕ Nueva Categoría"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Informacion de depuracion */}
              {process.env.NODE_ENV === "development" && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-xs">
                  <strong>Debug:</strong> formData = {JSON.stringify(formData)}
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                  placeholder="Ej: Herramientas"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                  placeholder="Descripción de la categoría..."
                  rows="4"
                ></textarea>
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
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  {editingCategory ? "Guardar Cambios" : "Crear Categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
