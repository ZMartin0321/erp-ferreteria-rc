import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ContextoAuth } from "../contexto/ContextoAutenticacion";

export default function RutaProtegida({ children }) {
  const { user, loading } = useContext(ContextoAuth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
