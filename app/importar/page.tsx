'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ImportarPage() {
  const router = useRouter()
  const [archivo, setArchivo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [error, setError] = useState('')

  const handleImportar = async () => {
    if (!archivo) { setError('Selecciona un archivo Excel'); return }
    setLoading(true)
    setError('')
    setResultado(null)

    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('file', archivo)

    try {
      const res = await fetch('http://127.0.0.1:8000/deudores/importar-excel', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || 'Error al importar')
        return
      }
      setResultado(data)
    } catch {
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => router.push('/dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1rem' }}>
          ← Volver
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Importar Excel</h1>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Formato requerido</h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
          El archivo Excel debe tener las siguientes columnas:
        </p>
        <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#374151' }}>
          <p style={{ margin: '2px 0' }}><span style={{ color: '#dc2626' }}>*</span> codigo_usuario</p>
          <p style={{ margin: '2px 0' }}><span style={{ color: '#dc2626' }}>*</span> nombre</p>
          <p style={{ margin: '2px 0' }}><span style={{ color: '#dc2626' }}>*</span> monto_deuda</p>
          <p style={{ margin: '2px 0', color: '#94a3b8' }}>codigo_judicial (opcional)</p>
          <p style={{ margin: '2px 0', color: '#94a3b8' }}>dni (opcional)</p>
          <p style={{ margin: '2px 0', color: '#94a3b8' }}>telefono (opcional)</p>
          <p style={{ margin: '2px 0', color: '#94a3b8' }}>telefono_2 (opcional)</p>
          <p style={{ margin: '2px 0', color: '#94a3b8' }}>direccion (opcional)</p>
          <p style={{ margin: '2px 0', color: '#94a3b8' }}>etapa (opcional: prejudicial/judicial/castigo)</p>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Seleccionar archivo</h2>
        
        <div style={{
          border: '2px dashed #e2e8f0', borderRadius: '10px', padding: '2rem',
          textAlign: 'center', cursor: 'pointer', marginBottom: '1rem',
          background: archivo ? '#f0fdf4' : '#f8fafc'
        }}
          onClick={() => document.getElementById('fileInput')?.click()}>
          <p style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>📊</p>
          <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
            {archivo ? archivo.name : 'Clic para seleccionar archivo Excel'}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            .xlsx o .xls
          </p>
          <input id="fileInput" type="file" accept=".xlsx,.xls"
            style={{ display: 'none' }}
            onChange={e => setArchivo(e.target.files?.[0] || null)} />
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {resultado && (
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <p style={{ fontWeight: '600', color: '#166534', marginBottom: '6px' }}>✅ Importación completada</p>
            <p style={{ fontSize: '0.875rem', color: '#166534' }}>Deudores creados: <b>{resultado.creados}</b></p>
            <p style={{ fontSize: '0.875rem', color: resultado.errores > 0 ? '#dc2626' : '#166534' }}>Errores: <b>{resultado.errores}</b></p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleImportar} disabled={loading || !archivo}
            style={{ padding: '0.75rem 2rem', background: loading || !archivo ? '#94a3b8' : '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: loading || !archivo ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
            {loading ? 'Importando...' : 'Importar deudores'}
          </button>
          {resultado && (
            <button onClick={() => router.push('/deudores')}
              style={{ padding: '0.75rem 2rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              Ver deudores →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}