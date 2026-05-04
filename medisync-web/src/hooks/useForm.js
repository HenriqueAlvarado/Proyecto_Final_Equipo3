import { useState } from 'react';

/**
 * Hook genérico para manejo de formularios
 * @param {object} initialValues - Valores iniciales del formulario
 * @param {function} validateFn - Función de validación que retorna objeto de errores
 */
export const useForm = (initialValues, validateFn) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name] && validateFn) {
      const newErrors = validateFn({ ...values, [name]: value });
      setErrors(prev => ({ ...prev, [name]: newErrors[name] || '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (validateFn) {
      const newErrors = validateFn(values);
      setErrors(prev => ({ ...prev, [name]: newErrors[name] || '' }));
    }
  };

  const validate = () => {
    if (!validateFn) return true;
    const newErrors = validateFn(values);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return { values, errors, touched, handleChange, handleBlur, validate, reset, setValues };
};
