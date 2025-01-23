import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="fixed w-full top-0 bg-zinc-900 text-[#e8dcec] py-4 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            GastroLogic
          </Link>
          <Link
            to="/dashboard"
            className="bg-[#d7ecd6] text-zinc-900 px-6 py-2 rounded-lg hover:bg-[#fff0f5] transition-colors"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header

