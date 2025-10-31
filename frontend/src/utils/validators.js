/**
 * Utilidades de validación para formularios
 */

/**
 * Valida un email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida una contraseña segura
 */
export const isValidPassword = (password, minLength = 6) => {
  if (!password || password.length < minLength) return false;
  return true;
};

/**
 * Valida una contraseña fuerte (mayúscula, minúscula, número)
 */
export const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

/**
 * Valida un número de teléfono
 */
export const isValidPhone = (phone) => {
  const regex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  return regex.test(phone.replace(/\s/g, ""));
};

/**
 * Valida un número positivo
 */
export const isPositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

/**
 * Valida un número entero positivo
 */
export const isPositiveInteger = (value) => {
  const num = parseInt(value, 10);
  return !isNaN(num) && num > 0 && Number.isInteger(num);
};

/**
 * Valida una URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida que un campo no esté vacío
 */
export const isNotEmpty = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Valida longitud mínima
 */
export const hasMinLength = (value, minLength) => {
  if (!value) return false;
  return value.length >= minLength;
};

/**
 * Valida longitud máxima
 */
export const hasMaxLength = (value, maxLength) => {
  if (!value) return true;
  return value.length <= maxLength;
};

/**
 * Valida un rango numérico
 */
export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};

/**
 * Valida formato de fecha (YYYY-MM-DD)
 */
export const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Valida que una fecha no sea futura
 */
export const isNotFutureDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  return date <= now;
};

/**
 * Valida un código postal (México)
 */
export const isValidPostalCode = (postalCode) => {
  const regex = /^\d{5}$/;
  return regex.test(postalCode);
};

/**
 * Valida un RFC (México)
 */
export const isValidRFC = (rfc) => {
  const regex = /^[A-ZÑ&]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/;
  return regex.test(rfc.toUpperCase());
};

/**
 * Valida un CURP (México)
 */
export const isValidCURP = (curp) => {
  const regex =
    /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;
  return regex.test(curp.toUpperCase());
};

/**
 * Sanitiza entrada de texto (previene XSS básico)
 */
export const sanitizeInput = (input) => {
  if (!input) return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};
