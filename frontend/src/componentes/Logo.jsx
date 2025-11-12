import React from "react";

export default function Logo({ className = "h-12 w-12", variant = "full" }) {
  if (variant === "icon") {
    return (
      <svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fondo del logo */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#1e40af", stopOpacity: 1 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "#3b82f6", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#60a5fa", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Círculo de fondo */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="url(#logoGradient)"
          filter="url(#shadow)"
        />

        {/* Herramienta - Martillo estilizado */}
        <g transform="translate(20, 25)">
          {/* Mango del martillo */}
          <rect
            x="25"
            y="20"
            width="6"
            height="35"
            rx="3"
            fill="#fff"
            opacity="0.95"
          />

          {/* Cabeza del martillo */}
          <rect x="15" y="12" width="26" height="12" rx="2" fill="#fff" />

          {/* Detalle metalico */}
          <rect
            x="17"
            y="14"
            width="22"
            height="3"
            rx="1"
            fill="#e5e7eb"
            opacity="0.5"
          />
        </g>

        {/* Letra R estilizada */}
        <g transform="translate(48, 30)">
          <path
            d="M 5 5 L 5 35 M 5 5 L 20 5 Q 25 5 25 12 Q 25 19 20 19 L 5 19 M 15 19 L 25 35"
            stroke="#fff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 300 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#1e40af", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#3b82f6", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>

      {/* Logo Icon */}
      <g transform="translate(10, 10)">
        <circle cx="40" cy="40" r="38" fill="url(#logoGradient)" />
        <g transform="translate(15, 20)">
          <rect
            x="20"
            y="15"
            width="5"
            height="30"
            rx="2.5"
            fill="#fff"
            opacity="0.95"
          />
          <rect x="12" y="10" width="21" height="10" rx="2" fill="#fff" />
        </g>
        <g transform="translate(38, 25)">
          <path
            d="M 4 4 L 4 28 M 4 4 L 16 4 Q 20 4 20 10 Q 20 15 16 15 L 4 15 M 12 15 L 20 28"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </g>

      {/* Texto */}
      <text
        x="100"
        y="45"
        fontFamily="Arial, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="url(#textGradient)"
      >
        Ferretería RC
      </text>
      <text
        x="100"
        y="70"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fontWeight="normal"
        fill="#64748b"
      >
        Sistema de Gestión Integral
      </text>
    </svg>
  );
}

export function LogoWhite({ className = "h-12 w-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Círculo de fondo blanco */}
      <circle cx="50" cy="50" r="48" fill="white" opacity="0.15" />

      {/* Herramienta */}
      <g transform="translate(20, 25)">
        <rect x="25" y="20" width="6" height="35" rx="3" fill="#fff" />
        <rect x="15" y="12" width="26" height="12" rx="2" fill="#fff" />
        <rect
          x="17"
          y="14"
          width="22"
          height="3"
          rx="1"
          fill="#e5e7eb"
          opacity="0.7"
        />
      </g>

      {/* Letra R */}
      <g transform="translate(48, 30)">
        <path
          d="M 5 5 L 5 35 M 5 5 L 20 5 Q 25 5 25 12 Q 25 19 20 19 L 5 19 M 15 19 L 25 35"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
