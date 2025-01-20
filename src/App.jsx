import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Resumen from "./pages/Resumen";
import Menu from "./pages/Menu";
import Comandas from "./pages/Comandas";
import Cocina from "./pages/Cocina";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { calcularTiempoEstimado } from "./utils/tiempoEstimado";

function App() {
  const [menu, setMenu] = useLocalStorage("menu", []);
  const [comandas, setComandas] = useLocalStorage("comandas", []);
  const [ganancias, setGanancias] = useState(0);
  const [vista, setVista] = useState("resumen");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tiemposPreparacion, setTiemposPreparacion] = useLocalStorage(
    "tiemposPreparacion",
    []
  );

  useEffect(() => {
    const totalGanancias = comandas.reduce((total, comanda) => {
      if (comanda.estado === "finalizado") {
        return total + comanda.total;
      }
      return total;
    }, 0);
    setGanancias(totalGanancias);
  }, [comandas]);

  const agregarPlato = (plato) => {
    setMenu([...menu, { ...plato, id: Date.now() }]);
  };

  const agregarComanda = (comanda) => {
    const numeroComanda = comandas.length + 1;
    const tiempoEstimado = calcularTiempoEstimado(tiemposPreparacion);
    setComandas([
      ...comandas,
      {
        ...comanda,
        id: Date.now(),
        numeroComanda,
        estado: "pendiente",
        tiempoEstimado,
        tiempoInicio: null,
        tiempoFin: null,
      },
    ]);
  };

  const actualizarEstadoComanda = (id, nuevoEstado) => {
    const ahora = Date.now();
    setComandas(
      comandas.map((comanda) => {
        if (comanda.id === id) {
          if (nuevoEstado === "en_preparacion" && !comanda.tiempoInicio) {
            return { ...comanda, estado: nuevoEstado, tiempoInicio: ahora };
          }
          if (nuevoEstado === "finalizado" && comanda.tiempoInicio) {
            const tiempoPreparacion = ahora - comanda.tiempoInicio;
            setTiemposPreparacion((prev) =>
              [...prev, tiempoPreparacion].slice(-5)
            );
            return { ...comanda, estado: nuevoEstado, tiempoFin: ahora };
          }
          return { ...comanda, estado: nuevoEstado };
        }
        return comanda;
      })
    );
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const editarPlato = (id, platoActualizado) => {
    setMenu(
      menu.map((plato) =>
        plato.id === id ? { ...plato, ...platoActualizado } : plato
      )
    );
  };

  const eliminarPlato = (id) => {
    setMenu(menu.filter((plato) => plato.id !== id));
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3,
  };

  return (
    <div className="flex h-screen bg-zinc-900 text-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        setVista={setVista}
        vista={vista}
        toggleSidebar={toggleSidebar}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="no-scrollbar overflow-auto flex-1 overflow-x-hidden overflow-y-auto bg-white p-4 lg:rounded-2xl lg:my-3 lg:mr-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={vista}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="container mx-auto"
            >
              {vista === "resumen" && (
                <Resumen comandas={comandas} ganancias={ganancias} />
              )}
              {vista === "menu" && (
                <Menu
                  menu={menu}
                  agregarPlato={agregarPlato}
                  editarPlato={editarPlato}
                  eliminarPlato={eliminarPlato}
                />
              )}
              {vista === "comandas" && (
                <Comandas
                  menu={menu}
                  agregarComanda={agregarComanda}
                  comandas={comandas}
                />
              )}
              {vista === "cocina" && (
                <Cocina
                  comandas={comandas}
                  actualizarEstadoComanda={actualizarEstadoComanda}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
