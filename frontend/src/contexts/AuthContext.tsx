'use client';

/**
 * CONTEXTO DE AUTENTICACIÓN
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole, AuthResponse, RegisterFormData, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = '/api/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar
  const checkAuth = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('auth_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/me`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(storedToken);
      } else {
        localStorage.removeItem('auth_token');
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Función de login
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem('auth_token', data.token);
        setToken(data.token);
        setUser(data.user);
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión. Intenta nuevamente.'
      };
    }
  };

  // Función de registro
  const register = async (formData: RegisterFormData): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión. Intenta nuevamente.'
      };
    }
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setToken(null);
  };

  // Función para solicitar recuperación de contraseña
  const requestPasswordReset = async (email: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE}/recovery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión. Intenta nuevamente.'
      };
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    requestPasswordReset,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// Hook para verificar si el usuario es administrador
export function useIsAdmin(): boolean {
  const { user } = useAuth();
  return user?.role === 'admin';
}

// Hook para verificar si el usuario tiene un rol específico
export function useHasRole(requiredRole: UserRole): boolean {
  const { user } = useAuth();
  return user?.role === requiredRole;
}