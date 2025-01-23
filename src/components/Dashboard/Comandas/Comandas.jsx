import React from "react";
import { PlusCircle, MinusCircle, Trash2, ShoppingBag } from "lucide-react";

const Comandas = () => {
  const staticComandas = [
    {
      id: 1,
      mesa: "5",
      items: [
        { nombre: "Pizza Margherita", cantidad: 2, precio: 12.99 },
        { nombre: "Ensalada César", cantidad: 1, precio: 8.75 },
      ],
      total: 34.73,
    },
    {
      id: 2,
      direccion: "Calle 123 #45-67",
      items: [
        { nombre: "Hamburguesa Clásica", cantidad: 1, precio: 11.25 },
        { nombre: "Papas Fritas", cantidad: 1, precio: 3.5 },
      ],
      total: 14.75,
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6 md:mb-8">Gestión de Comandas 📑</h1>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-4">
          <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Nueva Comanda</h2>
          <div className="bg-[#f0f7ff] rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <form className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
                <label className="inline-flex items-center mb-2 sm:mb-0">
                  <input type="radio" className="form-radio text-blue-600" name="tipoComanda" />
                  <span className="ml-2 text-zinc-700">Mesa</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio text-blue-600" name="tipoComanda" />
                  <span className="ml-2 text-zinc-700">Domicilio</span>
                </label>
              </div>
              <div className="mb-4">
                <label htmlFor="mesa" className="block text-sm font-semibold text-zinc-700">
                  Número de Mesa
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="mesa"
                    className="block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-12"
                    placeholder="Ej: 5"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-2">Menú</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {["Pizza Margherita", "Pasta Carbonara", "Ensalada César", "Hamburguesa Clásica"].map(
                    (plato, index) => (
                      <button
                        key={index}
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-zinc-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {plato}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Resumen de la Comanda</h2>
          <div className="bg-[#fff0f5] rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <ul className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              <li className="flex flex-col py-2 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-700 text-sm">Pizza Margherita</span>
                  <div className="flex items-center">
                    <button className="text-blue-600 hover:text-blue-800 mr-1">
                      <MinusCircle className="h-4 w-4" />
                    </button>
                    <span className="mx-1 font-medium text-sm">2</span>
                    <button className="text-blue-600 hover:text-blue-800 mr-1">
                      <PlusCircle className="h-4 w-4" />
                    </button>
                    <span className="mr-1 text-zinc-900 font-medium text-sm">$25.98</span>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            </ul>
            <div className="mt-4 flex flex-col items-center">
              <span className="text-xl font-bold text-zinc-900 mb-2">Total: $25.98</span>
              <button className="w-full inline-flex justify-center items-center px-5 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#8994c3] hover:bg-[#48557f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Crear Comanda
              </button>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Lista de Comandas</h2>
      <div className="bg-[#f0fff0] rounded-xl border border-gray-100 shadow-sm p-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nº Comanda
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mesa/Domicilio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detalles
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staticComandas.map((comanda) => (
              <tr key={comanda.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">#{comanda.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                  {comanda.mesa ? `Mesa: ${comanda.mesa}` : `Domicilio: ${comanda.direccion}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 font-medium">
                  ${comanda.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                  <ul className="list-disc list-inside">
                    {comanda.items.map((item, index) => (
                      <li key={index}>
                        {item.nombre} - Cantidad x{item.cantidad}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comandas;