import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ClipboardList, Utensils, ChefHat, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../services/authService";

function Sidebar({ isOpen, setVista, vista, toggleSidebar, setIsSidebarOpen }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); 
      navigate("/"); 
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const NavItem = ({ icon: Icon, label, view }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        setVista(view);
        if (isMobile) toggleSidebar();
      }}
      className={`flex items-center w-full p-3 transition-all duration-300 relative ${
        vista === view ? "text-white" : "text-zinc-400 hover:text-white"
      } ${isOpen || isHovered ? "justify-start" : "justify-center"}`}
    >
      <div className="flex items-center">
        <Icon className="h-5 w-5 min-w-[20px]" />
        <span
          className={`ml-3 text-sm font-medium truncate transition-all duration-300 ${
            isOpen || isHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
          }`}
        >
          {label}
        </span>
      </div>
      {vista === view && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white "></div>
      )}
    </motion.button>
  );

  const sidebarContent = (
    <div
      className={`h-full flex flex-col bg-zinc-900 transition-all duration-300 ${
        isOpen || isHovered ? "w-64" : "w-20"
      }`}
      onMouseEnter={() => {
        if (!isMobile) {
          setIsHovered(true);
          setIsSidebarOpen(true);
        }
      }}
      onMouseLeave={() => {
        if (!isMobile) {
          setIsHovered(false);
          setIsSidebarOpen(false);
        }
      }}
    >
      <div className="flex items-center h-20 px-4 border-b border-zinc-800">
        <div className="flex items-center justify-center w-full">
          <Utensils className="h-8 w-8 text-white" />
          <span
            className={`ml-3 text-xl font-bold text-white transition-all duration-300 ${
              isOpen || isHovered ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            GastroLogic
          </span>
        </div>
        {(isOpen || isHovered) && isMobile && (
          <button
            onClick={toggleSidebar}
            className="text-zinc-400 hover:text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-grow py-6">
        <div className="space-y-4">
          <NavItem icon={Home} label="Resumen" view="resumen" />
          <NavItem icon={ClipboardList} label="Menú" view="menu" />
          <NavItem icon={Utensils} label="Comandas" view="comandas" />
          <NavItem icon={ChefHat} label="Cocina" view="cocina" />
        </div>
      </nav>

      {/* Botón de Cerrar sesión */}
      <div className="p-4 border-t border-zinc-800">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 text-zinc-400 hover:text-white ${
            isOpen || isHovered ? "justify-start" : "justify-center"
          }`}
        >
          <LogOut className="h-5 w-5 min-w-[20px]" />
          <span
            className={`ml-3 text-sm font-medium truncate transition-all duration-300 ${
              isOpen || isHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          >
            Cerrar sesión
          </span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${isOpen ? "w-64" : "w-20"}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

export default Sidebar;