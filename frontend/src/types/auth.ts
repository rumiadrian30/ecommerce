/**
 * TIPOS Y INTERFACES - E-commerce Seguro
 * Capa de Interacción y Validación
 */

// Roles de usuario disponibles en el sistema
export type UserRole = 'cliente' | 'admin';

// Interfaz del usuario
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;
}

// Datos del token JWT decodificados
export interface DecodedToken {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
}

// Respuesta de autenticación del servidor
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Datos para el formulario de registro
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

// Datos para el formulario de login
export interface LoginFormData {
  email: string;
  password: string;
}

// Datos para recuperación de contraseña
export interface RecoveryFormData {
  email: string;
}

// Estado de autenticación
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Contexto de autenticación
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: RegisterFormData) => Promise<AuthResponse>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<AuthResponse>;
  checkAuth: () => Promise<void>;
}