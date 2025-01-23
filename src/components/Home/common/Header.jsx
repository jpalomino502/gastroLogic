import { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 bg-zinc-900 text-[#e8dcec] py-6 z-50">
      <div className="container mx-auto px-6 sm:px-12 lg:px-24">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-3xl font-bold">
            GastroLogic
          </Link>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-[#d7ecd6] text-zinc-900 px-6 py-2 rounded-lg hover:bg-[#fff0f5] transition-colors text-lg"
          >
            Login
          </button>
        </nav>
      </div>
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
    </header>
  );
};

export default Header;