import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  ClipboardListIcon,
  UtensilsIcon,
  ChefHatIcon,
} from "./Icons";

function Sidebar({ isOpen, setVista, vista, toggleSidebar, setIsSidebarOpen }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const NavItem = ({ icon: Icon, label, view }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        setVista(view);
        if (isMobile) toggleSidebar();
      }}
      className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 relative ${
        vista === view
          ? "text-white"
          : "text-zinc-400 hover:text-white"
      } ${isOpen || isHovered ? "justify-start" : "justify-center"}`}
    >
      <Icon className="h-5 w-5 min-w-[20px]" />
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out`}
        style={{
          width: isOpen || isHovered ? "auto" : "0px",
          whiteSpace: "nowrap",
        }}
      >
        <span className="ml-3 text-sm font-medium truncate">{label}</span>
      </div>
      {vista === view && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
      )}
    </motion.button>
  );
  

  const sidebarContent = (
    <div 
      className={`h-full flex flex-col bg-zinc-900 rounded-r-2xl transition-all duration-300 ${isOpen || isHovered ? 'w-64' : 'w-20'}`}
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
    <UtensilsIcon className="h-8 w-8 text-white" />
    {(isOpen || isHovered) && (
      <span className="ml-3 text-xl font-bold text-white">GastroLogic</span>
    )}
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

      <nav className="flex-grow px-3 py-6">
        <div className="space-y-4">
          <NavItem icon={HomeIcon} label="Resumen" view="resumen" />
          <NavItem icon={ClipboardListIcon} label="Menú" view="menu" />
          <NavItem icon={UtensilsIcon} label="Comandas" view="comandas" />
          <NavItem icon={ChefHatIcon} label="Cocina" view="cocina" />
        </div>
      </nav>
    </div>
  );

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isOpen ? 'w-64' : 'w-20'}`}>
        {sidebarContent}
      </aside>
    </>
  );
}

export default Sidebar;

