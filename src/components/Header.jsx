import React from "react";
import { MenuIcon } from "./Icons";

function Header({ toggleSidebar }) {
  return (
    <header className="bg-black shadow-md lg:hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 "
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="text-xl mt-1 font-semibold text-white">
              Sirus BETA
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
