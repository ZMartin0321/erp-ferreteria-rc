/**
 * Componente de tarjeta profesional
 */
export default function Card({
  title,
  subtitle,
  children,
  footer,
  className = "",
  headerAction = null,
  padding = true,
}) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}

      <div className={padding ? "p-6" : ""}>{children}</div>

      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
}
