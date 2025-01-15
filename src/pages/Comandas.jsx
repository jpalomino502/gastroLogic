import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircleIcon, TrashIcon } from '../components/Icons';
import toast from 'react-hot-toast';
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        <button
          onClick={() => setTabActiva('nueva')}
          className={`px-4 py-2 font-medium rounded-md ${
            tabActiva === 'nueva' ? 'bg-black text-white' : 'bg-gray-200 text-black'
          }`}
        >
          Nueva Comanda
        </button>
        <button
          onClick={() => setTabActiva('lista')}
          className={`px-4 py-2 font-medium rounded-md ${
            tabActiva === 'lista' ? 'bg-black text-white' : 'bg-gray-200 text-black'
          }`}
        >
          Lista de Comandas
        </button>
      </div>

      {tabActiva === 'nueva' ? (
        <>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg rounded-lg p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nueva Comanda</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-black"
                    name="tipoComanda"
                    checked={!comanda.esDomicilio}
                    onChange={() => setComanda(prev => ({ ...prev, esDomicilio: false, mesa: '', direccion: '' }))}
                  />
                  <span className="ml-2">Mesa</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-black"
                    name="tipoComanda"
                    checked={comanda.esDomicilio}
                    onChange={() => setComanda(prev => ({ ...prev, esDomicilio: true, mesa: '', direccion: '' }))}
                  />
                  <span className="ml-2">Domicilio</span>
                </label>
              </div>
              {comanda.esDomicilio ? (
                <div>
                  <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección de Entrega</label>
                  <input
                    type="text"
                    id="direccion"
                    value={comanda.direccion}
                    onChange={(e) => setComanda({ ...comanda, direccion: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                    placeholder="Ej: Calle 123 #45-67"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="mesa" className="block text-sm font-medium text-gray-700">Número de Mesa</label>
                  <input
                    type="text"
                    id="mesa"
                    value={comanda.mesa}
                    onChange={(e) => setComanda({ ...comanda, mesa: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                    placeholder="Ej: 5"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Menú</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {menu.map((plato, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => agregarItem(plato)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      <PlusCircleIcon className="mr-2 h-4 w-4" />
                      {plato.nombre}
                    </motion.button>
                  ))}
                </div>
              </div>
            </form>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white shadow-lg rounded-lg p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Resumen de la Comanda</h2>
            <ul className="space-y-2">
              {comanda.items.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{item.nombre} x {item.cantidad}</span>
                  <div>
                    <span className="mr-2">${formatPrice(item.precio * item.cantidad)}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => eliminarItem(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </motion.button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
              <span className="text-lg font-bold mb-2 sm:mb-0">Total: ${formatPrice(comanda.total)}</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={comanda.items.length === 0 || (!comanda.mesa && !comanda.direccion)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
              >
                Crear Comanda
              </motion.button>
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3 }}
          className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Comandas</h2>
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
                    <td className="px-6 py-4 whitespace-nowrap">{comanda.numeroComanda}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap">${formatPrice(comanda.total)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
      )}
    </div>
  );
}

export default Comandas;
