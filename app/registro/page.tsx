'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmar: '',
    ruc: '',
    telefono: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://cobraflow-backend-production-6ef7.up.railway.app/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          ruc: form.ruc || null,
          telefono: form.telefono || null
        })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || 'Error al registrarse')
        return
      }
      router.push('/login')
    } catch {
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', background: '#f8fafc'
    }}>
      <div style={{
        background: 'white', padding: '2.5rem', borderRadius: '16px',
        border: '1px solid #e2e8f0', width: '100%', maxWidth: '480px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem' }}>🦜</h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>CobraFlow</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Crea tu cuenta gratuita</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                Nombre de la gestora <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required
                placeholder="Gestora ABC S.A.C."
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="contacto@gestora.com"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>RUC</label>
                <input type="text" name="ruc" value={form.ruc} onChange={handleChange}
                  placeholder="20123456789"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>Teléfono</label>
                <input type="text" name="telefono" value={form.telefono} onChange={handleChange}
                  placeholder="999888777"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                Contraseña <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required
                placeholder="Mínimo 6 caracteres"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                Confirmar contraseña <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="password" name="confirmar" value={form.confirmar} onChange={handleChange} required
                placeholder="Repite tu contraseña"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }} />
            </div>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '0.75rem', background: loading ? '#94a3b8' : '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1.5rem' }}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
            ¿Ya tienes cuenta?{' '}
            <span onClick={() => router.push('/login')}
              style={{ color: '#0f172a', fontWeight: '600', cursor: 'pointer' }}>
              Iniciar sesión
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}