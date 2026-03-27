'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { RecoveryForm } from '@/components/auth/RecoveryForm';
import { Dashboard } from '@/components/dashboard/Dashboard';

type AuthMode = 'login' | 'register' | 'recovery';

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '36px', height: '36px', border: '3px solid #e2e8f0',
          borderTopColor: '#3b82f6', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 10px',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', fontFamily: 'system-ui, sans-serif' }}>Cargando...</p>
      </div>
    </div>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f1f5f9', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        input::placeholder { color: #cbd5e1; }
        input:focus { outline: none; }
        @media (min-width: 1024px) { .auth-sidebar { display: flex !important; } .mobile-logo { display: none !important; } }
      `}</style>

      {/* Sidebar izquierdo - solo desktop */}
      <div className="auth-sidebar" style={{
        display: 'none', width: '400px', flexShrink: 0,
        background: '#1e293b', flexDirection: 'column',
        justifyContent: 'space-between', padding: '44px 36px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
            <div style={{ width: '34px', height: '34px', background: '#3b82f6', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span style={{ color: 'white', fontWeight: '700', fontSize: '1.05rem' }}>SecureShop Pro</span>
          </div>
          <h2 style={{ color: 'white', fontSize: '1.65rem', fontWeight: '700', lineHeight: '1.3', marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Plataforma de comercio electrónico empresarial
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.7' }}>
            Gestiona tu negocio digital con herramientas seguras y control de acceso por roles.
          </p>
        </div>
        <div style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '18px' }}>
          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '10px' }}>
            "La plataforma más completa para gestionar nuestro catálogo."
          </p>
          <p style={{ color: '#64748b', fontSize: '0.8rem' }}>— Equipo de operaciones</p>
        </div>
        <p style={{ color: '#334155', fontSize: '0.73rem' }}>© 2025 SecureShop Pro. Todos los derechos reservados.</p>
      </div>

      {/* Panel formulario */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px 16px', overflowY: 'auto' }}>
        <div className="mobile-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          <div style={{ width: '30px', height: '30px', background: '#3b82f6', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span style={{ fontWeight: '700', fontSize: '0.97rem', color: '#1e293b' }}>SecureShop Pro</span>
        </div>

        <div style={{ width: '100%', maxWidth: '400px' }}>
          {mode === 'login' && <LoginForm onSwitchToRegister={() => setMode('register')} onSwitchToRecovery={() => setMode('recovery')} />}
          {mode === 'register' && <RegisterForm onSwitchToLogin={() => setMode('login')} />}
          {mode === 'recovery' && <RecoveryForm onSwitchToLogin={() => setMode('login')} />}
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return <Dashboard />;
  return <AuthScreen />;
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}