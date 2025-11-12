import React from "react";
import { Routes, Route } from "react-router-dom";
import { ProveedorAuth } from "./contexto/ContextoAutenticacion";
import PanelControl from "./paginas/PanelControl";
import Productos from "./paginas/Productos";
import Ventas from "./paginas/Ventas";
import Compras from "./paginas/Compras";
import Proveedores from "./paginas/Proveedores";
import Categorias from "./paginas/Categorias";
import Clientes from "./paginas/Clientes";
import Cotizaciones from "./paginas/Cotizaciones";
import InicioSesion from "./paginas/InicioSesion";
import Registro from "./paginas/Registro";
import BarraNavegacion from "./componentes/BarraNavegacion";
import RutaProtegida from "./componentes/RutaProtegida";

export default function App() {
  return (
    <ProveedorAuth>
      <div className="min-h-screen bg-gray-100">
        <BarraNavegacion />
        <Routes>
          <Route path="/login" element={<InicioSesion />} />
          <Route path="/register" element={<Registro />} />
          <Route
            path="/"
            element={
              <RutaProtegida>
                <div className="container mx-auto p-4">
                  <PanelControl />
                </div>
              </RutaProtegida>
            }
          />
          <Route
            path="/products"
            element={
              <RutaProtegida>
                <div className="container mx-auto p-4">
                  <Productos />
                </div>
              </RutaProtegida>
            }
          />
          <Route
            path="/sales"
            element={
              <RutaProtegida>
                <div className="container mx-auto p-4">
                  <Ventas />
                </div>
              </RutaProtegida>
            }
          />
          <Route
            path="/purchases"
            element={
              <RutaProtegida>
                <div className="container mx-auto p-4">
                  <Compras />
                </div>
              </RutaProtegida>
            }
          />
          <Route
            path="/suppliers"
            element={
              <RutaProtegida>
                <div className="container mx-auto p-4">
                  <Proveedores />
                </div>
              </RutaProtegida>
            }
          />
          <Route
            path="/categories"
            element={
              <RutaProtegida>
                <div className="container mx-auto p-4">
                  <Categorias />
                </div>
              </RutaProtegida>
            }
          />
          <Route
            path="/customers"
            element={
              <RutaProtegida>
                <div className="container mx-auto p-4">
                  <Clientes />
                </div>
              </RutaProtegida>
            }
          />
          <Route
            path="/quotations"
            element={
              <RutaProtegida>
                <div className="container mx-auto p-4">
                  <Cotizaciones />
                </div>
              </RutaProtegida>
            }
          />
        </Routes>
      </div>
    </ProveedorAuth>
  );
}
