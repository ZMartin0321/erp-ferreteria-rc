import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Lado izquierdo - Imagen de fondo */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Imagen de ferretería */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1920&h=1080&fit=crop)",
          }}
        />

        {/* Overlay oscuro con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/90 to-purple-900/95" />

        {/* Contenido sobre la imagen */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-16 w-full">
          {/* Logo grande */}
          <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="flex items-center gap-4">
                {/* Icono de martillo y llave */}
                <div className="text-6xl">🔨</div>
                <div>
                  <h1 className="text-5xl font-black mb-2">
                    <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                      FERRETERÍA
                    </span>
                  </h1>
                  <p className="text-2xl font-bold text-blue-300">
                    RC Professional
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Características */}
          <div className="space-y-6 max-w-md">
            <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-3xl">📊</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Gestión Completa</h3>
                <p className="text-blue-200 text-sm">
                  Controla ventas, compras, inventario y clientes en un solo
                  lugar
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-3xl">📦</div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Inventario en Tiempo Real
                </h3>
                <p className="text-blue-200 text-sm">
                  Alertas de stock bajo y rastreo completo de movimientos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Reportes Profesionales
                </h3>
                <p className="text-blue-200 text-sm">
                  Estadísticas detalladas y análisis de tu negocio
                </p>
              </div>
            </div>
          </div>

          {/* Decoración */}
          <div className="mt-12 flex gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
            <div
              className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"
              style={{ animationDelay: "200ms" }}
            />
            <div
              className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"
              style={{ animationDelay: "400ms" }}
            />
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario de login */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 relative">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a8a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo móvil */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-lg">
              <span className="text-4xl">🔨</span>
              <div className="text-left">
                <h1 className="text-2xl font-black text-blue-900">
                  FERRETERÍA
                </h1>
                <p className="text-sm font-semibold text-amber-600">
                  RC Professional
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta de login */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-200">
            {/* Encabezado */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-gray-600">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 flex items-start gap-3 animate-shake">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📧 Correo Electrónico
                </label>
                <input
                  type="email"
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all text-gray-800 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔒 Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all text-gray-800 font-medium pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Botón de login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Enlace a registro */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                ¿No tienes cuenta?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>

            {/* Credenciales de demo */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs font-semibold text-blue-900 mb-2">
                📌 Credenciales de Demo:
              </p>
              <div className="space-y-1 text-xs text-blue-700">
                <p>
                  <strong>Admin:</strong> admin@ferreteria.com | admin123
                </p>
                <p>
                  <strong>Vendedor:</strong> vendedor1@ferreteria.com | admin123
                </p>
              </div>
            </div>
          </div>

          {/* Footer con información */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Conexión Segura</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
              <span>© 2025 Ferretería RC Pro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
