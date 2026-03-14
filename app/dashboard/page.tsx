'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) return <div>Cargando...</div>

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '1.5rem' }}>🦜</h1>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
          CobraFlow
        </h1>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {[
          { label: 'Total deudores', valor: '0', color: '#3b82f6' },
          { label: 'Gestiones hoy', valor: '0', color: '#10b981' },
          { label: 'Monto cartera', valor: 'S/. 0', color: '#f59e0b' },
          { label: 'Promesas de pago', valor: '0', color: '#8b5cf6' },
        ].map((card) => (
          <div key={card.label} style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.5rem',
            borderTop: `4px solid ${card.color}`
          }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{card.label}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', marginTop: '0.5rem' }}>
              {card.valor}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
          Acciones rápidas
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {['Ver deudores', 'Registrar gestión', 'Importar Excel', 'Ver reportes'].map(accion => (
            <button key={accion} style={{
              padding: '0.75rem 1.5rem',
              background: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {accion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}