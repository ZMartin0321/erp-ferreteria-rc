import axios from "axios";

/**
 * Instancia configurada de Axios para comunicación con la API
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor de peticiones - Agrega token de autenticación
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de respuestas - Manejo centralizado de errores
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log de errores en desarrollo
    if (import.meta.env.DEV) {
      console.error("API Error:", error);
    }

    // Manejo de errores específicos
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Token inválido o expirado
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          break;

        case 403:
          // Sin permisos
          console.error("Acceso prohibido");
          break;

        case 404:
          // Recurso no encontrado
          console.error("Recurso no encontrado");
          break;

        case 422:
          // Error de validación
          console.error("Error de validación:", data);
          break;

        case 500:
          // Error del servidor
          console.error("Error del servidor");
          break;

        default:
          console.error("Error desconocido:", status);
      }

      // Retornar mensaje de error formateado
      const errorMessage =
        data?.message || data?.error || "Ocurrió un error inesperado";

      return Promise.reject({
        message: errorMessage,
        status,
        data,
      });
    } else if (error.request) {
      // Error de red
      return Promise.reject({
        message: "No se pudo conectar con el servidor. Verifique su conexión.",
        isNetworkError: true,
      });
    } else {
      // Error desconocido
      return Promise.reject({
        message: error.message || "Ocurrió un error inesperado",
      });
    }
  }
);

/**
 * Métodos helper para operaciones CRUD
 */
export const apiService = {
  // GET
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE
  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
