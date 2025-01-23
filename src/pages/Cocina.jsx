import React from "react"
import { CheckCircle, XCircle } from "lucide-react"

const staticComandas = [
  {
    id: 1,
    numeroComanda: 1001,
    mesa: "5",
    estado: "pendiente",
    items: [
      { nombre: "Pizza Margherita", cantidad: 2 },
      { nombre: "Ensalada César", cantidad: 1 },
    ],
    tiempoEstimado: 20,
  },
  {
    id: 2,
    numeroComanda: 1002,
    direccion: "Calle 123 #45-67",
    estado: "en_preparacion",
    items: [
      { nombre: "Hamburguesa Clásica", cantidad: 1 },
      { nombre: "Papas Fritas", cantidad: 1 },
    ],
    tiempoEstimado: 15,
  },
  {
    id: 3,
    numeroComanda: 1003,
    mesa: "3",
    estado: "finalizado",
    items: [
      { nombre: "Pasta Carbonara", cantidad: 1 },
      { nombre: "Tiramisú", cantidad: 1 },
    ],
    tiempoEstimado: 0,
  },
]

const staticPlatos = [
  { id: 1, nombre: "Pizza Margherita", disponible: true },
  { id: 2, nombre: "Hamburguesa Clásica", disponible: true },
  { id: 3, nombre: "Pasta Carbonara", disponible: false },
  { id: 4, nombre: "Ensalada César", disponible: true },
  { id: 5, nombre: "Sushi Variado", disponible: true },
]

export default function Cocina() {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6 md:mb-8">Cocina</h1>
      <div className="bg-[#f0f7ff] shadow-lg rounded-lg p-4">
        <div className="mb-4">
          <nav className="flex space-x-2" aria-label="Tabs">
            <button className="bg-[#e4f4ff] text-black flex-1 px-3 py-2 font-medium text-sm rounded-md">
              Pendientes
            </button>
            <button className="text-gray-500 hover:text-gray-700 flex-1 px-3 py-2 font-medium text-sm rounded-md">
              Platos
            </button>
          </nav>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staticComandas
            .filter((comanda) => comanda.estado === "pendiente")
            .map((comanda) => (
              <div key={comanda.id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Nº {comanda.numeroComanda}</span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pendiente
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {comanda.mesa ? `Mesa: ${comanda.mesa}` : `Domicilio: ${comanda.direccion}`}
                </p>
                <p className="text-sm text-gray-600 mb-2">Tiempo estimado: {comanda.tiempoEstimado} min</p>
                <ul className="list-disc list-inside text-sm mb-4 flex-grow">
                  {comanda.items.map((item, index) => (
                    <li key={index}>
                      {item.nombre} - Cantidad: {item.cantidad}
                    </li>
                  ))}
                </ul>
                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                  <CheckCircle className="mr-2 h-4 w-4" /> Finalizar
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

