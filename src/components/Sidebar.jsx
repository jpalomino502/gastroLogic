import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  ClipboardListIcon,
  UtensilsIcon,
  ChefHatIcon,
} from "./Icons";

function Sidebar({ isOpen, setVista, vista, toggleSidebar }) {
  const NavItem = ({ icon: Icon, label, view }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        setVista(view);
        if (window.innerWidth < 1024) toggleSidebar();
      }}
      className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors ${
        vista === view
          ? "bg-[#3d3d3d] text-white"
          : "text-gray-400 hover:bg-[#3d3d3d] hover:text-white"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </motion.button>
  );

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between h-16 px-4">
        <span className="text-2xl font-semibold text-white">Sirius Beta</span>
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white focus:outline-none lg:hidden"
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
      </div>
      <nav className="mt-8 flex-grow">
        <div className="px-4 space-y-2">
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
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-black">
        {sidebarContent}
      </aside>

      <main className="lg:pl-64"></main>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-black"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
