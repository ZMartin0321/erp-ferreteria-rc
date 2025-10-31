import React from "react";

/**
 * Componente de Avatar profesional con soporte para imágenes y iniciales
 */
const Avatar = ({
  src,
  alt,
  name,
  size = "md",
  status,
  border = false,
  className = "",
}) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-24 h-24 text-3xl",
  };

  const statusSizes = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
    "2xl": "w-5 h-5",
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-red-500",
    away: "bg-yellow-500",
  };

  // Generar iniciales del nombre
  const getInitials = () => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generar color de fondo basado en el nombre
  const getBackgroundColor = () => {
    if (!name) return "bg-gray-400";
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`
          ${sizes[size]}
          rounded-full
          overflow-hidden
          flex items-center justify-center
          ${border ? "ring-2 ring-white shadow-lg" : ""}
          ${!src ? getBackgroundColor() : ""}
          transition-transform hover:scale-105
        `}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-semibold text-white">{getInitials()}</span>
        )}
      </div>

      {/* Indicador de estado */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${statusSizes[size]}
            ${statusColors[status]}
            rounded-full
            border-2 border-white
          `}
        />
      )}
    </div>
  );
};

/**
 * Grupo de avatares apilados
 */
export const AvatarGroup = ({ users = [], max = 3, size = "md" }) => {
  const displayUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className="flex -space-x-2">
      {displayUsers.map((user, index) => (
        <Avatar
          key={index}
          src={user.avatar}
          name={user.name}
          size={size}
          border
          className="transition-transform hover:z-10 hover:scale-110"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={`
            ${size === "xs" ? "w-6 h-6 text-xs" : ""}
            ${size === "sm" ? "w-8 h-8 text-sm" : ""}
            ${size === "md" ? "w-10 h-10 text-base" : ""}
            ${size === "lg" ? "w-12 h-12 text-lg" : ""}
            ${size === "xl" ? "w-16 h-16 text-xl" : ""}
            rounded-full
            bg-gray-200
            border-2 border-white
            flex items-center justify-center
            font-semibold text-gray-600
          `}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default Avatar;
