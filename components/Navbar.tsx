'use client'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  const links = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Deudores', href: '/deudores' },
    { label: 'Importar Excel', href: '/importar' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '60px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          onClick={() => router.push('/dashboard')}>
          <span style={{ fontSize: '1.25rem' }}>🦜</span>
          <span style={{ fontWeight: '700', fontSize: '1rem', color: '#1e293b' }}>CobraFlow</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {links.map(link => (
            <button key={link.href} onClick={() => router.push(link.href)}
              style={{
                padding: '0.4rem 1rem',
                background: pathname === link.href ? '#f1f5f9' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: pathname === link.href ? '600' : '400',
                color: pathname === link.href ? '#1e293b' : '#64748b'
              }}>
              {link.label}
            </button>
          ))}
        </div>
      </div>
      <button onClick={handleLogout}
        style={{ padding: '0.4rem 1rem', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', color: '#64748b' }}>
        Cerrar sesión
      </button>
    </nav>
  )
}