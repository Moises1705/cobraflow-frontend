'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDeudores, getGestiones } from '../../lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [deudores, setDeudores] = useState<any[]>([])
  const [gestiones, setGestiones] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    cargarDatos()
  }, [router])

  const cargarDatos = async () => {
    try {
      const [d, g] = await Promise.all([getDeudores(), getGestiones()])
      setDeudores(d)
      setGestiones(g)
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const montoTotal = deudores.reduce((acc, d) => acc + d.monto_deuda, 0)
  const promesas = gestiones.filter(g => g.resultado === 'promesa_pago').length
  const hoy = new Date().toISOString().split('T')[0]
  const gestionesHoy = gestiones.filter(g => g.fecha_gestion?.startsWith(hoy)).length

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#64748b' }}>Cargando CobraFlow...</p>
    </div>
  )

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{ fontSize: '1.5rem' }}>🦜</h1>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>CobraFlow</h1>
        </div>
        <button
          onClick={() => { localStorage.removeItem('token'); router.push('/login') }}
          style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}
        >
          Cerrar sesión
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total deudores', valor: deudores.length, color: '#3b82f6' },
          { label: 'Gestiones hoy', valor: gestionesHoy, color: '#10b981' },
          { label: 'Monto cartera', valor: `S/. ${montoTotal.toLocaleString()}`, color: '#f59e0b' },
          { label: 'Promesas de pago', valor: promesas, color: '#8b5cf6' },
        ].map((card) => (
          <div key={card.label} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', borderTop: `4px solid ${card.color}` }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{card.label}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', marginTop: '0.5rem' }}>{card.valor}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Deudores recientes</h2>
        {deudores.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No hay deudores registrados aún</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                {['Código', 'Nombre', 'DNI', 'Monto', 'Etapa', 'Estado'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deudores.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{d.codigo_usuario}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500' }}>{d.nombre}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>{d.dni || '-'}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600' }}>S/. {d.monto_deuda.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem' }}>{d.etapa}</span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ background: d.estado === 'activo' ? '#dcfce7' : '#fef9c3', color: d.estado === 'activo' ? '#166534' : '#854d0e', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem' }}>{d.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}