import { useState } from "react";

/**
 * Hook personalizado para manejo de formularios
 * Simplifica el estado y validación de formularios
 */
export default function useForm(initialValues, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Actualiza el valor de un campo
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Limpiar error del campo al cambiar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Marca un campo como tocado
   */
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validar el campo al perder foco
    if (validationRules[name]) {
      validateField(name, values[name]);
    }
  };

  /**
   * Valida un campo específico
   */
  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return true;

    let error = "";

    if (rules.required && !value) {
      error = rules.requiredMessage || `El campo ${name} es requerido`;
    } else if (rules.minLength && value.length < rules.minLength) {
      error =
        rules.minLengthMessage ||
        `Debe tener al menos ${rules.minLength} caracteres`;
    } else if (rules.maxLength && value.length > rules.maxLength) {
      error =
        rules.maxLengthMessage ||
        `Debe tener máximo ${rules.maxLength} caracteres`;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      error = rules.patternMessage || `Formato inválido`;
    } else if (rules.min && parseFloat(value) < rules.min) {
      error = rules.minMessage || `Debe ser mayor o igual a ${rules.min}`;
    } else if (rules.max && parseFloat(value) > rules.max) {
      error = rules.maxMessage || `Debe ser menor o igual a ${rules.max}`;
    } else if (rules.custom && !rules.custom(value, values)) {
      error = rules.customMessage || `Validación fallida`;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return !error;
  };

  /**
   * Valida todo el formulario
   */
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const fieldValue = values[fieldName];
      const rules = validationRules[fieldName];

      if (rules.required && !fieldValue) {
        newErrors[fieldName] =
          rules.requiredMessage || `El campo ${fieldName} es requerido`;
        isValid = false;
      } else if (
        rules.minLength &&
        fieldValue &&
        fieldValue.length < rules.minLength
      ) {
        newErrors[fieldName] =
          rules.minLengthMessage ||
          `Debe tener al menos ${rules.minLength} caracteres`;
        isValid = false;
      } else if (rules.pattern && fieldValue && !rules.pattern.test(fieldValue)) {
        newErrors[fieldName] = rules.patternMessage || `Formato inválido`;
        isValid = false;
      } else if (rules.min && parseFloat(fieldValue) < rules.min) {
        newErrors[fieldName] =
          rules.minMessage || `Debe ser mayor o igual a ${rules.min}`;
        isValid = false;
      } else if (rules.custom && !rules.custom(fieldValue, values)) {
        newErrors[fieldName] = rules.customMessage || `Validación fallida`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Resetea el formulario
   */
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  /**
   * Establece valores del formulario
   */
  const setFormValues = (newValues) => {
    setValues(newValues);
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    setFormValues,
    setIsSubmitting,
    setErrors,
  };
}
