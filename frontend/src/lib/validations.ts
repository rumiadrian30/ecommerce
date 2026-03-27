/**
 * VALIDACIONES DE SEGURIDAD
 * 
 * Este archivo contiene expresiones regulares (Regex) para validar
 * entradas del usuario y prevenir ataques de inyección de código.
 */

// ===============================
// PATRONES DE VALIDACIÓN REGEX
// ===============================

/**
 * Validación de correo electrónico
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validación de contraseña segura
 * - Al menos 8 caracteres
 * - Al menos una letra minúscula
 * - Al menos una letra mayúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Validación de nombre de usuario
 */
export const NAME_REGEX = /^[a-zA-Z0-9_áéíóúÁÉÍÓÚñÑ\s]{3,50}$/;

/**
 * Patrón para detectar posibles intentos de inyección
 */
export const DANGEROUS_CHARS_REGEX = /[<>'";&|`$(){}[\]\\]/;

// ===============================
// FUNCIONES DE VALIDACIÓN
// ===============================

/**
 * Valida un correo electrónico
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'El correo electrónico es requerido' };
  }

  if (DANGEROUS_CHARS_REGEX.test(email)) {
    return { 
      isValid: false, 
      error: 'El correo contiene caracteres no permitidos por seguridad' 
    };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { 
      isValid: false, 
      error: 'El formato del correo no es válido (ejemplo: usuario@dominio.com)' 
    };
  }

  return { isValid: true };
}

/**
 * Valida una contraseña según criterios de seguridad
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!password) {
    return { isValid: false, errors: ['La contraseña es requerida'] };
  }

  if (DANGEROUS_CHARS_REGEX.test(password)) {
    return { 
      isValid: false, 
      errors: ['La contraseña contiene caracteres no permitidos por seguridad'] 
    };
  }

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula');
  }

  if (!/\d/.test(password)) {
    errors.push('Debe contener al menos un número');
  }

  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Debe contener al menos un carácter especial (@$!%*?&)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida el nombre del usuario
 */
export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'El nombre es requerido' };
  }

  if (DANGEROUS_CHARS_REGEX.test(name)) {
    return { 
      isValid: false, 
      error: 'El nombre contiene caracteres no permitidos por seguridad' 
    };
  }

  if (!NAME_REGEX.test(name)) {
    return { 
      isValid: false, 
      error: 'El nombre debe tener entre 3 y 50 caracteres (solo letras, números y espacios)' 
    };
  }

  return { isValid: true };
}

/**
 * Valida que dos contraseñas coincidan
 */
export function validatePasswordMatch(
  password: string, 
  confirmPassword: string
): { isValid: boolean; error?: string } {
  if (!confirmPassword) {
    return { isValid: false, error: 'Debe confirmar la contraseña' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Las contraseñas no coinciden' };
  }

  return { isValid: true };
}

/**
 * Sanitiza una entrada de usuario
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Valida todos los campos de un formulario de registro
 */
export function validateRegistrationForm(data: {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error!;
  }

  const passwordResult = validatePassword(data.password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.errors.join('. ');
  }

  const confirmResult = validatePasswordMatch(data.password, data.confirmPassword);
  if (!confirmResult.isValid) {
    errors.confirmPassword = confirmResult.error!;
  }

  const nameResult = validateName(data.name);
  if (!nameResult.isValid) {
    errors.name = nameResult.error!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Valida todos los campos de un formulario de login
 */
export function validateLoginForm(data: {
  email: string;
  password: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error!;
  }

  if (!data.password) {
    errors.password = 'La contraseña es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}