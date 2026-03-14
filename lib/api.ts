const API_URL = 'http://127.0.0.1:8000'

function getToken() {
  return localStorage.getItem('token')
}

function headers() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  }
}

export async function getDeudores() {
  const res = await fetch(`${API_URL}/deudores/`, { headers: headers() })
  if (!res.ok) throw new Error('Error al obtener deudores')
  return res.json()
}

export async function getGestiones() {
  const res = await fetch(`${API_URL}/gestiones/listar`, { headers: headers() })
  if (!res.ok) throw new Error('Error al obtener gestiones')
  return res.json()
}

export async function crearDeudor(data: object) {
  const res = await fetch(`${API_URL}/deudores/`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Error al crear deudor')
  return res.json()
}

export async function crearGestion(data: object) {
  const res = await fetch(`${API_URL}/gestiones/`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Error al crear gestión')
  return res.json()
}