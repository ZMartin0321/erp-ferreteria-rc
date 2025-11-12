# 🎨 Guía de Marca - Ferretería RC

## Identidad Visual Profesional

### 1. Logo Corporativo

El sistema cuenta con un logo profesional personalizado que representa:

- **Martillo estilizado**: Simboliza la industria de la construcción y ferreterías
- **Letra R**: Representa "RC" de manera elegante y profesional
- **Gradiente azul**: Transmite confianza, profesionalismo y tecnología

#### Variantes del Logo

**Logo Icon (Solo ícono)**

```jsx
import Logo from "./components/Logo";
<Logo variant="icon" className="h-12 w-12" />;
```

**Logo Full (Con texto)**

```jsx
<Logo className="h-12 w-auto" />
```

**Logo White (Para fondos oscuros)**

```jsx
import { LogoWhite } from "./components/Logo";
<LogoWhite className="h-12 w-12" />;
```

### 2. Paleta de Colores Profesional

#### Colores Primarios

- **Azul Principal**: `#1e40af` (blue-800)
- **Azul Medio**: `#3b82f6` (blue-600)
- **Azul Claro**: `#60a5fa` (blue-400)

#### Colores Secundarios

- **Verde Éxito**: `#059669` (green-600) - Compras, confirmaciones
- **Morado Ventas**: `#7c3aed` (purple-600) - Ventas, facturación
- **Naranja Alertas**: `#ea580c` (orange-600) - Reportes, estadísticas
- **Rojo Acciones**: `#dc2626` (red-600) - Eliminar, salir

#### Colores Neutros

- **Gris Oscuro**: `#111827` (gray-900) - Texto principal
- **Gris Medio**: `#6b7280` (gray-500) - Texto secundario
- **Gris Claro**: `#f3f4f6` (gray-100) - Fondos
- **Blanco**: `#ffffff` - Tarjetas, contenedores

### 3. Tipografía

**Familia de fuentes**: System Font Stack (Arial, Helvetica, sans-serif)

**Tamaños:**

- Títulos principales: `text-4xl` (36px) - font-bold
- Subtítulos: `text-2xl` (24px) - font-bold
- Texto de navegación: `text-lg` (18px) - font-semibold
- Texto normal: `text-base` (16px) - font-normal
- Texto pequeño: `text-sm` (14px) - font-medium

### 4. Componentes de Marca

#### NavBar

- Fondo: Blanco con borde azul inferior de 4px
- Logo: Ícono + texto "Ferretería RC"
- Navegación: Botones con iconos SVG profesionales
- Estado activo: Fondo degradado azul con sombra

#### Cards de Dashboard

- Fondo: Blanco con borde de 2px
- Hover: Escala 105%, sombra intensa
- Iconos: SVG monocromáticos con transiciones de color
- Barras de progreso: Degradados según categoría

#### Botones

- Primarios: Degradado azul `from-blue-600 to-blue-700`
- Secundarios: Borde azul con fondo blanco
- Peligro: Degradado rojo `from-red-600 to-red-700`
- Todos con transiciones suaves y hover:scale-[1.02]

### 5. Iconografía

El sistema utiliza **SVG icons** profesionales en lugar de emojis para:

- Navegación (heroicons style)
- Acciones rápidas
- Estados del sistema
- Indicadores visuales

### 6. Espaciado y Layout

**Consistencia:**

- Gap entre elementos: `gap-4` (16px) o `gap-6` (24px)
- Padding de tarjetas: `p-6` (24px) o `p-8` (32px)
- Bordes redondeados: `rounded-xl` (12px) o `rounded-2xl` (16px)
- Máximo ancho de contenido: `max-w-7xl` (1280px)

### 7. Efectos y Transiciones

**Hover Effects:**

- Escala: `hover:scale-105` o `hover:scale-[1.02]`
- Sombras: `hover:shadow-xl` o `hover:shadow-2xl`
- Colores: Transiciones suaves con `transition-all duration-300`

**Animaciones:**

- Spin para loading: `animate-spin`
- Pulse para indicadores: `animate-pulse`
- Transiciones personalizadas para botones y cards

### 8. Mensajería de Marca

**Tagline**: "Sistema de Gestión Profesional"

**Valores:**

- ✓ Profesionalismo
- ✓ Confiabilidad
- ✓ Eficiencia
- ✓ Seguridad

**Tono de comunicación:**

- Formal pero accesible
- Técnico pero claro
- Orientado a resultados
- Centrado en el usuario

### 9. Elementos de Confianza

**Trust Badges en Login:**

- 🔒 100% Seguro
- ⚡ 24/7 Disponible
- ✓ Confiable

**Indicadores de Estado:**

- 🟢 Online (verde)
- 🔵 Sistema Activo (azul)

### 10. Responsive Design

**Mobile First:**

- Grid adaptable: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Texto responsive: `text-2xl md:text-4xl`
- Ocultar elementos en móvil: `hidden lg:block`

### 11. Accesibilidad

- Contraste mínimo WCAG AA: ✓
- Textos alternativos en iconos: ✓
- Navegación por teclado: ✓
- Estados de foco visibles: `focus:ring-2 focus:ring-blue-600`

## Ejemplos de Uso

### Header Principal

```jsx
<div className="bg-white border-l-8 border-blue-600 p-8 rounded-2xl shadow-lg">
  <div className="flex items-center gap-6">
    <Logo variant="icon" className="h-16 w-16" />
    <div>
      <h1 className="text-4xl font-bold text-gray-900">Título</h1>
      <p className="text-gray-600 text-lg">Subtítulo</p>
    </div>
  </div>
</div>
```

### Card con Hover

```jsx
<div className="bg-white border-2 border-gray-200 hover:border-blue-500 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
  {/* Contenido */}
</div>
```

### Botón Primario

```jsx
<button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02]">
  Acción
</button>
```

---

**Versión**: 2.0 Professional  
**Fecha**: Enero 2025  
**Diseñado para**: Ferretería RC - Sistema de Gestión Empresarial
