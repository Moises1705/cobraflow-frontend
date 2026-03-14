'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function DeudorDetallePage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [deudor, setDeudor] = useState<any>(null)
  const [gestiones, setGestiones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarFormGestion, setMostrarFormGestion] = useState(false)
  const [nuevaGestion, setNuevaGestion] = useState({
    tipo: 'call', resultado: '', comentario: '', monto_prometido: '',
  })

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) { router.push('/login'); return }
    if (!id) return
    cargarDatos(t)
  }, [id])

  const cargarDatos = async (t: string) => {
    const h = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${t}`
    }
    try {
      const [resDeudor, resGestiones] = await Promise.all([
        fetch(`http://127.0.0.1:8000/deudores/${id}`, { headers: h }),
        fetch(`http://127.0.0.1:8000/gestiones/deudor/${id}`, { headers: h })
      ])
      const d = await resDeudor.json()
      const g = await resGestiones.json()
      setDeudor(d)
      setGestiones(Array.isArray(g) ? g : [])
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const registrarGestion = async () => {
    const t = localStorage.getItem('token')
    const h = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${t}`
    }
    try {
      await fetch('http://127.0.0.1:8000/gestiones/', {
        method: 'POST', headers: h,
        body: JSON.stringify({ ...nuevaGestion, deudor_id: id })
      })
      setMostrarFormGestion(false)
      setNuevaGestion({ tipo: 'call', resultado: '', comentario: '', monto_prometido: '' })
      cargarDatos(t!)
    } catch {
      alert('Error al registrar gestión')
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#64748b' }}>Cargando...</p>
    </div>
  )

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => router.push('/deudores')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1rem' }}>
          ← Volver
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>{deudor?.nombre}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Código usuario', valor: deudor?.codigo_usuario },
          { label: 'Código judicial', valor: deudor?.codigo_judicial || '-' },
          { label: 'DNI', valor: deudor?.dni || '-' },
          { label: 'Teléfono', valor: deudor?.telefono || '-' },
          { label: 'Teléfono 2', valor: deudor?.telefono_2 || '-' },
          { label: 'Email', valor: deudor?.email || '-' },
          { label: 'Dirección', valor: deudor?.direccion || '-' },
          { label: 'Monto deuda', valor: `S/. ${deudor?.monto_deuda?.toLocaleString()}` },
          { label: 'Etapa', valor: deudor?.etapa },
          { label: 'Estado', valor: deudor?.estado },
        ].map(item => (
          <div key={item.label} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>{item.label}</p>
            <p style={{ fontSize: '0.95rem', fontWeight: '500', color: '#1e293b' }}>{item.valor}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Historial de gestiones ({gestiones.length})</h2>
          <button onClick={() => setMostrarFormGestion(!mostrarFormGestion)}
            style={{ padding: '0.6rem 1.2rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            + Registrar gestión
          </button>
        </div>

        {mostrarFormGestion && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>Tipo</label>
                <select value={nuevaGestion.tipo} onChange={e => setNuevaGestion({...nuevaGestion, tipo: e.target.value})}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <option value="call">Call</option>
                  <option value="campo">Campo</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>Resultado</label>
                <select value={nuevaGestion.resultado} onChange={e => setNuevaGestion({...nuevaGestion, resultado: e.target.value})}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <option value="">Seleccionar...</option>
                  <option value="contactado">Contactado</option>
                  <option value="no_contesta">No contesta</option>
                  <option value="promesa_pago">Promesa de pago</option>
                  <option value="numero_equivocado">Número equivocado</option>
                  <option value="buzon">Buzón</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>Monto prometido</label>
                <input type="text" placeholder="S/. 0.00" value={nuevaGestion.monto_prometido}
                  onChange={e => setNuevaGestion({...nuevaGestion, monto_prometido: e.target.value})}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>Comentario</label>
                <input type="text" placeholder="Observaciones..." value={nuevaGestion.comentario}
                  onChange={e => setNuevaGestion({...nuevaGestion, comentario: e.target.value})}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button onClick={registrarGestion}
                style={{ padding: '0.6rem 1.5rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
                Guardar
              </button>
              <button onClick={() => setMostrarFormGestion(false)}
                style={{ padding: '0.6rem 1.5rem', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {gestiones.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No hay gestiones registradas</p>
        ) : gestiones.map(g => (
          <div key={g.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' }}>{g.tipo}</span>
                {g.resultado && <span style={{ background: '#f0fdf4', color: '#166534', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem' }}>{g.resultado}</span>}
                {g.monto_prometido && <span style={{ background: '#fef9c3', color: '#854d0e', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem' }}>S/. {g.monto_prometido}</span>}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(g.fecha_gestion).toLocaleString('es-PE')}</span>
            </div>
            {g.comentario && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>{g.comentario}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}