import { useState, useEffect } from "react";
import api from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { branding } from "../config/branding";

// Colores por defecto si branding.theme no está disponible
const defaultColors = {
  primary: "#3b82f6",
  accent: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
};

const colors = branding?.theme?.colors || defaultColors;

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    sales: { total: 0, count: 0, daily: [] },
    products: { total: 0, lowStock: 0, topSelling: [] },
    customers: { total: 0, business: 0, individual: 0 },
    revenue: { today: 0, week: 0, month: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Cargar estadísticas de ventas
      const salesRes = await api.get("/sales/stats");

      // Cargar productos
      const productsRes = await api.get("/products");
      const products = productsRes.data.data || productsRes.data || [];

      // Cargar clientes (si existe el endpoint)
      let customersData = { total: 0, business: 0, individual: 0 };
      try {
        const customersRes = await api.get("/customers");
        const customers = customersRes.data.data || customersRes.data || [];
        customersData = {
          total: customers.length,
          business: customers.filter((c) => c.customerType === "business")
            .length,
          individual: customers.filter((c) => c.customerType === "individual")
            .length,
        };
      } catch (err) {
        console.log("Endpoint customers no disponible");
      }

      setStats({
        sales: {
          total: salesRes.data.totalAmount || 0,
          count: salesRes.data.totalSales || 0,
          daily: salesRes.data.dailySales || [],
        },
        products: {
          total: products.length,
          lowStock: products.filter((p) => p.stock <= p.minStock).length,
          topSelling: products.slice(0, 5),
        },
        customers: customersData,
        revenue: {
          today: salesRes.data.todayRevenue || 0,
          week: salesRes.data.weekRevenue || 0,
          month: salesRes.data.monthRevenue || 0,
        },
      });
    } catch (error) {
      console.error("Error al cargar estadisticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  // Datos para gráfica de ventas (línea)
  const salesChartData = {
    labels: stats.sales.daily.map((d) => d.date),
    datasets: [
      {
        label: "Ventas Diarias",
        data: stats.sales.daily.map((d) => d.total),
        borderColor: colors.primary,
        backgroundColor: `${colors.primary}20`,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Datos para gráfica de productos más vendidos (barras)
  const productsChartData = {
    labels: stats.products.topSelling.map(
      (p) => p.name?.slice(0, 20) + "..." || "Producto"
    ),
    datasets: [
      {
        label: "Stock Actual",
        data: stats.products.topSelling.map((p) => p.stock || 0),
        backgroundColor: [
          colors.primary,
          colors.accent,
          colors.success,
          colors.warning,
          colors.error,
        ],
      },
    ],
  };

  // Datos para gráfica de clientes (dona)
  const customersChartData = {
    labels: ["Empresas", "Individuales"],
    datasets: [
      {
        data: [stats.customers.business, stats.customers.individual],
        backgroundColor: [colors.primary, colors.accent],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Resumen general de la ferretería</p>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Ventas del Mes */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-green-600">+12.5%</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Ventas del Mes
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ${stats.revenue.month.toLocaleString("es-MX")}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {stats.sales.count} ventas realizadas
            </p>
          </div>

          {/* Productos Totales */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              {stats.products.lowStock > 0 && (
                <span className="text-sm font-medium text-red-600">
                  ⚠️ {stats.products.lowStock}
                </span>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Productos
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.products.total}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {stats.products.lowStock > 0
                ? `${stats.products.lowStock} con stock bajo`
                : "Stock normal"}
            </p>
          </div>

          {/* Clientes */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Clientes</h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.customers.total}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {stats.customers.business} empresas, {stats.customers.individual}{" "}
              individuales
            </p>
          </div>

          {/* Ventas Hoy */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-blue-600">Hoy</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Ingresos del Día
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ${stats.revenue.today.toLocaleString("es-MX")}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Semana: ${stats.revenue.week.toLocaleString("es-MX")}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ventas Diarias */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Ventas Diarias
            </h2>
            <div className="h-80">
              {stats.sales.daily.length > 0 ? (
                <Line data={salesChartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No hay datos disponibles
                </div>
              )}
            </div>
          </div>

          {/* Productos con Más Stock */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Top 5 Productos por Stock
            </h2>
            <div className="h-80">
              {stats.products.topSelling.length > 0 ? (
                <Bar data={productsChartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No hay datos disponibles
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clientes Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Distribución de Clientes
            </h2>
            <div className="h-64">
              {stats.customers.total > 0 ? (
                <Doughnut data={customersChartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No hay datos disponibles
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg p-4 text-left transition-all transform hover:scale-105">
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <h3 className="font-bold">Nueva Venta</h3>
                <p className="text-sm opacity-90">Registrar venta</p>
              </button>

              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg p-4 text-left transition-all transform hover:scale-105">
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <h3 className="font-bold">Nueva Compra</h3>
                <p className="text-sm opacity-90">Registrar compra</p>
              </button>

              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg p-4 text-left transition-all transform hover:scale-105">
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <h3 className="font-bold">Nuevo Producto</h3>
                <p className="text-sm opacity-90">Agregar producto</p>
              </button>

              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg p-4 text-left transition-all transform hover:scale-105">
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="font-bold">Nuevo Reporte</h3>
                <p className="text-sm opacity-90">Generar reporte</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
