import React, { useState } from "react"
import { motion } from "framer-motion"
import { PlusCircle, MinusCircle, Trash2, ShoppingBag, MapPin, Search, Filter, X } from "lucide-react"
import { toast } from "react-hot-toast"

function Comandas({ menu, agregarComanda, comandas, actualizarEstadoComanda }) {
  const [comanda, setComanda] = useState({
    mesa: "",
    items: [],
    total: 0,
    esDomicilio: false,
    direccion: "",
  })
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }
  const [tabActiva, setTabActiva] = useState("nueva")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [observacionTemp, setObservacionTemp] = useState("")
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null)
  const [comandaSeleccionada, setComandaSeleccionada] = useState(null)
  const [metodoPago, setMetodoPago] = useState("")
  const [montoPagado, setMontoPagado] = useState("")
  const [divisionCuenta, setDivisionCuenta] = useState([])
  const [numeroPersonas, setNumeroPersonas] = useState(1)

  const agregarItem = (plato) => {
    const itemExistente = comanda.items.find((item) => item.nombre === plato.nombre)
    if (itemExistente) {
      setComanda((prevComanda) => ({
        ...prevComanda,
        items: prevComanda.items.map((item) =>
          item.nombre === plato.nombre ? { ...item, cantidad: item.cantidad + 1 } : item,
        ),
        total: prevComanda.total + plato.precio,
      }))
    } else {
      setComanda((prevComanda) => ({
        ...prevComanda,
        items: [...prevComanda.items, { ...plato, cantidad: 1, observacion: "" }],
        total: prevComanda.total + plato.precio,
      }))
    }
  }

  const confirmarAgregarItem = () => {
    if (!platoSeleccionado) return

    const itemExistente = comanda.items.find((item) => item.nombre === platoSeleccionado.nombre)
    if (itemExistente) {
      setComanda((prevComanda) => ({
        ...prevComanda,
        items: prevComanda.items.map((item) =>
          item.nombre === platoSeleccionado.nombre
            ? { ...item, cantidad: item.cantidad + 1, observacion: observacionTemp || item.observacion }
            : item,
        ),
        total: prevComanda.total + platoSeleccionado.precio,
      }))
    } else {
      setComanda((prevComanda) => ({
        ...prevComanda,
        items: [...prevComanda.items, { ...platoSeleccionado, cantidad: 1, observacion: observacionTemp }],
        total: prevComanda.total + platoSeleccionado.precio,
      }))
    }
    setPlatoSeleccionado(null)
    setObservacionTemp("")
  }

  const eliminarItem = (index) => {
    const itemEliminado = comanda.items[index]
    setComanda((prevComanda) => ({
      ...prevComanda,
      items: prevComanda.items.filter((_, i) => i !== index),
      total: prevComanda.total - itemEliminado.precio * itemEliminado.cantidad,
    }))
  }

  const actualizarCantidad = (index, incremento) => {
    const item = comanda.items[index]
    if (item.cantidad + incremento > 0) {
      setComanda((prevComanda) => ({
        ...prevComanda,
        items: prevComanda.items.map((item, i) =>
          i === index ? { ...item, cantidad: item.cantidad + incremento } : item,
        ),
        total: prevComanda.total + item.precio * incremento,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if ((comanda.mesa || (comanda.esDomicilio && comanda.direccion)) && comanda.items.length > 0) {
      const nuevaComanda = {
        ...comanda,
        numeroComanda: Date.now(),
        estado: "pendiente",
      }
      agregarComanda(nuevaComanda)
      imprimirRecibo(nuevaComanda)
      setComanda({ mesa: "", items: [], total: 0, esDomicilio: false, direccion: "" })
      toast.success("Comanda creada e impresa correctamente")
    }
  }

  const imprimirRecibo = (comanda) => {
    const recibo = `
      RECIBO DE COMANDA
      -----------------
      ${comanda.esDomicilio ? `Domicilio: ${comanda.direccion}` : `Mesa: ${comanda.mesa}`}
      
      Detalles de la orden:
      ${comanda.items
        .map(
          (item) => `
      - ${item.nombre} x${item.cantidad} - ${formatPrice(item.precio * item.cantidad)}
        ${item.observacion ? `  Obs: ${item.observacion}` : ""}`,
        )
        .join("\n")}
      
      Total: ${formatPrice(comanda.total)}
    `

    const ventanaImpresion = window.open("", "_blank")
    ventanaImpresion.document.write(`
      <html>
        <head>
          <title>Recibo de Comanda</title>
          <style>
            @page {
              size: 80mm 297mm;
              margin: 0;
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.4;
              width: 72mm;
              padding: 5mm 4mm;
              margin: 0;
            }
            h1 {
              font-size: 14px;
              text-align: center;
              margin-bottom: 10px;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .total {
              font-weight: bold;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <h1>RECIBO DE COMANDA</h1>
          <div class="divider"></div>
          <p>${comanda.esDomicilio ? `Domicilio: ${comanda.direccion}` : `Mesa: ${comanda.mesa}`}</p>
          <div class="divider"></div>
          <h2>Detalles de la orden:</h2>
          ${comanda.items
            .map(
              (item) => `
            <p>
              ${item.nombre} x${item.cantidad} - ${formatPrice(item.precio * item.cantidad)}<br>
              ${item.observacion ? `<small>Obs: ${item.observacion}</small>` : ""}
            </p>
          `,
            )
            .join("")}
          <div class="divider"></div>
          <p class="total">Total: ${formatPrice(comanda.total)}</p>
        </body>
      </html>
    `)
    ventanaImpresion.document.close()
    ventanaImpresion.print()
    ventanaImpresion.close()
  }

  const handlePago = (comanda) => {
    setComandaSeleccionada(comanda)
    setMetodoPago("")
    setMontoPagado("")
    setDivisionCuenta(
      Array(numeroPersonas)
        .fill()
        .map(() => ({ items: [], total: 0 })),
    )
  }

  const confirmarPago = () => {
    if (!comandaSeleccionada) {
      toast.error("No se ha seleccionado ninguna comanda para pagar")
      return
    }

    if (numeroPersonas === 1) {
      if (!metodoPago) {
        toast.error("Por favor, seleccione un método de pago")
        return
      }
      actualizarEstadoComanda(comandaSeleccionada.id, "pagado", {
        metodoPago,
        montoPagado: comandaSeleccionada.total,
      })
    } else {
      const totalPagado = divisionCuenta.reduce((sum, division) => sum + division.total, 0)
      if (Math.abs(totalPagado - comandaSeleccionada.total) > 0.01) {
        toast.error("El monto total pagado no coincide con el total de la comanda")
        return
      }
      actualizarEstadoComanda(comandaSeleccionada.id, "pagado", {
        metodoPago: "dividido",
        montoPagado: totalPagado,
        divisionCuenta,
      })
    }

    toast.success("Pago procesado correctamente")
    setComandaSeleccionada(null)
    setMetodoPago("")
    setNumeroPersonas(1)
    setDivisionCuenta([])
  }

  const actualizarDivisionCuenta = (personaIndex, item) => {
    setDivisionCuenta((prevDivision) => {
      const newDivision = [...prevDivision]
      const personaDivision = newDivision[personaIndex]

      const itemIndex = personaDivision.items.findIndex((i) => i.nombre === item.nombre)
      if (itemIndex > -1) {
        // Si el item ya existe, actualizamos su cantidad
        const existingItem = personaDivision.items[itemIndex]
        if (existingItem.cantidad > 1) {
          existingItem.cantidad -= 1
          personaDivision.total -= item.precio
        } else {
          // Si la cantidad es 1, lo eliminamos
          personaDivision.items.splice(itemIndex, 1)
          personaDivision.total -= item.precio
        }
      } else {
        // Si el item no existe, lo agregamos
        personaDivision.items.push({ ...item, cantidad: 1 })
        personaDivision.total += item.precio
      }

      return newDivision
    })
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6 md:mb-8">Gestión de Comandas 📑</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setTabActiva("nueva")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tabActiva === "nueva" ? "bg-[#e4f4ff] text-zinc-900" : "bg-white text-zinc-600 hover:bg-gray-100"
          }`}
        >
          Nueva Comanda
        </button>
        <button
          onClick={() => setTabActiva("pagos")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tabActiva === "pagos" ? "bg-[#e4f4ff] text-zinc-900" : "bg-white text-zinc-600 hover:bg-gray-100"
          }`}
        >
          Pagos
        </button>
        <button
          onClick={() => setTabActiva("lista")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tabActiva === "lista" ? "bg-[#e4f4ff] text-zinc-900" : "bg-white text-zinc-600 hover:bg-gray-100"
          }`}
        >
          Lista de Comandas
        </button>
      </div>

      {tabActiva === "nueva" ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-4">
              <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Nueva Comanda</h2>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3 }}
                className="bg-[#f0f7ff] rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
                    <label className="inline-flex items-center mb-2 sm:mb-0">
                      <input
                        type="radio"
                        className="form-radio text-blue-600"
                        name="tipoComanda"
                        checked={!comanda.esDomicilio}
                        onChange={() =>
                          setComanda((prev) => ({ ...prev, esDomicilio: false, mesa: "", direccion: "" }))
                        }
                      />
                      <span className="ml-2 text-zinc-700">Mesa</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-blue-600"
                        name="tipoComanda"
                        checked={comanda.esDomicilio}
                        onChange={() => setComanda((prev) => ({ ...prev, esDomicilio: true, mesa: "", direccion: "" }))}
                      />
                      <span className="ml-2 text-zinc-700">Domicilio</span>
                    </label>
                  </div>
                  {comanda.esDomicilio ? (
                    <div className="mb-4">
                      <label htmlFor="direccion" className="block text-sm font-semibold text-zinc-700">
                        Dirección de Entrega
                      </label>
                      <div className="mt-2 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="direccion"
                          value={comanda.direccion}
                          onChange={(e) => setComanda({ ...comanda, direccion: e.target.value })}
                          className="block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-12"
                          placeholder="Ej: Calle 123 #45-67"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <label htmlFor="mesa" className="block text-sm font-semibold text-zinc-700">
                        Número de Mesa
                      </label>
                      <div className="mt-2 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <ShoppingBag className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="mesa"
                          value={comanda.mesa}
                          onChange={(e) => setComanda({ ...comanda, mesa: e.target.value })}
                          className="block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-12"
                          placeholder="Ej: 5"
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="search" className="block text-sm font-semibold text-zinc-700">
                        Buscar Plato
                      </label>
                      <div className="mt-2 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="search"
                          className="block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-12"
                          placeholder="Nombre del plato"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-semibold text-zinc-700">
                        Categoría
                      </label>
                      <div className="mt-2 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Filter className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="category"
                          className="block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-12"
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                        >
                          <option value="">Todas las categorías</option>
                          {Array.from(new Set(menu.map((plato) => plato.categoria))).map((categoria) => (
                            <option key={categoria} value={categoria}>
                              {categoria}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">Menú</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {menu
                        .filter((plato) => plato.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
                        .filter((plato) => !filterCategory || plato.categoria === filterCategory)
                        .map((plato, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => agregarItem(plato)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-zinc-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {plato.nombre}
                          </motion.button>
                        ))}
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>

            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Resumen de la Comanda</h2>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-[#fff0f5] rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8"
              >
                {platoSeleccionado && (
                  <div className="mb-4 p-4 bg-white rounded-lg shadow">
                    <h4 className="text-lg font-semibold mb-2">{platoSeleccionado.nombre}</h4>
                    <textarea
                      className="w-full p-2 border rounded"
                      placeholder="Observaciones (opcional)"
                      value={observacionTemp}
                      onChange={(e) => setObservacionTemp(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end">
                      <button onClick={() => setPlatoSeleccionado(null)} className="mr-2 px-3 py-1 bg-gray-200 rounded">
                        Cancelar
                      </button>
                      <button onClick={confirmarAgregarItem} className="px-3 py-1 bg-blue-500 text-white rounded">
                        Agregar
                      </button>
                    </div>
                  </div>
                )}
                <ul className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {comanda.items.map((item, index) => (
                    <li key={index} className="flex flex-col py-2 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-700 text-sm">{item.nombre}</span>
                        <div className="flex items-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => actualizarCantidad(index, -1)}
                            className="text-blue-600 hover:text-blue-800 mr-1"
                          >
                            <MinusCircle className="h-4 w-4" />
                          </motion.button>
                          <span className="mx-1 font-medium text-sm">{item.cantidad}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => actualizarCantidad(index, 1)}
                            className="text-blue-600 hover:text-blue-800 mr-1"
                          >
                            <PlusCircle className="h-4 w-4" />
                          </motion.button>
                          <span className="mr-1 text-zinc-900 font-medium text-sm">
                            {formatPrice(item.precio * item.cantidad)}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => eliminarItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                      <textarea
                        className="mt-1 w-full p-2 text-xs border rounded"
                        placeholder="Observaciones (opcional)"
                        value={item.observacion}
                        onChange={(e) => {
                          const newItems = [...comanda.items]
                          newItems[index].observacion = e.target.value
                          setComanda({ ...comanda, items: newItems })
                        }}
                      />
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-col items-center">
                  <span className="text-xl font-bold text-zinc-900 mb-2">Total: {formatPrice(comanda.total)}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={comanda.items.length === 0 || (!comanda.mesa && !comanda.direccion)}
                    className="w-full inline-flex justify-center items-center px-5 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#8994c3] hover:bg-[#48557f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Crear Comanda
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      ) : (
        <>
          {tabActiva === "lista" ? (
            <>
              <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Lista de Comandas</h2>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3 }}
                className="bg-[#f0fff0] rounded-xl border border-gray-100 shadow-sm p-6 overflow-x-auto"
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nº Comanda
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mesa/Domicilio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detalles
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comandas && comandas.length > 0 ? (
                      comandas.map((comanda) => (
                        <tr key={comanda.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                            #{comanda.numeroComanda}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                            {comanda.esDomicilio ? `Domicilio: ${comanda.direccion}` : `Mesa: ${comanda.mesa}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                comanda.estado === "pendiente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : comanda.estado === "finalizado"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {comanda.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 font-medium">
                            {formatPrice(comanda.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                            <ul className="list-disc list-inside">
                              {comanda.items.map((item, index) => (
                                <li key={index}>
                                  {item.nombre} - Cantidad x{item.cantidad}
                                  {item.observacion && (
                                    <span className="block ml-4 text-xs text-gray-500 italic">
                                      Observación: {item.observacion}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No hay comandas disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Pagos</h2>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3 }}
                className="bg-[#f0fff0] rounded-xl border border-gray-100 shadow-sm p-6 overflow-x-auto"
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nº Comanda
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mesa/Domicilio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comandas
                      .filter((comanda) => comanda.estado === "finalizado")
                      .map((comanda) => (
                        <tr key={comanda.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                            #{comanda.numeroComanda}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                            {comanda.esDomicilio ? `Domicilio: ${comanda.direccion}` : `Mesa: ${comanda.mesa}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 font-medium">
                            {formatPrice(comanda.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Finalizado
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handlePago(comanda)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Procesar Pago
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </motion.div>
            </>
          )}
        </>
      )}

      {comandaSeleccionada && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-semibold mb-4">Procesar Pago</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Número de Personas</label>
                <input
                  type="number"
                  value={numeroPersonas}
                  onChange={(e) => {
                    const num = Math.max(1, Number.parseInt(e.target.value))
                    setNumeroPersonas(num)
                    setDivisionCuenta(
                      Array(num)
                        .fill()
                        .map(() => ({ items: [], total: 0 })),
                    )
                  }}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  min="1"
                />
              </div>
              {numeroPersonas === 1 ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
                    <select
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Seleccione un método</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="transferencia">Transferencia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total a Pagar</label>
                    <input
                      type="text"
                      value={formatPrice(comandaSeleccionada.total)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      disabled
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700mb-2">División de Cuenta</label>
                  {comandaSeleccionada.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="mb-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium">
                        {item.nombre} - {formatPrice(item.precio)} x{item.cantidad}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Array.from({ length: numeroPersonas }).map((_, personaIndex) => {
                          const personaItem = divisionCuenta[personaIndex]?.items.find((i) => i.nombre === item.nombre)
                          const itemCount = personaItem ? personaItem.cantidad : 0
                          return (
                            <button
                              key={personaIndex}
                              onClick={() => actualizarDivisionCuenta(personaIndex, item)}
                              className={`px-3 py-1 text-sm rounded-full ${
                                itemCount > 0 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              Persona {personaIndex + 1} {itemCount > 0 && `(${itemCount})`}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  <div className="mt-4">
                    {divisionCuenta.map((persona, index) => (
                      <div key={index} className="flex justify-between items-center mb-2">
                        <span>Persona {index + 1}:</span>
                        <span className="font-semibold">{formatPrice(persona.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setComandaSeleccionada(null)}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarPago}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Confirmar Pago
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Comandas

