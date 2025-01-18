import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';

export default function Cocina({ comandas, actualizarEstadoComanda }) {
  const [tabActiva, setTabActiva] = useState('en_preparacion');

  const comandasEnPreparacion = comandas.filter(comanda => comanda.estado === 'pendiente' || comanda.estado === 'en_preparacion');
  const comandasFinalizadas = comandas.filter(comanda => comanda.estado === 'finalizado');

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
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          comanda.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
          comanda.estado === 'en_preparacion' ? 'bg-blue-100 text-blue-800' : 
          'bg-green-100 text-green-800'
        }`}>
          {comanda.estado === 'pendiente' ? 'Pendiente' : 
           comanda.estado === 'en_preparacion' ? 'En preparación' : 
           'Finalizado'}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        {comanda.esDomicilio ? `Domicilio: ${comanda.direccion}` : `Mesa: ${comanda.mesa}`}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        Tiempo: {comanda.estado === 'finalizado' 
          ? `${Math.round((comanda.tiempoFin - comanda.tiempoInicio) / 60000)} min`
          : `${comanda.tiempoEstimado} min (est.)`}
      </p>
      <ul className="list-disc list-inside text-sm mb-4 flex-grow">
        {comanda.items.map((item, index) => (
          <li key={index}>{item.nombre} - Cantidad: {item.cantidad}</li>
        ))}
      </ul>
      {comanda.estado !== 'finalizado' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => actualizarEstadoComanda(comanda.id, comanda.estado === 'pendiente' ? 'en_preparacion' : 'finalizado')}
          className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
            comanda.estado === 'pendiente' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-black hover:bg-gray-800'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
        >
          {comanda.estado === 'pendiente' ? (
            <>
              <Clock className="mr-2 h-4 w-4" /> Iniciar
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" /> Finalizar
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );

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
              onClick={() => setTabActiva('en_preparacion')}
              className={`${
                tabActiva === 'en_preparacion'
                  ? 'bg-[#e4f4ff] text-black'
                  : 'text-gray-500 hover:text-gray-700'
              } flex-1 px-3 py-2 font-medium text-sm rounded-md`}
            >
              En Preparación
            </button>
            <button
              onClick={() => setTabActiva('finalizados')}
              className={`${
                tabActiva === 'finalizados'
                  ? 'bg-[#e4f4ff] text-black'
                  : 'text-gray-500 hover:text-gray-700'
              } flex-1 px-3 py-2 font-medium text-sm rounded-md`}
            >
              Finalizados
            </button>
          </nav>
        </div>
        <AnimatePresence mode="wait">
          {tabActiva === 'en_preparacion' ? (
            comandasEnPreparacion.length === 0 ? (
              <motion.p
                key="no-prep"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-500"
              >
                No hay comandas en preparación
              </motion.p>
            ) : (
              <motion.div
                key="prep"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {comandasEnPreparacion.map(renderComanda)}
              </motion.div>
            )
          ) : (
            comandasFinalizadas.length === 0 ? (
              <motion.p
                key="no-fin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-500"
              >
                No hay comandas finalizadas
              </motion.p>
            ) : (
              <motion.div
                key="fin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {comandasFinalizadas.map(renderComanda)}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

