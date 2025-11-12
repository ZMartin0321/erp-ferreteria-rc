import React, { useState } from "react";

/**
 * Galería de imágenes con zoom y navegación
 */
const ImageGallery = ({ images = [], productName = "Producto" }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500">Sin imágenes disponibles</p>
        </div>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative group">
        <div
          className={`relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={currentImage}
            alt={`${productName} - Imagen ${selectedIndex + 1}`}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isZoomed ? "scale-150" : "scale-100"
            }`}
          />

          {/* Overlay de zoom */}
          {!isZoomed && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="bg-white/90 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                🔍 Click para ampliar
              </div>
            </div>
          )}
        </div>

        {/* Botones de navegación */}
        {images.length > 1 && !isZoomed && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              →
            </button>
          </>
        )}

        {/* Contador */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? "border-blue-500 shadow-lg scale-105"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <img
                src={image}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
