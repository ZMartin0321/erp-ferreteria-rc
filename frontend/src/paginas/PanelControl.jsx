import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../servicios/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PanelControl() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    sales: { total: 0, count: 0 },
    products: { total: 0, lowStock: 0 },
    customers: { total: 0 },
    revenue: { today: 0, week: 0, month: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

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

      // Cargar ventas recientes
      const salesListRes = await api.get("/sales");
      const allSales = salesListRes.data.data || [];

      // Cargar clientes
      const customersRes = await api.get("/customers");
      const customers = customersRes.data.data || [];

      // Top 5 ventas recientes
      const recent = allSales.slice(0, 5);
      setRecentSales(recent);

      // Datos para gráfico de ventas diarias (últimos 7 días)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString("es-MX", { weekday: "short" });

        const daySales = allSales.filter((sale) => {
          const saleDate = new Date(sale.createdAt);
          return saleDate.toDateString() === date.toDateString();
        });

        const dayTotal = daySales.reduce(
          (sum, sale) => sum + parseFloat(sale.total || 0),
          0
        );

        last7Days.push({
          day: dayName,
          ventas: dayTotal,
          cantidad: daySales.length,
        });
      }
      setSalesData(last7Days);

      // Datos mensuales (últimos 6 meses)
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString("es-MX", { month: "short" });

        const monthSales = allSales.filter((sale) => {
          const saleDate = new Date(sale.createdAt);
          return (
            saleDate.getMonth() === date.getMonth() &&
            saleDate.getFullYear() === date.getFullYear()
          );
        });

        const monthTotal = monthSales.reduce(
          (sum, sale) => sum + parseFloat(sale.total || 0),
          0
        );

        last6Months.push({
          mes: monthName,
          ingresos: monthTotal,
          ventas: monthSales.length,
        });
      }
      setMonthlyData(last6Months);

      // Top productos más vendidos
      const productSales = {};
      allSales.forEach((sale) => {
        if (sale.items && Array.isArray(sale.items)) {
          sale.items.forEach((item) => {
            const productName =
              item.product?.name || `Producto ${item.productId}`;
            if (!productSales[productName]) {
              productSales[productName] = {
                name: productName,
                cantidad: 0,
                ingresos: 0,
              };
            }
            productSales[productName].cantidad += parseInt(item.quantity || 0);
            productSales[productName].ingresos +=
              parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0);
          });
        }
      });

      const topProds = Object.values(productSales)
        .sort((a, b) => b.ingresos - a.ingresos)
        .slice(0, 5);
      setTopProducts(topProds);

      setStats({
        sales: {
          total: salesRes.data.totalAmount || 0,
          count: salesRes.data.totalSales || 0,
        },
        products: {
          total: products.length,
          lowStock: products.filter((p) => p.stock <= p.minStock).length,
        },
        customers: { total: customers.length },
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">📊</span>
            </div>
          </div>
          <p className="text-slate-600 font-semibold text-lg">
            Cargando estadísticas...
          </p>
        </div>
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 -m-4 p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header Premium */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl mb-8 p-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mb-32"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl">
                  <span className="text-6xl">📊</span>
                </div>
                <div>
                  <h1 className="text-5xl font-black text-white mb-2">
                    Panel de Control
                  </h1>
                  <p className="text-blue-100 text-lg font-medium">
                    Análisis y métricas en tiempo real
                  </p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/30">
                <div className="text-sm text-blue-100">Hoy</div>
                <div className="text-2xl font-bold text-white">
                  {new Date().toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </div>
            </div>

            {/* KPIs Premium */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-white/30 p-3 rounded-xl">
                    <span className="text-3xl">💰</span>
                  </div>
                  <span className="text-emerald-300 text-sm font-bold bg-emerald-500/20 px-3 py-1 rounded-full">
                    +12.5%
                  </span>
                </div>
                <div className="text-blue-100 text-sm mb-1">Ventas del Mes</div>
                <div className="text-4xl font-black text-white">
                  $
                  {stats.revenue.month.toLocaleString("es-MX", {
                    maximumFractionDigits: 0,
                  })}
                </div>
                <div className="text-xs text-blue-200 mt-2">
                  {stats.sales.count} transacciones
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-white/30 p-3 rounded-xl">
                    <span className="text-3xl">📦</span>
                  </div>
                  {stats.products.lowStock > 0 && (
                    <span className="text-orange-300 text-sm font-bold bg-orange-500/20 px-3 py-1 rounded-full">
                      ⚠️ {stats.products.lowStock}
                    </span>
                  )}
                </div>
                <div className="text-blue-100 text-sm mb-1">
                  Productos Totales
                </div>
                <div className="text-4xl font-black text-white">
                  {stats.products.total}
                </div>
                <div className="text-xs text-blue-200 mt-2">
                  En catálogo activo
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-white/30 p-3 rounded-xl">
                    <span className="text-3xl">👥</span>
                  </div>
                </div>
                <div className="text-blue-100 text-sm mb-1">
                  Clientes Activos
                </div>
                <div className="text-4xl font-black text-white">
                  {stats.customers.total}
                </div>
                <div className="text-xs text-blue-200 mt-2">
                  Registrados en el sistema
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-white/30 p-3 rounded-xl">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <span className="text-blue-200 text-xs font-semibold">
                    HOY
                  </span>
                </div>
                <div className="text-blue-100 text-sm mb-1">
                  Ingresos del Día
                </div>
                <div className="text-4xl font-black text-white">
                  $
                  {stats.revenue.today.toLocaleString("es-MX", {
                    maximumFractionDigits: 0,
                  })}
                </div>
                <div className="text-xs text-blue-200 mt-2">
                  Semana: $
                  {stats.revenue.week.toLocaleString("es-MX", {
                    maximumFractionDigits: 0,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos y Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Gráfico de Ventas Semanales */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-2xl">📈</span>
                  Ventas de la Semana
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Tendencia de los últimos 7 días
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "12px",
                    color: "white",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVentas)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Productos */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Top Productos
            </h3>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-700 text-sm">
                        {product.name.length > 20
                          ? product.name.substring(0, 20) + "..."
                          : product.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {product.cantidad} vendidos
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-600 text-sm">
                      ${product.ingresos.toFixed(0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Segunda fila de gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gráfico de Ingresos Mensuales */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">💵</span>
              Ingresos Mensuales
            </h3>
            <p className="text-slate-500 text-sm mb-4">
              Últimos 6 meses de facturación
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "12px",
                    color: "white",
                  }}
                />
                <Bar dataKey="ingresos" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ventas Recientes */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🔔</span>
              Ventas Recientes
            </h3>
            <div className="space-y-3">
              {recentSales.length > 0 ? (
                recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl hover:shadow-md transition-all border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold">
                        {sale.clientName?.charAt(0).toUpperCase() || "V"}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-700">
                          {sale.clientName || "Cliente"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(sale.createdAt).toLocaleDateString("es-MX")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600 text-lg">
                        ${parseFloat(sale.total).toFixed(2)}
                      </div>
                      <div className="text-xs">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            sale.paymentStatus === "paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {sale.paymentStatus === "paid"
                            ? "Pagada"
                            : "Pendiente"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <span className="text-4xl block mb-2">📭</span>
                  No hay ventas recientes
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
          <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
            <span className="text-4xl">⚡</span>
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/sales")}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl p-6 text-left transition-all transform hover:scale-105 hover:shadow-2xl border border-white/30 group"
            >
              <div className="bg-white/30 w-14 h-14 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-3xl">💰</span>
              </div>
              <p className="font-bold text-lg">Nueva Venta</p>
              <p className="text-blue-100 text-xs mt-1">
                Registrar transacción
              </p>
            </button>

            <button
              onClick={() => navigate("/products")}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl p-6 text-left transition-all transform hover:scale-105 hover:shadow-2xl border border-white/30 group"
            >
              <div className="bg-white/30 w-14 h-14 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📦</span>
              </div>
              <p className="font-bold text-lg">Agregar Producto</p>
              <p className="text-blue-100 text-xs mt-1">Expandir catálogo</p>
            </button>

            <button
              onClick={() => navigate("/customers")}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl p-6 text-left transition-all transform hover:scale-105 hover:shadow-2xl border border-white/30 group"
            >
              <div className="bg-white/30 w-14 h-14 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-3xl">👥</span>
              </div>
              <p className="font-bold text-lg">Nuevo Cliente</p>
              <p className="text-blue-100 text-xs mt-1">Ampliar cartera</p>
            </button>

            <button
              onClick={() => navigate("/purchases")}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl p-6 text-left transition-all transform hover:scale-105 hover:shadow-2xl border border-white/30 group"
            >
              <div className="bg-white/30 w-14 h-14 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📊</span>
              </div>
              <p className="font-bold text-lg">Ver Compras</p>
              <p className="text-blue-100 text-xs mt-1">
                Gestión de inventario
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
