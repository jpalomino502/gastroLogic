import React from "react";
import { PlusCircle, Pencil, Trash2, Search, Filter } from "lucide-react";

const Menu = () => {
  const staticMenu = [
    { id: 1, nombre: "Pizza Margherita", precio: 12.99, categoria: "Pizzas" },
    { id: 2, nombre: "Pasta Carbonara", precio: 14.5, categoria: "Pastas" },
    { id: 3, nombre: "Ensalada César", precio: 8.75, categoria: "Ensaladas" },
    { id: 4, nombre: "Hamburguesa Clásica", precio: 11.25, categoria: "Hamburguesas" },
    { id: 5, nombre: "Sushi Variado", precio: 18.99, categoria: "Sushi" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6 md:mb-8">Gestión del Menú 🍕</h1>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-zinc-900 mb-4">Menú Actual</h2>
          <div className="bg-[#e4f4ff] rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 overflow-y-auto">
            <div className="mb-4 sm:mb-6">
              <label htmlFor="search" className="block text-sm font-semibold text-zinc-700">
                Buscar Plato
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 pr-20 text-sm border-gray-300 rounded-md h-12"
                  placeholder="Buscar por nombre"
                />
              </div>
            </div>
            <div className="mb-4 sm:mb-6">
              <label htmlFor="filter" className="block text-sm font-semibold text-zinc-700">
                Filtrar por Categoría
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Filter className="h-6 w-6 text-gray-400" />
                </div>
                <select
                  id="filter"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 text-sm border-gray-300 rounded-md h-12"
                >
                  <option value="">Todas las categorías</option>
                  <option value="Pizzas">Pizzas</option>
                  <option value="Pastas">Pastas</option>
                  <option value="Ensaladas">Ensaladas</option>
                  <option value="Hamburguesas">Hamburguesas</option>
                  <option value="Sushi">Sushi</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {staticMenu.map((plato) => (
                <div
                  key={plato.id}
                  className="bg-[#daeaf5] rounded-lg p-4 sm:p-6 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900">{plato.nombre}</h3>
                    <div className="flex items-center mt-3">
                      <span className="text-sm text-zinc-500">{plato.categoria}</span>
                    </div>
                  </div>
                  <div className="mt-5 flex justify-between items-center">
                    <p className="text-xl font-bold text-zinc-900">${plato.precio.toFixed(2)}</p>
                    <div className="flex items-center">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        <Pencil className="h-6 w-6" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-zinc-900 mb-4">Agregar Nuevo Plato</h2>
          <div className="bg-[#e8dcec] rounded-3xl border border-gray-100 shadow-sm p-8">
            <form className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-semibold text-zinc-700">
                  Nombre del plato
                </label>
                <input
                  type="text"
                  id="nombre"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm h-12 pl-4"
                  placeholder="Ej: Pasta Carbonara"
                />
              </div>
              <div>
                <label htmlFor="precio" className="block text-sm font-semibold text-zinc-700">
                  Precio
                </label>
                <input
                  type="text"
                  id="precio"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm h-12 pl-4"
                  placeholder="Ej: 12.99"
                />
              </div>
              <div>
                <label htmlFor="categoria" className="block text-sm font-semibold text-zinc-700">
                  Categoría
                </label>
                <select
                  id="categoria"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm h-12 pl-4"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Pizzas">Pizzas</option>
                  <option value="Pastas">Pastas</option>
                  <option value="Ensaladas">Ensaladas</option>
                  <option value="Hamburguesas">Hamburguesas</option>
                  <option value="Sushi">Sushi</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#8994c3] hover:bg-[#48557f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Agregar Plato
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;