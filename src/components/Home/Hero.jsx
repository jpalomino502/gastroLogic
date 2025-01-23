import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <div className="min-h-screen bg-zinc-900 pt-20">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between py-20">
        <div className="lg:w-1/2 text-[#e8dcec]">
          <h1 className="text-5xl font-bold mb-6">Gestión inteligente para tu restaurante</h1>
          <p className="text-xl mb-8 text-[#d7ecd6]">
            Optimiza tus operaciones, aumenta tus ganancias y mejora la experiencia de tus clientes con GastroLogic
          </p>
          <Link
            to="/dashboard"
            className="bg-[#d7ecd6] text-zinc-900 px-8 py-3 rounded-lg text-lg hover:bg-[#fff0f5] transition-colors inline-block"
          >
            Comenzar ahora
          </Link>
        </div>
        <div className="lg:w-1/2 mt-12 lg:mt-0">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-[#d7ecd6] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-[#e8dcec] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-10 left-10 w-72 h-72 bg-[#fff0f5] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=400&width=400"
                alt="Restaurant Management"
                className="rounded-lg shadow-2xl relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero

