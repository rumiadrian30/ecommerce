'use client';

import React, { useState } from 'react';
import { useAuth, useIsAdmin } from '@/contexts/AuthContext';

const products = [
  { id: 1, name: 'Laptop UltraSlim X1', price: 1299.99, category: 'Electrónica', stock: 14, emoji: '💻' },
  { id: 2, name: 'Monitor 4K ProView 27"', price: 449.99, category: 'Electrónica', stock: 8, emoji: '🖥️' },
  { id: 3, name: 'Teclado Mecánico RGB', price: 89.99, category: 'Periféricos', stock: 32, emoji: '⌨️' },
  { id: 4, name: 'Mouse Inalámbrico Pro', price: 54.99, category: 'Periféricos', stock: 25, emoji: '🖱️' },
  { id: 5, name: 'Auriculares Noise Cancel', price: 199.99, category: 'Audio', stock: 5, emoji: '🎧' },
  { id: 6, name: 'Webcam HD 1080p', price: 79.99, category: 'Periféricos', stock: 17, emoji: '📷' },
];

const mockUsers = [
  { id: 1, name: 'Ana Rodríguez', email: 'ana@empresa.com', role: 'admin', status: 'activo' },
  { id: 2, name: 'Carlos Méndez', email: 'carlos@empresa.com', role: 'cliente', status: 'activo' },
  { id: 3, name: 'María Torres', email: 'maria@empresa.com', role: 'cliente', status: 'inactivo' },
  { id: 4, name: 'Pedro Silva', email: 'pedro@empresa.com', role: 'cliente', status: 'activo' },
];

type Tab = 'catalogo' | 'perfil' | 'admin';

export function Dashboard() {
  const { user, logout } = useAuth();
  const isAdmin = useIsAdmin();
  const [tab, setTab] = useState<Tab>('catalogo');
  const [cart, setCart] = useState<number[]>([]);

  if (!user) return null;

  const avatarLetter = (user.name || user.email).charAt(0).toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: '#1e293b' }}>
      <style>{`* { box-sizing: border-box; } button:hover { opacity: 0.85; }`}</style>

      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '30px', height: '30px', background: '#3b82f6', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <span style={{ fontWeight: '700', fontSize: '0.97rem', color: '#0f172a' }}>SecureShop Pro</span>
          </div>

          {/* Nav tabs */}
          <div style={{ display: 'flex', gap: '2px' }}>
            {([
              { key: 'catalogo', label: 'Catálogo' },
              { key: 'perfil', label: 'Mi Perfil' },
              ...(isAdmin ? [{ key: 'admin', label: 'Administración' }] : []),
            ] as { key: Tab; label: string }[]).map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                fontSize: '0.85rem', fontWeight: tab === t.key ? '600' : '500',
                background: tab === t.key ? (t.key === 'admin' ? '#f5f3ff' : '#eff6ff') : 'transparent',
                color: tab === t.key ? (t.key === 'admin' ? '#7c3aed' : '#2563eb') : '#64748b',
                fontFamily: 'inherit', transition: 'all 0.15s',
              }}>
                {t.key === 'admin' ? '🔒 ' : ''}{t.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Cart */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cart.length > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#3b82f6', color: 'white', fontSize: '0.62rem', width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                  {cart.length}
                </span>
              )}
            </div>

            {/* Avatar */}
            <div style={{ width: '32px', height: '32px', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: '700', color: '#2563eb', flexShrink: 0 }}>
              {avatarLetter}
            </div>

            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: '600', color: '#0f172a', lineHeight: 1.2 }}>{user.name || 'Usuario'}</p>
              <p style={{ fontSize: '0.72rem', color: isAdmin ? '#7c3aed' : '#64748b', lineHeight: 1.2 }}>{isAdmin ? 'Administrador' : 'Cliente'}</p>
            </div>

            <button onClick={logout} style={{ padding: '5px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '7px', color: '#64748b', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              Salir
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px' }}>

        {/* CATÁLOGO */}
        {tab === 'catalogo' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Catálogo de productos</h2>
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Equipos y periféricos para tu empresa</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {products.map(p => (
                <div key={p.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', transition: 'box-shadow 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}>
                  <div style={{ height: '120px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                    {p.emoji}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.category}</span>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0f172a', margin: '4px 0 10px' }}>{p.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>${p.price.toFixed(2)}</span>
                      <span style={{ fontSize: '0.75rem', color: p.stock > 10 ? '#16a34a' : '#ea580c', fontWeight: '500' }}>
                        {p.stock > 10 ? `${p.stock} disponibles` : `Solo ${p.stock}`}
                      </span>
                    </div>
                    <button onClick={() => setCart(prev => [...prev, p.id])} style={{ width: '100%', padding: '8px', background: '#3b82f6', border: 'none', borderRadius: '7px', color: 'white', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PERFIL */}
        {tab === 'perfil' && (
          <div style={{ maxWidth: '520px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>Mi perfil</h2>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: '52px', height: '52px', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: '700', color: '#2563eb', flexShrink: 0 }}>
                  {avatarLetter}
                </div>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>{user.name || 'Sin nombre'}</p>
                  <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '0.73rem', fontWeight: '600', marginTop: '4px', background: isAdmin ? '#f5f3ff' : '#eff6ff', color: isAdmin ? '#7c3aed' : '#2563eb', border: `1px solid ${isAdmin ? '#ddd6fe' : '#bfdbfe'}` }}>
                    {isAdmin ? 'Administrador' : 'Cliente'}
                  </span>
                </div>
              </div>
              {[
                { label: 'Correo electrónico', value: user.email },
                { label: 'ID de cuenta', value: user.id },
                { label: 'Miembro desde', value: new Date(user.createdAt).toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' }) },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontSize: '0.86rem' }}>{row.label}</span>
                  <span style={{ color: '#374151', fontSize: '0.86rem', fontWeight: '500' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADMIN */}
        {tab === 'admin' && isAdmin && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Panel de administración</h2>
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Gestión de usuarios y recursos de la plataforma</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
              {[
                { label: 'Usuarios', value: '4', color: '#2563eb', bg: '#eff6ff' },
                { label: 'Productos', value: '6', color: '#0891b2', bg: '#ecfeff' },
                { label: 'Órdenes este mes', value: '28', color: '#7c3aed', bg: '#f5f3ff' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px 20px' }}>
                  <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '8px' }}>{s.label}</p>
                  <p style={{ fontSize: '1.8rem', fontWeight: '800', color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Users table */}
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: '600', fontSize: '0.95rem', color: '#0f172a' }}>Gestión de usuarios</h3>
                <button style={{ padding: '6px 14px', background: '#3b82f6', border: 'none', borderRadius: '7px', color: 'white', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                  + Nuevo usuario
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Nombre', 'Correo', 'Rol', 'Estado', 'Acciones'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.77rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map(u => (
                      <tr key={u.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontSize: '0.88rem', fontWeight: '500', color: '#0f172a' }}>{u.name}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.86rem', color: '#64748b' }}>{u.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', background: u.role === 'admin' ? '#f5f3ff' : '#f0fdf4', color: u.role === 'admin' ? '#7c3aed' : '#16a34a', border: `1px solid ${u.role === 'admin' ? '#ddd6fe' : '#bbf7d0'}` }}>
                            {u.role === 'admin' ? 'Admin' : 'Cliente'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', background: u.status === 'activo' ? '#f0fdf4' : '#fef2f2', color: u.status === 'activo' ? '#16a34a' : '#dc2626' }}>
                            {u.status === 'activo' ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.82rem', cursor: 'pointer', marginRight: '10px', fontFamily: 'inherit' }}>Editar</button>
                          <button style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}