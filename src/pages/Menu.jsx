import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '../components/Icons';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatPrice';

function Menu({ menu, agregarPlato, editarPlato, eliminarPlato }) {
  const [nuevoPlato, setNuevoPlato] = useState({ nombre: '', precio: '' });
  const [platoEditando, setPlatoEditando] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuevoPlato.nombre && nuevoPlato.precio) {
      if (platoEditando) {
        editarPlato(platoEditando.id, { ...nuevoPlato, precio: parseFloat(nuevoPlato.precio) });
        toast.success('Plato editado correctamente');
        setPlatoEditando(null);
      } else {
        agregarPlato({ ...nuevoPlato, precio: parseFloat(nuevoPlato.precio) });
        toast.success('Plato agregado correctamente');
      }
      setNuevoPlato({ nombre: '', precio: '' });
    }
  };

  const handleEditar = (plato) => {
    setPlatoEditando(plato);
    setNuevoPlato({ nombre: plato.nombre, precio: plato.precio.toString() });
  };

  const handleEliminar = (id) => {
    eliminarPlato(id);
    toast.success('Plato eliminado correctamente');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
        className="bg-white shadow-lg rounded-lg p-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {platoEditando ? 'Editar Plato' : 'Agregar Nuevo Plato'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del plato</label>
              <input
                type="text"
                id="nombre"
                value={nuevoPlato.nombre}
                onChange={(e) => setNuevoPlato({ ...nuevoPlato, nombre: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                placeholder="Ej: Pasta Carbonara"
              />
            </div>
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
              <input
                type="number"
                id="precio"
                value={nuevoPlato.precio}
                onChange={(e) => {
                  const value = e.target.value.replace(/\./g, '').replace(',', '.');
                  setNuevoPlato({ ...nuevoPlato, precio: value });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                placeholder="Ej: 12,99"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-start space-y-2 sm:space-y-0 sm:space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {platoEditando ? (
                <>
                  <PencilIcon className="mr-2 h-5 w-5" /> Guardar Cambios
                </>
              ) : (
                <>
                  <PlusCircleIcon className="mr-2 h-5 w-5" /> Agregar Plato
                </>
              )}
            </motion.button>
            {platoEditando && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setPlatoEditando(null);
                  setNuevoPlato({ nombre: '', precio: '' });
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Cancelar
              </motion.button>
            )}
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Menú Actual</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {menu.map((plato) => (
            <motion.div
              key={plato.id}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-50 rounded-lg p-4 shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">{plato.nombre}</h3>
                <p className="text-2xl font-bold text-black">${formatPrice(plato.precio)}</p>
              </div>
              <div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEditar(plato)}
                  className="text-black hover:text-gray-800 mr-2"
                >
                  <PencilIcon className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEliminar(plato.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Menu;
