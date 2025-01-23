import { Link } from "react-router-dom";
import imageHero from "../../assets/Hero.png";

const Hero = () => {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center py-16 px-6 sm:px-12 lg:px-24 mt-16 lg:mt-0">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24">
          <div className="lg:w-1/2 text-[#e8dcec] space-y-10 text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
              Gestión inteligente para tu restaurante
            </h1>
            <p className="text-xl sm:text-2xl text-[#d7ecd6] max-w-2xl mx-auto lg:mx-0">
              Optimiza tus operaciones, aumenta tus ganancias y mejora la experiencia de tus clientes con GastroLogic.
            </p>
            <Link
              to="/"
              className="bg-[#d7ecd6] text-zinc-900 px-10 py-4 rounded-lg text-xl font-medium hover:bg-[#fff0f5] transition-colors inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Comenzar ahora
            </Link>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-96 h-96 bg-[#d7ecd6] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-[#e8dcec] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-10 left-10 w-96 h-96 bg-[#fff0f5] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
              <div className="relative">
                <img
                  src={imageHero || "/placeholder.svg"}
                  alt="Restaurant Management"
                  className="relative z-10 w-full h-auto max-w-2xl mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;