'use client';

import React, { useState } from 'react';
import { validateEmail, sanitizeInput } from '@/lib/validations';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToRecovery: () => void;
}

const base: React.CSSProperties = {
  width: '100%', padding: '10px 14px 10px 38px',
  background: 'white', border: '1px solid #e2e8f0',
  borderRadius: '8px', color: '#1e293b', fontSize: '0.93rem',
  transition: 'border-color 0.15s', fontFamily: 'inherit',
};

export function LoginForm({ onSwitchToRegister, onSwitchToRecovery }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!validateEmail(email).isValid) e.email = validateEmail(email).error!;
    if (!password) e.password = 'La contraseña es requerida';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await login(sanitizeInput(email.trim().toLowerCase()), password);
      if (!res.success) setServerError(res.message || 'Credenciales incorrectas');
    } catch { setServerError('Error de conexión. Intenta nuevamente.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)' }}>
      <h1 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.01em' }}>Iniciar sesión</h1>
      <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '24px' }}>Ingresa tus credenciales para continuar</p>

      {serverError && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p style={{ color: '#dc2626', fontSize: '0.85rem' }}>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Correo electrónico</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </span>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email: ''})); }}
              placeholder="correo@empresa.com"
              style={{ ...base, borderColor: errors.email ? '#fca5a5' : '#e2e8f0' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = errors.email ? '#fca5a5' : '#e2e8f0'}
            />
          </div>
          {errors.email && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px' }}>{errors.email}</p>}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Contraseña</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input type={showPass ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password: ''})); }}
              placeholder="••••••••"
              style={{ ...base, paddingRight: '38px', borderColor: errors.password ? '#fca5a5' : '#e2e8f0' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = errors.password ? '#fca5a5' : '#e2e8f0'}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
              {showPass
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
            </button>
          </div>
          {errors.password && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px' }}>{errors.password}</p>}
        </div>

        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <button type="button" onClick={onSwitchToRecovery} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.82rem', cursor: 'pointer', padding: 0 }}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '10px',
          background: loading ? '#93c5fd' : '#3b82f6',
          border: 'none', borderRadius: '8px',
          color: 'white', fontSize: '0.93rem', fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
          transition: 'background 0.15s',
        }}>
          {loading ? 'Verificando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#64748b' }}>
        ¿No tienes una cuenta?{' '}
        <button onClick={onSwitchToRegister} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: '600', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
          Regístrate
        </button>
      </p>
    </div>
  );
}