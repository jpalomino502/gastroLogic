import React, { useState, useEffect } from "react";
import Sidebar from "../components/Dashboard/common/Sidebar";
import Header from "../components/Dashboard/common/Header";
import Resumen from "../components/Dashboard/Resumen/Resumen";
import Menu from "../components/Dashboard/Menu/Menu";
import Comandas from "../components/Dashboard/Comandas/Comandas";
import Cocina from "../components/Dashboard/Cocina/Cocina";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [vista, setVista] = useState("resumen");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState(null); // Estado para almacenar el userId
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Verificar si el usuario está autenticado al cargar el componente
  useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    if (storedUid) {
      setUserId(storedUid); // Establece el userId
    } else {
      // Si no hay uid, redirige al usuario a la página de inicio
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        setVista={setVista}
        vista={vista}
        toggleSidebar={toggleSidebar}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 no-scrollbar overflow-auto bg-white lg:rounded-2xl lg:my-3 lg:mr-2">
          <div className="h-full w-full container mx-auto no-scrollbar overflow-y-auto">
            {vista === "resumen" && <Resumen />}
            {vista === "menu" && <Menu userId={userId} />} {/* Pasa el userId al componente Menu */}
            {vista === "comandas" && <Comandas />}
            {vista === "cocina" && <Cocina />}
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;