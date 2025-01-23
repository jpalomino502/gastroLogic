import React from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"

const LoginModal = ({ isOpen, setIsOpen }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica de autenticación
    console.log("Login attempt", { email, password })
    setIsOpen(false)
  }

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
                <Dialog.Title as="h3" className="text-2xl font-medium leading-6 text-[#e8dcec] mb-4">
                  Iniciar sesión
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-[#d7ecd6] shadow-sm focus:border-[#fff0f5] focus:ring focus:ring-[#fff0f5] focus:ring-opacity-50 text-[#e8dcec]"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[#d7ecd6]">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md bg-zinc-800 border-[#d7ecd6] shadow-sm focus:border-[#fff0f5] focus:ring focus:ring-[#fff0f5] focus:ring-opacity-50 text-[#e8dcec]"
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#d7ecd6] px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-[#fff0f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fff0f5] focus-visible:ring-offset-2"
                    >
                      Iniciar sesión
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default LoginModal

