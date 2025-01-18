import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
  Tag,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { formatPrice } from "../utils/formatPrice";

const CategoryManager = ({ categories, addCategory, removeCategory }) => {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-zinc-900 mb-2">
        Gestionar Categorías
      </h3>
      <div className="flex space-x-2 mb-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nueva categoría"
        />
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Agregar
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <span
            key={index}
            className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
          >
            {category}
            <button
              onClick={() => removeCategory(category)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <Trash2 size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

function Menu({ menu, agregarPlato, editarPlato, eliminarPlato }) {
  const [nuevoPlato, setNuevoPlato] = useState({
    nombre: "",
    precio: "",
    categoria: "",
  });
  const [platoEditando, setPlatoEditando] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categories, setCategories] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuevoPlato.nombre && nuevoPlato.precio) {
      if (platoEditando) {
        editarPlato(platoEditando.id, {
          ...nuevoPlato,
          precio: parseFloat(nuevoPlato.precio),
        });
        toast.success("Plato editado correctamente");
        setPlatoEditando(null);
      } else {
        agregarPlato({ ...nuevoPlato, precio: parseFloat(nuevoPlato.precio) });
        toast.success("Plato agregado correctamente");
      }
      setNuevoPlato({ nombre: "", precio: "", categoria: "" });
    }
  };

  const handleEditar = (plato) => {
    setPlatoEditando(plato);
    setNuevoPlato({
      nombre: plato.nombre,
      precio: plato.precio.toString(),
      categoria: plato.categoria || "",
    });
  };

  const handleEliminar = (id) => {
    eliminarPlato(id);
    toast.success("Plato eliminado correctamente");
  };

  const addCategory = (category) => {
    setCategories([...categories, category]);
  };

  const removeCategory = (category) => {
    setCategories(categories.filter((c) => c !== category));
  };

  const filteredMenu = menu
    .filter((plato) =>
      plato.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((plato) => !filterCategory || plato.categoria === filterCategory)
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.precio - b.precio;
      } else {
        return b.precio - a.precio;
      }
    });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-4 sm:mb-6 md:mb-8">
        Gestión del Menú 🍕
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="col-span-1 lg:col-span-2 lg:row-span-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-zinc-900 mb-4">
            Menú Actual
          </h2>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-[#e4f4ff] rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 overflow-y-auto"
          >
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="search"
                className="block text-sm font-semibold text-zinc-700"
              >
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4 mb-4 sm:mb-6">
              <div>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-zinc-700 hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowUpDown className="mr-2 h-5 w-5" />
                  Ordenar por Precio (
                  {sortOrder === "asc" ? "Ascendente" : "Descendente"})
                </button>
              </div>
            </div>
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="filter"
                className="block text-sm font-semibold text-zinc-700"
              >
                Filtrar por Categoría
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Filter className="h-6 w-6 text-gray-400" />
                </div>
                <select
                  id="filter"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 text-sm border-gray-300 rounded-md h-12"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {filteredMenu.map((plato, index) => (
                <motion.div
                  key={plato.id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-[#daeaf5] rounded-lg p-4 sm:p-6 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900">
                      {plato.nombre}
                    </h3>
                    <p className="text-sm text-zinc-600 mt-2">
                      {plato.descripcion}
                    </p>
                    <div className="flex items-center mt-3">
                      <Tag className="h-5 w-5 text-zinc-500 mr-2" />
                      <span className="text-sm text-zinc-500">
                        {plato.categoria}
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 flex justify-between items-center">
                    <p className="text-xl font-bold text-zinc-900">
                      {formatPrice(plato.precio)}
                    </p>
                    <div className="flex items-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditar(plato)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <Pencil className="h-6 w-6" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEliminar(plato.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-6 w-6" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="col-span-1 lg:col-span-4">
          <h2 className="text-3xl font-semibold text-zinc-900 mb-6">
            {platoEditando ? "Editar Plato" : "Agregar Nuevo Plato"}
          </h2>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
            className="bg-[#e8dcec] rounded-3xl border border-gray-100 shadow-sm p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-semibold text-zinc-700"
                >
                  Nombre del plato
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={nuevoPlato.nombre}
                  onChange={(e) =>
                    setNuevoPlato({ ...nuevoPlato, nombre: e.target.value })
                  }
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm h-12 pl-4"
                  placeholder="Ej: Pasta Carbonara"
                />
              </div>
              <div>
                <label
                  htmlFor="precio"
                  className="block text-sm font-semibold text-zinc-700"
                >
                  Precio
                </label>
                <input
                  type="text"
                  id="precio"
                  value={nuevoPlato.precio}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\./g, "")
                      .replace(",", ".");
                    setNuevoPlato({ ...nuevoPlato, precio: value });
                  }}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm h-12 pl-4"
                  placeholder="Ej: 12,99"
                />
              </div>
              <div>
                <label
                  htmlFor="categoria"
                  className="block text-sm font-semibold text-zinc-700"
                >
                  Categoría
                </label>
                <select
                  id="categoria"
                  value={nuevoPlato.categoria}
                  onChange={(e) =>
                    setNuevoPlato({ ...nuevoPlato, categoria: e.target.value })
                  }
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm h-12 pl-4"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="inline-flex items-center px-5 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#8994c3] hover:bg-[#48557f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {platoEditando ? (
                    <>
                      <Pencil className="mr-2 h-5 w-5" /> Guardar Cambios
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-5 w-5" /> Agregar Plato
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
                      setNuevoPlato({ nombre: "", precio: "", categoria: "" });
                    }}
                    className="inline-flex items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-zinc-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        </div>

        {/* Herramientas del Menú */}
        <div className="col-span-1 lg:col-span-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-zinc-900 mb-4">
            Herramientas del Menú
          </h2>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <CategoryManager
              categories={categories}
              addCategory={addCategory}
              removeCategory={removeCategory}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
