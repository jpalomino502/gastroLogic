import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, MinusCircle, Trash2, ShoppingBag, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatPrice } from '../utils/formatPrice';

function Comandas({ menu, agregarComanda, comandas = [] }) {
  const [comanda, setComanda] = useState({ mesa: '', items: [], total: 0, esDomicilio: false, direccion: '' });
  const [tabActiva, setTabActiva] = useState('nueva');

  const agregarItem = (plato) => {
    const itemExistente = comanda.items.find(item => item.nombre === plato.nombre);
    if (itemExistente) {
      setComanda(prevComanda => ({
        ...prevComanda,
        items: prevComanda.items.map(item =>
          item.nombre === plato.nombre
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ),
        total: prevComanda.total + plato.precio
      }));
    } else {
      setComanda(prevComanda => ({
        ...prevComanda,
        items: [...prevComanda.items, { ...plato, cantidad: 1 }],
        total: prevComanda.total + plato.precio
      }));
    }
  };

  const eliminarItem = (index) => {
    const itemEliminado = comanda.items[index];
    setComanda(prevComanda => ({
      ...prevComanda,
      items: prevComanda.items.filter((_, i) => i !== index),
      total: prevComanda.total - (itemEliminado.precio * itemEliminado.cantidad)
    }));
  };

  const actualizarCantidad = (index, incremento) => {
    const item = comanda.items[index];
    if (item.cantidad + incremento > 0) {
      setComanda(prevComanda => ({
        ...prevComanda,
        items: prevComanda.items.map((item, i) => 
          i === index ? { ...item, cantidad: item.cantidad + incremento } : item
        ),
        total: prevComanda.total + (item.precio * incremento)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((comanda.mesa || (comanda.esDomicilio && comanda.direccion)) && comanda.items.length > 0) {
      agregarComanda(comanda);
      setComanda({ mesa: '', items: [], total: 0, esDomicilio: false, direccion: '' });
      toast.success('Comanda creada correctamente');
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6 md:mb-8">
            Gestión de Comandas 📑</h1>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setTabActiva('nueva')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tabActiva === 'nueva' 
              ? 'bg-[#e4f4ff] text-zinc-900' 
              : 'bg-white text-zinc-600 hover:bg-gray-100'
          }`}
        >
          Nueva Comanda
        </button>
        <button
          onClick={() => setTabActiva('lista')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tabActiva === 'lista' 
              ? 'bg-[#e4f4ff] text-zinc-900' 
              : 'bg-white text-zinc-600 hover:bg-gray-100'
          }`}
        >
          Lista de Comandas
        </button>
      </div>

      {tabActiva === 'nueva' ? (
        <>
          <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Nueva Comanda</h2>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
            className="bg-[#f0f7ff] rounded-xl border border-gray-100 shadow-sm p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="tipoComanda"
                    checked={!comanda.esDomicilio}
                    onChange={() => setComanda(prev => ({ ...prev, esDomicilio: false, mesa: '', direccion: '' }))}
                  />
                  <span className="ml-2 text-zinc-700">Mesa</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="tipoComanda"
                    checked={comanda.esDomicilio}
                    onChange={() => setComanda(prev => ({ ...prev, esDomicilio: true, mesa: '', direccion: '' }))}
                  />
                  <span className="ml-2 text-zinc-700">Domicilio</span>
                </label>
              </div>
              {comanda.esDomicilio ? (
                <div>
                  <label htmlFor="direccion" className="block text-sm font-medium text-zinc-700">Dirección de Entrega</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="direccion"
                      value={comanda.direccion}
                      onChange={(e) => setComanda({ ...comanda, direccion: e.target.value })}
                      className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Calle 123 #45-67"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="mesa" className="block text-sm font-medium text-zinc-700">Número de Mesa</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ShoppingBag className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="mesa"
                      value={comanda.mesa}
                      onChange={(e) => setComanda({ ...comanda, mesa: e.target.value })}
                      className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: 5"
                    />
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-2">Menú</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {menu.map((plato, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => agregarItem(plato)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-zinc-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {plato.nombre}
                    </motion.button>
                  ))}
                </div>
              </div>
            </form>
          </motion.div>

          <h2 className="text-2xl font-semibold text-zinc-900 mb-4 mt-6">Resumen de la Comanda</h2>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-[#fff0f5] rounded-xl border border-gray-100 shadow-sm p-6"
          >
            <ul className="space-y-2">
              {comanda.items.map((item, index) => (
                <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-zinc-700">{item.nombre}</span>
                  <div className="flex items-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => actualizarCantidad(index, -1)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <MinusCircle className="h-5 w-5" />
                    </motion.button>
                    <span className="mx-2 font-medium">{item.cantidad}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => actualizarCantidad(index, 1)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <PlusCircle className="h-5 w-5" />
                    </motion.button>
                    <span className="mr-2 text-zinc-900 font-medium">{formatPrice(item.precio * item.cantidad)}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => eliminarItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </motion.button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
              <span className="text-2xl font-bold text-zinc-900 mb-2 sm:mb-0">Total: {formatPrice(comanda.total)}</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={comanda.items.length === 0 || (!comanda.mesa && !comanda.direccion)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Crear Comanda
              </motion.button>
            </div>
          </motion.div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Lista de Comandas</h2>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
            className="bg-[#f0fff0] rounded-xl border border-gray-100 shadow-sm p-6 overflow-x-auto"
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Comanda</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa/Domicilio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comandas && comandas.length > 0 ? (
                  comandas.map((comanda) => (
                    <tr key={comanda.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">#{comanda.numeroComanda}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                        {comanda.esDomicilio ? `Domicilio: ${comanda.direccion}` : `Mesa: ${comanda.mesa}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          comanda.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                          comanda.estado === 'en_preparacion' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {comanda.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 font-medium">{formatPrice(comanda.total)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                        <ul className="list-disc list-inside">
                          {comanda.items.map((item, index) => (
                            <li key={index}>{item.nombre} x {item.cantidad}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No hay comandas disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default Comandas;
