'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDeudores } from '../../lib/api'

export default function DeudoresPage() {
  const router = useRouter()
  const [deudores, setDeudores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEtapa, setFiltroEtapa] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    cargarDeudores()
  }, [router])

  const cargarDeudores = async () => {
    try {
      const data = await getDeudores()
      setDeudores(data)
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const deudoresFiltrados = deudores.filter(d => {
    const coincideBusqueda =
      d.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      d.codigo_usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      (d.dni && d.dni.includes(busqueda))
    const coincideEtapa = filtroEtapa ? d.etapa === filtroEtapa : true
    return coincideBusqueda && coincideEtapa
  })

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#64748b' }}>Cargando deudores...</p>
    </div>
  )

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1rem' }}>
            ← Volver
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Deudores</h1>
        </div>
        <button
          onClick={() => router.push('/deudores/nuevo')}
          style={{ padding: '0.75rem 1.5rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          + Nuevo deudor
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Buscar por nombre, código o DNI..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ flex: 1, padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem' }}
        />
        <select
          value={filtroEtapa}
          onChange={e => setFiltroEtapa(e.target.value)}
          style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', color: '#374151' }}
        >
          <option value="">Todas las etapas</option>
          <option value="prejudicial">Prejudicial</option>
          <option value="judicial">Judicial</option>
          <option value="castigo">Castigo</option>
        </select>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              {['Código', 'Nombre', 'DNI', 'Teléfono', 'Monto', 'Etapa', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deudoresFiltrados.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No se encontraron deudores
                </td>
              </tr>
            ) : deudoresFiltrados.map(d => (
              <tr key={d.id} style={{ borderTop: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >
                <td style={{ padding: '1rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>{d.codigo_usuario}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600' }}>{d.nombre}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{d.dni || '-'}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{d.telefono || '-'}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '700', color: '#0f172a' }}>S/. {d.monto_deuda.toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' }}>{d.etapa}</span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ background: d.estado === 'activo' ? '#dcfce7' : '#fef9c3', color: d.estado === 'activo' ? '#166534' : '#854d0e', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' }}>{d.estado}</span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button
                    onClick={() => router.push(`/deudores/${d.id}`)}
                    style={{ padding: '0.4rem 0.9rem', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', color: '#374151' }}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
        {deudoresFiltrados.length} de {deudores.length} deudores
      </p>
    </div>
  )
}