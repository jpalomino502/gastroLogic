import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle } from 'lucide-react'

export default function Cocina({ comandas, actualizarEstadoComanda, platos, actualizarDisponibilidadPlato }) {
  const [tabActiva, setTabActiva] = useState("pendientes")

  const comandasPendientes = comandas.filter((comanda) => comanda.estado === "pendiente")

  const renderComanda = (comanda) => (
    <motion.div
      key={comanda.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col h-full"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Nº {comanda.numeroComanda}</span>
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        {comanda.esDomicilio ? `Domicilio: ${comanda.direccion}` : `Mesa: ${comanda.mesa}`}
      </p>
      <p className="text-sm text-gray-600 mb-2">Tiempo estimado: {comanda.tiempoEstimado} min</p>
      <ul className="list-disc list-inside text-sm mb-4 flex-grow">
        {comanda.items.map((item, index) => (
          <li key={index}>
            {item.nombre} - Cantidad: {item.cantidad}
          </li>
        ))}
      </ul>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => actualizarEstadoComanda(comanda.id, "finalizado")}
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
      >
        <CheckCircle className="mr-2 h-4 w-4" /> Finalizar
      </motion.button>
    </motion.div>
  )

  const renderPlato = (plato) => (
    <motion.div
      key={plato.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center"
    >
      <span className="font-semibold">{plato.nombre}</span>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => actualizarDisponibilidadPlato(plato.id, !plato.disponible)}
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          plato.disponible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {plato.disponible ? (
          <>
            <CheckCircle className="mr-1 h-4 w-4" /> Disponible
          </>
        ) : (
          <>
            <XCircle className="mr-1 h-4 w-4" /> No disponible
          </>
        )}
      </motion.button>
    </motion.div>
  )

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6 md:mb-8">Cocina</h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#f0f7ff] shadow-lg rounded-lg p-4"
      >
        <div className="mb-4">
          <nav className="flex space-x-2" aria-label="Tabs">
            <button
              onClick={() => setTabActiva("pendientes")}
              className={`${
                tabActiva === "pendientes" ? "bg-[#e4f4ff] text-black" : "text-gray-500 hover:text-gray-700"
              } flex-1 px-3 py-2 font-medium text-sm rounded-md`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setTabActiva("platos")}
              className={`${
                tabActiva === "platos" ? "bg-[#e4f4ff] text-black" : "text-gray-500 hover:text-gray-700"
              } flex-1 px-3 py-2 font-medium text-sm rounded-md`}
            >
              Platos
            </button>
          </nav>
        </div>
        <AnimatePresence mode="wait">
          {tabActiva === "pendientes" ? (
            comandasPendientes.length === 0 ? (
              <motion.p
                key="no-pendientes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-500"
              >
                No hay comandas pendientes
              </motion.p>
            ) : (
              <motion.div
                key="pendientes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {comandasPendientes.map(renderComanda)}
              </motion.div>
            )
          ) : platos && platos.length > 0 ? (
            <motion.div
              key="platos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {platos.map(renderPlato)}
            </motion.div>
          ) : (
            <p className="text-center text-gray-500">No hay platos disponibles</p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
