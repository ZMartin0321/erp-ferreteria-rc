import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../servicios/api";

export default function Registro() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "admin", // Todos los usuarios son admin
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-xl p-12 rounded-3xl shadow-2xl text-center max-w-md animate-scale-in">
          <div className="text-8xl mb-6 animate-bounce">✅</div>
          <h2 className="text-4xl font-black text-green-600 mb-4">
            ¡Cuenta Creada!
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Tu cuenta ha sido creada exitosamente.
          </p>
          <div className="text-sm text-gray-500">Redirigiendo al login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decoraciones de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48 animate-pulse"></div>
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8 animate-slide-down">
          <div className="inline-block bg-white/20 backdrop-blur-md p-6 rounded-3xl mb-6 border border-white/30 shadow-2xl">
            <div className="text-6xl">🔧</div>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Ferretería RC</h1>
          <p className="text-blue-100 text-lg">Crea tu cuenta para comenzar</p>
        </div>

        {/* Card de registro */}
        <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 animate-fade-in-up">
          <h2 className="text-2xl font-black text-gray-800 mb-6 text-center">
            Registro
          </h2>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-shake">
              <span className="text-2xl">⚠️</span>
              <div className="text-sm">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold text-sm">
                Nombre Completo
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                value={formData.name}
                onChange={handleChange}
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold text-sm">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold text-sm">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all pr-12"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? "�️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold text-sm">
                Confirmar Contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creando cuenta...
                </>
              ) : (
                <>Crear Cuenta</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-600 hover:text-indigo-600 transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/90 text-sm">
          <p>© 2025 Ferretería RC - Sistema de Gestión</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
