import React, { useState } from "react";
import Sidebar from "../components/Dashboard/common/Sidebar";
import Header from "../components/Dashboard/common/Header";
import Resumen from "../components/Dashboard/Resumen/Resumen";
import Menu from "../components/Dashboard/Menu/Menu";
import Comandas from "../components/Dashboard/Comandas/Comandas";
import Cocina from "../components/Dashboard/Cocina/Cocina";

function Dashboard() {
  const [vista, setVista] = useState("resumen");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="no-scrollbar overflow-auto flex-1 overflow-x-hidden overflow-y-auto bg-white lg:rounded-2xl lg:my-3 lg:mr-2">
          <div className="container mx-auto p-4">
            {vista === "resumen" && <Resumen />}
            {vista === "menu" && <Menu />}
            {vista === "comandas" && <Comandas />}
            {vista === "cocina" && <Cocina />}
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;