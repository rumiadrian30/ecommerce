'use client';

import React, { useState } from 'react';
import { validateEmail, validatePassword, validatePasswordMatch, validateName, sanitizeInput } from '@/lib/validations';
import { useAuth } from '@/contexts/AuthContext';

interface RegisterFormProps { onSwitchToLogin: () => void; }

const base: React.CSSProperties = {
  width: '100%', padding: '9px 12px 9px 36px',
  background: 'white', border: '1px solid #e2e8f0',
  borderRadius: '8px', color: '#1e293b', fontSize: '0.9rem',
  transition: 'border-color 0.15s', fontFamily: 'inherit',
};

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const set = (f: string, v: string) => { setForm(p => ({...p, [f]: v})); setErrors(p => ({...p, [f]: ''})); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!validateName(form.name).isValid) e.name = validateName(form.name).error!;
    if (!validateEmail(form.email).isValid) e.email = validateEmail(form.email).error!;
    const pr = validatePassword(form.password);
    if (!pr.isValid) e.password = pr.errors[0];
    if (!validatePasswordMatch(form.password, form.confirmPassword).isValid) e.confirmPassword = validatePasswordMatch(form.password, form.confirmPassword).error!;
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setMsg(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await register({ name: sanitizeInput(form.name.trim()), email: sanitizeInput(form.email.trim().toLowerCase()), password: form.password, confirmPassword: form.confirmPassword });
      setMsg({ type: res.success ? 'success' : 'error', text: res.message || (res.success ? 'Cuenta creada' : 'Error al crear cuenta') });
    } catch { setMsg({ type: 'error', text: 'Error de conexión.' }); }
    finally { setLoading(false); }
  };

  // Reglas de contraseña compactas
  const rules = [
    { ok: form.password.length >= 8, text: '8+ caracteres' },
    { ok: /[A-Z]/.test(form.password), text: 'Mayúscula' },
    { ok: /[0-9]/.test(form.password), text: 'Número' },
    { ok: /[@$!%*?&]/.test(form.password), text: 'Especial' },
  ];

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)' }}>
      <h1 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.01em' }}>Crear cuenta</h1>
      <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '20px' }}>Completa los datos para registrarte</p>

      {msg && (
        <div style={{ background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}`, borderRadius: '8px', padding: '9px 13px', marginBottom: '16px' }}>
          <p style={{ color: msg.type === 'success' ? '#15803d' : '#dc2626', fontSize: '0.84rem' }}>{msg.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div style={{ marginBottom: '13px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Nombre completo</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Juan García"
              style={{ ...base, borderColor: errors.name ? '#fca5a5' : '#e2e8f0' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = errors.name ? '#fca5a5' : '#e2e8f0'} />
          </div>
          {errors.name && <p style={{ color: '#ef4444', fontSize: '0.76rem', marginTop: '3px' }}>{errors.name}</p>}
        </div>

        {/* Email */}
        <div style={{ marginBottom: '13px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Correo electrónico</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </span>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="correo@empresa.com"
              style={{ ...base, borderColor: errors.email ? '#fca5a5' : '#e2e8f0' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = errors.email ? '#fca5a5' : '#e2e8f0'} />
          </div>
          {errors.email && <p style={{ color: '#ef4444', fontSize: '0.76rem', marginTop: '3px' }}>{errors.email}</p>}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '6px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Contraseña</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••"
              style={{ ...base, paddingRight: '36px', borderColor: errors.password ? '#fca5a5' : '#e2e8f0' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = errors.password ? '#fca5a5' : '#e2e8f0'} />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
              {showPass
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
            </button>
          </div>
          {errors.password && <p style={{ color: '#ef4444', fontSize: '0.76rem', marginTop: '3px' }}>{errors.password}</p>}
        </div>

        {/* Indicadores de contraseña compactos */}
        {form.password.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '13px', flexWrap: 'wrap' }}>
            {rules.map((r, i) => (
              <span key={i} style={{ fontSize: '0.73rem', padding: '2px 8px', borderRadius: '20px', background: r.ok ? '#f0fdf4' : '#f8fafc', color: r.ok ? '#16a34a' : '#94a3b8', border: `1px solid ${r.ok ? '#bbf7d0' : '#e2e8f0'}` }}>
                {r.ok ? '✓' : '○'} {r.text}
              </span>
            ))}
          </div>
        )}

        {/* Confirmar contraseña */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Confirmar contraseña</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>
            <input type={showPass ? 'text' : 'password'} value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="••••••••"
              style={{ ...base, borderColor: errors.confirmPassword ? '#fca5a5' : '#e2e8f0' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = errors.confirmPassword ? '#fca5a5' : '#e2e8f0'} />
          </div>
          {errors.confirmPassword && <p style={{ color: '#ef4444', fontSize: '0.76rem', marginTop: '3px' }}>{errors.confirmPassword}</p>}
        </div>

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '10px',
          background: loading ? '#93c5fd' : '#3b82f6',
          border: 'none', borderRadius: '8px',
          color: 'white', fontSize: '0.92rem', fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
        }}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.84rem', color: '#64748b' }}>
        ¿Ya tienes cuenta?{' '}
        <button onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: '600', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
          Iniciar sesión
        </button>
      </p>
    </div>
  );
}