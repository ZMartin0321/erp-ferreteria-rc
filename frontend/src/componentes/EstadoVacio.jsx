import React from "react";

/**
 * Componente de estado vacío con ilustración
 */
const EmptyState = ({
  icon = "📦",
  title = "No hay datos disponibles",
  description = "Agrega elementos para empezar",
  action,
  actionLabel = "Agregar",
  illustration,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Ilustración o icono */}
      <div className="mb-6">
        {illustration ? (
          <img
            src={illustration}
            alt={title}
            className="w-64 h-64 object-contain opacity-80"
          />
        ) : (
          <div className="text-8xl opacity-50">{icon}</div>
        )}
      </div>

      {/* Título */}
      <h3 className="text-2xl font-bold text-gray-700 mb-2">{title}</h3>

      {/* Descripción */}
      <p className="text-gray-500 text-center max-w-md mb-8">{description}</p>

      {/* Acción */}
      {action && (
        <button
          onClick={action}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          {actionLabel}
        </button>
      )}

      {/* Decoración */}
      <div className="mt-12 flex gap-2">
        <div
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
};

/**
 * Estados vacíos predefinidos
 */
export const EmptyStates = {
  NoProducts: (props) => (
    <EmptyState
      icon="📦"
      title="No hay productos registrados"
      description="Comienza agregando tu primer producto al inventario"
      actionLabel="➕ Agregar Producto"
      {...props}
    />
  ),

  NoSales: (props) => (
    <EmptyState
      icon="🛒"
      title="No hay ventas registradas"
      description="Registra tu primera venta para comenzar a generar ingresos"
      actionLabel="➕ Nueva Venta"
      {...props}
    />
  ),

  NoPurchases: (props) => (
    <EmptyState
      icon="📦"
      title="No hay compras registradas"
      description="Registra compras a proveedores para mantener el inventario"
      actionLabel="➕ Nueva Compra"
      {...props}
    />
  ),

  NoCustomers: (props) => (
    <EmptyState
      icon="👥"
      title="No hay clientes registrados"
      description="Agrega clientes para gestionar ventas y créditos"
      actionLabel="➕ Agregar Cliente"
      {...props}
    />
  ),

  NoQuotations: (props) => (
    <EmptyState
      icon="📋"
      title="No hay cotizaciones"
      description="Crea cotizaciones profesionales para tus clientes"
      actionLabel="➕ Nueva Cotización"
      {...props}
    />
  ),

  NoSuppliers: (props) => (
    <EmptyState
      icon="🏢"
      title="No hay proveedores registrados"
      description="Agrega proveedores para gestionar tus compras"
      actionLabel="➕ Agregar Proveedor"
      {...props}
    />
  ),

  NoResults: (props) => (
    <EmptyState
      icon="🔍"
      title="No se encontraron resultados"
      description="Intenta ajustar los filtros de búsqueda"
      {...props}
    />
  ),

  Error: (props) => (
    <EmptyState
      icon="⚠️"
      title="Ocurrió un error"
      description="No pudimos cargar los datos. Por favor, intenta de nuevo"
      actionLabel="🔄 Reintentar"
      {...props}
    />
  ),
};

export default EmptyState;
