// Configuración de tema y branding de Ferretería RC Pro
export const theme = {
  // Colores principales de la marca
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6", // Azul principal
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a", // Azul oscuro (fondo logo)
    },
    accent: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b", // Naranja/Ámbar (acentos)
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    neutral: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
    },
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      500: "#eab308",
      600: "#ca8a04",
      700: "#a16207",
    },
    danger: {
      50: "#fef2f2",
      100: "#fee2e2",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
    },
    info: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
    },
  },

  // Gradientes
  gradients: {
    primary: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    accent: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    dark: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
    hero: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
  },

  // Sombras
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    colored: "0 10px 30px -5px rgba(59, 130, 246, 0.3)",
    accentColored: "0 10px 30px -5px rgba(245, 158, 11, 0.3)",
  },

  // Tipografía
  fonts: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    mono: '"Fira Code", "Monaco", "Courier New", monospace',
  },

  // Espaciado
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },

  // Bordes redondeados
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },

  // Transiciones
  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    base: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // Breakpoints (responsive)
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

// Información de la empresa
export const branding = {
  theme, // Agregar referencia al theme
  companyName: "Ferretería RC Professional",
  shortName: "RC Pro",
  tagline: "Tu socio en construcción y herramientas",
  logo: "/src/assets/logo.svg",

  // Categorías de productos con iconos
  categories: {
    herramientasManuales: {
      name: "Herramientas Manuales",
      icon: "🔨",
      color: theme.colors.accent[500],
      gradient: "from-amber-500 to-orange-600",
    },
    herramientasElectricas: {
      name: "Herramientas Eléctricas",
      icon: "⚡",
      color: theme.colors.primary[500],
      gradient: "from-blue-500 to-indigo-600",
    },
    construccion: {
      name: "Materiales de Construcción",
      icon: "🏗️",
      color: "#6b7280",
      gradient: "from-gray-600 to-gray-700",
    },
    plomeria: {
      name: "Plomería",
      icon: "🚰",
      color: "#06b6d4",
      gradient: "from-cyan-500 to-blue-500",
    },
    electricidad: {
      name: "Electricidad",
      icon: "💡",
      color: "#eab308",
      gradient: "from-yellow-400 to-amber-500",
    },
    pintura: {
      name: "Pintura y Accesorios",
      icon: "🎨",
      color: "#ec4899",
      gradient: "from-pink-500 to-rose-500",
    },
    cerrajeria: {
      name: "Cerrajería",
      icon: "🔐",
      color: "#8b5cf6",
      gradient: "from-purple-500 to-violet-600",
    },
    ferreteria: {
      name: "Ferretería General",
      icon: "🔧",
      color: "#10b981",
      gradient: "from-emerald-500 to-green-600",
    },
  },

  // Estados de productos con colores
  productStatus: {
    activo: {
      label: "Activo",
      color: theme.colors.success[500],
      bg: theme.colors.success[50],
    },
    inactivo: {
      label: "Inactivo",
      color: theme.colors.neutral[500],
      bg: theme.colors.neutral[100],
    },
    stockBajo: {
      label: "Stock Bajo",
      color: theme.colors.warning[500],
      bg: theme.colors.warning[50],
    },
    sinStock: {
      label: "Agotado",
      color: theme.colors.danger[500],
      bg: theme.colors.danger[50],
    },
  },

  // Estados de órdenes
  orderStatus: {
    pendiente: {
      label: "Pendiente",
      color: theme.colors.warning[500],
      icon: "⏳",
    },
    pagado: {
      label: "Pagado",
      color: theme.colors.success[500],
      icon: "✅",
    },
    parcial: {
      label: "Pago Parcial",
      color: theme.colors.info[500],
      icon: "📊",
    },
    vencido: {
      label: "Vencido",
      color: theme.colors.danger[500],
      icon: "⚠️",
    },
  },

  // Métodos de pago con iconos
  paymentMethods: {
    efectivo: {
      label: "Efectivo",
      icon: "💵",
      color: theme.colors.success[500],
    },
    tarjeta: {
      label: "Tarjeta",
      icon: "💳",
      color: theme.colors.primary[500],
    },
    transferencia: {
      label: "Transferencia",
      icon: "🏦",
      color: theme.colors.info[500],
    },
    cheque: {
      label: "Cheque",
      icon: "📝",
      color: theme.colors.accent[500],
    },
  },
};

// URLs de imágenes de ejemplo (Unsplash)
export const imageUrls = {
  // Herramientas
  hammer:
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop",
  drill:
    "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop",
  tools:
    "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=300&fit=crop",
  screwdriver:
    "https://images.unsplash.com/photo-1590393600451-a8c0cf4aa2e4?w=400&h=300&fit=crop",
  wrench:
    "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400&h=300&fit=crop",

  // Construcción
  cement:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
  bricks:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  construction:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop",

  // Electricidad
  cables:
    "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop",
  bulb: "https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=400&h=300&fit=crop",

  // Pintura
  paint:
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop",
  paintBrush:
    "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop",

  // Fondos
  warehouse:
    "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&h=1080&fit=crop",
  hardwareStore:
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1920&h=1080&fit=crop",
  workshop:
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&h=1080&fit=crop",

  // Placeholders
  productPlaceholder:
    "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
  userPlaceholder:
    "https://ui-avatars.com/api/?name=Usuario&background=1e3a8a&color=fff&size=200",
  emptyBox:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=400&fit=crop",
};

export default { theme, branding, imageUrls };
