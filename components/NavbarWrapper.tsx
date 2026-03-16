'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

const rutasSinNavbar = ['/', '/login']

export default function NavbarWrapper() {
  const pathname = usePathname()
  
  if (rutasSinNavbar.includes(pathname)) return null
  
  return <Navbar />
}