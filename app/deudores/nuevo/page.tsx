'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearDeudor } from '../../../lib/api'

export default function NuevoDeudorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    codigo_usuario: '',
    codigo_judicial: '',
    nombre: '',
    dni: '',
    telefono: '',
    telefono_2: '',
    direccion: '',
    email: '',
    monto_deuda: '',
    moneda: 'PEN',
    etapa: 'prejudicial'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await crearDeudor({
        ...form,
        monto_deuda: parseFloat(form.monto_deuda),
        codigo_judicial: form.codigo_judicial || null,
        telefono_2: form.telefono_2 || null,
        direccion: form.direccion || null,
        email: form.email || null,
      })
      router.push('/deudores')
    } catch {
      setError('Error al crear el deudor')
    } finally {
      setLoading(false)
    }
  }

  const campo = (label: string, name: string, type = 'text', required = false) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name as keyof typeof form]}
        onChange={handleChange}
        required={required}
        style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem' }}
      />
    </div>
  )

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => router.push('/deudores')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1rem' }}>
          ← Volver
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Nuevo deudor</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>Datos de identificación</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {campo('Código usuario', 'codigo_usuario', 'text', true)}
            {campo('Código judicial', 'codigo_judicial')}
            {campo('Nombre completo', 'nombre', 'text', true)}
            {campo('DNI', 'dni')}
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>Contacto</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {campo('Teléfono', 'telefono')}
            {campo('Teléfono 2', 'telefono_2')}
            {campo('Email', 'email', 'email')}
            {campo('Dirección', 'direccion')}
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>Datos de deuda</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {campo('Monto deuda', 'monto_deuda', 'number', true)}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Moneda</label>
              <select name="moneda" value={form.moneda} onChange={handleChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem' }}>
                <option value="PEN">PEN (Soles)</option>
                <option value="USD">USD (Dólares)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Etapa</label>
              <select name="etapa" value={form.etapa} onChange={handleChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem' }}>
                <option value="prejudicial">Prejudicial</option>
                <option value="judicial">Judicial</option>
                <option value="castigo">Castigo</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" disabled={loading}
            style={{ padding: '0.75rem 2rem', background: loading ? '#94a3b8' : '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '0.875rem' }}>
            {loading ? 'Guardando...' : 'Crear deudor'}
          </button>
          <button type="button" onClick={() => router.push('/deudores')}
            style={{ padding: '0.75rem 2rem', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#64748b', fontSize: '0.875rem' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}