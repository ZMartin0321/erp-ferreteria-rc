import React, { useState } from "react";
import { branding } from "../configuracion/branding";

/**
 * Componente de tarjeta de producto profesional con imagen
 */
const ProductCard = ({
  product,
  onEdit,
  onDelete,
  onClick,
  showActions = true,
}) => {
  const [imageError, setImageError] = useState(false);

  const getStockStatus = () => {
    if (product.stock === 0) return "outOfStock";
    if (product.stock <= product.minStock) return "lowStock";
    return "active";
  };

  const stockStatus = getStockStatus();
  const statusConfig = branding.productStatus[stockStatus];

  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl =
    !imageError && product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop";

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Imagen del producto */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Badge de stock */}
        <div
          className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
          style={{
            backgroundColor: statusConfig.bg,
            color: statusConfig.color,
          }}
        >
          {stockStatus === "outOfStock" && "🚫 Agotado"}
          {stockStatus === "lowStock" && "⚠️ Stock Bajo"}
          {stockStatus === "active" && `✅ ${product.stock} disponibles`}
        </div>

        {/* SKU Badge */}
        {product.sku && (
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-mono">
            {product.sku}
          </div>
        )}

        {/* Marca Badge */}
        {product.brand && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
            {product.brand}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Nombre y categoría */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          {product.category && (
            <p className="text-sm text-gray-500">📦 {product.category.name}</p>
          )}
        </div>

        {/* Descripción */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Información adicional */}
        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
          {product.model && (
            <span className="flex items-center gap-1">
              <span className="font-semibold">Modelo:</span>
              {product.model}
            </span>
          )}
          {product.unit && (
            <span className="flex items-center gap-1">📏 {product.unit}</span>
          )}
        </div>

        {/* Precios */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              ${parseFloat(product.price).toFixed(2)}
            </div>
            {product.cost && (
              <div className="text-xs text-gray-500">
                Costo: ${parseFloat(product.cost).toFixed(2)}
              </div>
            )}
          </div>
          {product.cost && (
            <div className="text-right">
              <div className="text-xs text-gray-500">Margen</div>
              <div className="text-sm font-semibold text-green-600">
                {(
                  ((product.price - product.cost) / product.cost) *
                  100
                ).toFixed(1)}
                %
              </div>
            </div>
          )}
        </div>

        {/* Barra de stock */}
        {product.maxStock && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Stock</span>
              <span>
                {product.stock} / {product.maxStock}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  stockStatus === "outOfStock"
                    ? "bg-red-500"
                    : stockStatus === "lowStock"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{
                  width: `${Math.min((product.stock / product.maxStock) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Acciones */}
        {showActions && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(product);
              }}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              ✏️ Editar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(product);
              }}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              🗑️ Eliminar
            </button>
          </div>
        )}

        {/* Ubicación */}
        {product.location && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
            📍 Ubicación:{" "}
            <span className="font-semibold text-gray-700">
              {product.location}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
