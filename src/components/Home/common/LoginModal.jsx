import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { login, register } from "../../../services/authService"; // Importa las funciones de autenticación
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, setIsOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      const user = await login(email, password);
      console.log("Usuario logueado:", user);

      localStorage.setItem("uid", user.uid);

      setIsOpen(false);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !restaurantName || !email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      const user = await register(name, restaurantName, email, password); 
      console.log("Usuario registrado:", user);

      localStorage.setItem("uid", user.uid);

      setIsOpen(false);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Error al registrar el usuario.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setRestaurantName("");
    setError("");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-white focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>

                <Dialog.Title as="h3" className="text-2xl font-medium leading-6 text-[#e8dcec] mb-4">
                  {isRegisterView ? "Registrarse" : "Iniciar sesión"}
                </Dialog.Title>

                <form onSubmit={isRegisterView ? handleRegisterSubmit : handleLoginSubmit} className="space-y-4">
                  {isRegisterView && (
                    <>
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#d7ecd6]">
                          Nombre
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="mt-1 block w-full px-4 py-2 rounded-md bg-zinc-800 border-[#d7ecd6] shadow-sm focus:border-[#fff0f5] focus:ring focus:ring-[#fff0f5] focus:ring-opacity-50 text-[#e8dcec]"
                        />
                      </div>
                      <div>
                        <label htmlFor="restaurantName" className="block text-sm font-medium text-[#d7ecd6]">
                          Nombre del restaurante
                        </label>
                        <input
                          type="text"
                          id="restaurantName"
                          name="restaurantName"
                          value={restaurantName}
                          onChange={(e) => setRestaurantName(e.target.value)}
                          required
                          className="mt-1 block w-full px-4 py-2 rounded-md bg-zinc-800 border-[#d7ecd6] shadow-sm focus:border-[#fff0f5] focus:ring focus:ring-[#fff0f5] focus:ring-opacity-50 text-[#e8dcec]"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#d7ecd6]">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 block w-full px-4 py-2 rounded-md bg-zinc-800 border-[#d7ecd6] shadow-sm focus:border-[#fff0f5] focus:ring focus:ring-[#fff0f5] focus:ring-opacity-50 text-[#e8dcec]"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-[#d7ecd6]">
                      Contraseña
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-1 block w-full px-4 py-2 rounded-md bg-zinc-800 border-[#d7ecd6] shadow-sm focus:border-[#fff0f5] focus:ring focus:ring-[#fff0f5] focus:ring-opacity-50 text-[#e8dcec]"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-7"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-[#d7ecd6]" />
                      ) : (
                        <Eye className="h-5 w-5 text-[#d7ecd6]" />
                      )}
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <div className="mt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => alert("Funcionalidad de olvidé mi contraseña")}
                      className="text-sm text-[#d7ecd6] hover:text-[#fff0f5]"
                    >
                      Olvidé mi contraseña
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterView(!isRegisterView);
                        resetForm();
                      }}
                      className="text-sm text-[#d7ecd6] hover:text-[#fff0f5]"
                    >
                      {isRegisterView ? "Iniciar sesión" : "Registrarse"}
                    </button>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center w-full rounded-md border border-transparent bg-[#d7ecd6] px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-[#fff0f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fff0f5] focus-visible:ring-offset-2"
                    >
                      {isRegisterView ? "Registrarse" : "Iniciar sesión"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LoginModal;