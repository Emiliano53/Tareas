import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold">Mi Aplicación</h1>
      <p className="text-gray-600 mb-8">Bienvenido a mi app</p>
      
      <div className="flex justify-center gap-4">
        <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
          Iniciar Sesión
        </Link>
        <Link href="/register" className="px-4 py-2 bg-gray-200 rounded">
          Registrarse
        </Link>
      </div>
    </div>
  )
}