export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1e293b' }}>
          🦜 CobraFlow
        </h1>
        <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '1.2rem' }}>
          CRM Financiero para gestoras de cobranza
        </p>
      </div>
    </div>
  )
}