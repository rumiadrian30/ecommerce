'use client';

import React, { useState } from 'react';
import { validateEmail, sanitizeInput } from '@/lib/validations';
import { useAuth } from '@/contexts/AuthContext';

interface RecoveryFormProps { onSwitchToLogin: () => void; }

export function RecoveryForm({ onSwitchToLogin }: RecoveryFormProps) {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setError(null);
    const r = validateEmail(email);
    if (!r.isValid) { setError(r.error!); return; }
    setLoading(true);
    try {
      const res = await requestPasswordReset(sanitizeInput(email.trim().toLowerCase()));
      if (res.success) setSuccess(true);
      else setError(res.message || 'Error al procesar la solicitud');
    } catch { setError('Error de conexión.'); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)', textAlign: 'center', fontFamily: 'inherit' }}>
      <div style={{ width: '52px', height: '52px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      </div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Revisa tu correo</h2>
      <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '20px' }}>
        Enviamos instrucciones a <strong style={{ color: '#374151' }}>{email}</strong>. El enlace expira en 1 hora.
      </p>
      <button onClick={onSwitchToLogin} style={{ width: '100%', padding: '10px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontSize: '0.92rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
        Volver al inicio de sesión
      </button>
    </div>
  );

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)', fontFamily: 'inherit' }}>
      <button onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.82rem', cursor: 'pointer', padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Volver
      </button>

      <h1 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Recuperar acceso</h1>
      <p style={{ color: '#64748b', fontSize: '0.86rem', marginBottom: '22px', lineHeight: '1.5' }}>
        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '9px 13px', marginBottom: '16px' }}>
          <p style={{ color: '#dc2626', fontSize: '0.84rem' }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Correo electrónico</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@empresa.com"
              style={{ width: '100%', padding: '10px 14px 10px 38px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', fontSize: '0.92rem', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          </div>
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: loading ? '#93c5fd' : '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontSize: '0.92rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
          {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </button>
      </form>
    </div>
  );
}