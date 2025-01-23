import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Menu = ({ userId }) => {
  const [sortByPrice, setSortByPrice] = useState(false);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newDish, setNewDish] = useState({
    nombre: "",
    precio: "",
    categoria: "",
  });
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      console.error("userId no está definido");
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const menuResponse = await fetch(
          `http://localhost:5000/api/${userId}/menu`
        );
        if (!menuResponse.ok) {
          throw new Error("Error al obtener el menú");
        }
        const menuData = await menuResponse.json();
        setMenu(menuData.menu);

        const categoriesResponse = await fetch(
          `http://localhost:5000/api/${userId}/categories`
        );
        if (!categoriesResponse.ok) {
          throw new Error("Error al obtener las categorías");
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setError("Error al cargar los datos. Inténtalo de nuevo más tarde.");
      }
    };

    fetchData();
  }, [userId, navigate]);

  const handleAddDish = async (e) => {
    e.preventDefault();
    try {
      const precioNumber = parseFloat(newDish.precio);
      if (isNaN(precioNumber)) {
        throw new Error("El precio debe ser un número válido.");
      }

      const response = await fetch(`http://localhost:5000/api/${userId}/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newDish,
          precio: precioNumber,
        }),
      });
      const data = await response.json();
      setMenu([...menu, { id: data.dishId, ...newDish, precio: precioNumber }]);
      setNewDish({ nombre: "", precio: "", categoria: "" });
    } catch (error) {
      console.error("Error al agregar el plato:", error);
      setError(error.message || "Error al agregar el plato.");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/${userId}/categories`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: newCategory }),
        }
      );
      const data = await response.json();
      setCategories([...categories, newCategory]);
      setNewCategory("");
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      await fetch(
        `http://localhost:5000/api/${userId}/categories/${category}`,
        {
          method: "DELETE",
        }
      );
      setCategories(categories.filter((cat) => cat !== category));
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  const filteredMenu = menu.filter((plato) => {
    const matchesSearch = plato.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? plato.categoria === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const sortedMenu = sortByPrice
    ? [...filteredMenu].sort((a, b) => a.precio - b.precio)
    : filteredMenu;

  return (
    <div className="min-h-screen h-screen p-4 md:p-8 bg-gray-50 flex flex-col">
      <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6 md:mb-8">
        Gestión del Menú 🍕
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        <div className="lg:w-2/3 h-full flex flex-col">
          <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900 mb-3">
            Menú Actual
          </h2>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden h-full flex flex-col">
            <div className="p-6 bg-[#e8dcec]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-grow">
                  <div className="relative bg-white rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md h-10"
                      placeholder="Buscar plato"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="relative rounded-md bg-white">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Filter className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md h-10"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
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
                <button
                  onClick={() => setSortByPrice(!sortByPrice)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ArrowUpDown className="mr-2 h-5 w-5" />
                  Ordenar por Precio
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {sortedMenu.map((plato) => (
                  <div
                    key={plato.id}
                    className="bg-[#E8DCEC] rounded-lg p-4 sm:p-6 shadow-md flex flex-col justify-between border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900">
                        {plato.nombre}
                      </h3>
                      <div className="flex items-center mt-3">
                        <span className="text-sm text-zinc-500 bg-gray-100 px-2 py-1 rounded-full">
                          {plato.categoria}
                        </span>
                      </div>
                    </div>
                    <div className="mt-5 flex justify-between items-center">
                      <p className="text-xl font-bold text-zinc-900">
                        ${plato.precio.toFixed(2)}
                      </p>
                      <div className="flex items-center">
                        <button className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200">
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDish(plato.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 h-full flex flex-col space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900 mb-3">
            Agregar Nuevo Plato
          </h2>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 flex-1">
            <form onSubmit={handleAddDish} className="space-y-4">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre del plato
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={newDish.nombre}
                  onChange={(e) =>
                    setNewDish({ ...newDish, nombre: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm h-10 pl-3"
                  placeholder="Ej: Pasta Carbonara"
                />
              </div>
              <div>
                <label
                  htmlFor="precio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Precio
                </label>
                <input
                  type="number"
                  id="precio"
                  value={newDish.precio}
                  onChange={(e) =>
                    setNewDish({ ...newDish, precio: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm h-10 pl-3"
                  placeholder="Ej: 12.99"
                />
              </div>
              <div>
                <label
                  htmlFor="categoria"
                  className="block text-sm font-medium text-gray-700"
                >
                  Categoría
                </label>
                <select
                  id="categoria"
                  value={newDish.categoria}
                  onChange={(e) =>
                    setNewDish({ ...newDish, categoria: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm h-10 pl-3"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-[#E4F4FF] hover:bg-[#daeaf5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Agregar Plato
                </button>
              </div>
            </form>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900 mb-3">
            Gestionar Categorías
          </h2>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 flex-1">
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label
                  htmlFor="nuevaCategoria"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nueva Categoría
                </label>
                <input
                  type="text"
                  id="nuevaCategoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm h-10 pl-3"
                  placeholder="Ej: Postres"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-[#d7ecd6] hover:bg-[#cde2cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Agregar Categoría
                </button>
              </div>
            </form>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Categorías Existentes
              </h3>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-md"
                  >
                    <span>{category}</span>
                    <div className="flex items-center">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
