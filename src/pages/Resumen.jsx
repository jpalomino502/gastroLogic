import React, { useState, useMemo, useRef, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  X,
} from "lucide-react"

const ModernDashboard = ({ comandas, ganancias }) => {
  const [timeRange, setTimeRange] = useState("24h")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef(null)
  const [orderTimeRange, setOrderTimeRange] = useState("all")
  const [filteredOrdersComandas, setFilteredOrdersComandas] = useState(comandas)

  const filterDataByTimeRange = (data, range) => {
    const now = new Date()
    return data.filter((comanda) => {
      const comandaDate = new Date(comanda.tiempoInicio)
      switch (range) {
        case "24h":
          return now - comandaDate <= 24 * 60 * 60 * 1000
        case "7d":
          return now - comandaDate <= 7 * 24 * 60 * 60 * 1000
        case "30d":
          return now - comandaDate <= 30 * 24 * 60 * 60 * 1000
        case "1y":
          return now - comandaDate <= 365 * 24 * 60 * 60 * 1000
        default:
          return true
      }
    })
  }

  const filterOrders = (range) => {
    const now = new Date()
    const filtered = comandas.filter((comanda) => {
      const comandaDate = new Date(comanda.tiempoInicio)
      switch (range) {
        case "day":
          return now.toDateString() === comandaDate.toDateString()
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return comandaDate >= weekAgo
        default:
          return true
      }
    })
    setFilteredOrdersComandas(filtered)
    setOrderTimeRange(range)
  }

  const filteredComandas = useMemo(() => filterDataByTimeRange(comandas, timeRange), [comandas, timeRange])

  const processEarningsData = useMemo(() => {
    const earningsMap = filteredComandas.reduce((acc, comanda) => {
      const date = new Date(comanda.tiempoInicio)
      const day = date.toLocaleDateString("es-ES", { weekday: "short" })
      acc[day] = (acc[day] || 0) + comanda.total
      return acc
    }, {})

    return Object.entries(earningsMap).map(([date, total]) => ({
      date,
      total,
    }))
  }, [filteredComandas])

  const currentStats = useMemo(() => {
    const total = filteredComandas.reduce((sum, comanda) => sum + comanda.total, 0)
    const pendientes = filteredComandas.filter((c) => c.estado === "pendiente").length
    const enCurso = filteredComandas.filter((c) => c.estado === "en_preparacion").length
    const finalizados = filteredComandas.filter((c) => c.estado === "finalizado").length
    const totalPedidos = filteredComandas.length

    return { total, pendientes, enCurso, finalizados, totalPedidos }
  }, [filteredComandas])

  const getPorcentaje = (cantidad) => ((cantidad / (currentStats.totalPedidos || 1)) * 100).toFixed(1)

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    if (isModalOpen) {
      setFilteredOrdersComandas(comandas)
      setOrderTimeRange("all")
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isModalOpen, comandas])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6 md:mb-8">Hola Nuevamente ✌️</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="md:col-span-2 lg:col-span-3">
          <h3 className="text-2xl md:text-3xl font-semibold text-zinc-900 mb-3">Ganancias</h3>
          <div className="bg-[#e4f4ff] rounded-3xl border border-gray-100 shadow-sm p-4 md:p-6 flex flex-col">
            <div className="mb-2 md:mb-4">
              <h2 className="text-3xl font-bold mb-1 text-zinc-900">{formatPrice(currentStats.total)}</h2>
              <p className="text-sm text-zinc-900">Balance del período</p>
            </div>
            <div className="h-[150px] md:h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processEarningsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 10 }}
                    dy={5}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 10 }} width={30} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "none",
                      borderRadius: "12px",
                      color: "white",
                      padding: "6px 8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value) => formatPrice(value)}
                    labelStyle={{ color: "#94A3B8", fontSize: "10px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#3B82F6"
                    fill="url(#colorTotal)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#3B82F6", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "24h", label: "24h" },
                { id: "7d", label: "7d" },
                { id: "30d", label: "30d" },
                { id: "1y", label: "1y" },
              ].map((period) => (
                <button
                  key={period.id}
                  onClick={() => setTimeRange(period.id)}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                    timeRange === period.id ? "font-bold text-zinc-900" : "text-zinc-900 hover:font-bold"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 lg:col-span-4 flex flex-col">
          <h3 className="text-2xl md:text-3xl font-semibold text-zinc-900 mb-3">Estado de Pedidos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-grow">
            {[
              {
                bg: "bg-[#e8dcec]",
                icon: <ShoppingBag className="w-5 h-5 text-zinc-900" />,
                title: "Total Pedidos",
                value: currentStats.totalPedidos,
                percent: "100",
                trend: "up",
              },
              {
                bg: "bg-[#d7ecd6]",
                icon: <AlertCircle className="w-5 h-5 text-zinc-900" />,
                title: "Pendientes",
                value: currentStats.pendientes,
                percent: getPorcentaje(currentStats.pendientes),
                trend: "down",
              },
              {
                bg: "bg-[#f5efd7]",
                icon: <Clock className="w-5 h-5 text-zinc-900" />,
                title: "En Curso",
                value: currentStats.enCurso,
                percent: getPorcentaje(currentStats.enCurso),
                trend: "up",
              },
              {
                bg: "bg-green-50",
                icon: <CheckCircle className="w-5 h-5 text-zinc-900" />,
                title: "Finalizados",
                value: currentStats.finalizados,
                percent: getPorcentaje(currentStats.finalizados),
                trend: "up",
              },
            ].map((card, index) => (
              <div
                key={index}
                className={`${card.bg} rounded-3xl border border-gray-100 shadow-sm p-3 md:p-4 flex flex-col justify-between`}
              >
                <div className="flex justify-between items-start">
                  {card.icon}
                  <span className="text-xs font-medium flex items-center">
                    {card.percent}%
                    {card.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 ml-1 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 ml-1 text-red-500" />
                    )}
                  </span>
                </div>
                <div>
                  <h2 className="text-sm font-semibold mb-1 text-zinc-900">{card.title}</h2>
                  <p className="text-lg font-bold text-zinc-900">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 md:gap-6">
        <div className="lg:col-span-4 bg-white rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900">Últimos Pedidos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pr-4 py-3 text-left text-xs font-medium text-zinc-900 uppercase tracking-wider">Nº</th>
                  <th className="pr-4 py-3 text-left text-xs font-medium text-zinc-900 uppercase tracking-wider">
                    Mesa/Domicilio
                  </th>
                  <th className="pr-4 py-3 text-left text-xs font-medium text-zinc-900 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="pr-4 py-3 text-left text-xs font-medium text-zinc-900 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comandas.slice(0, 5).map((comanda) => (
                  <tr key={comanda.id} className="hover:bg-gray-50 transition-colors">
                    <td className="pr-4 py-4 whitespace-nowrap text-sm zinc-900">#{comanda.numeroComanda}</td>
                    <td className="pr-4 py-4 whitespace-nowrap text-sm zinc-900">
                      {comanda.esDomicilio ? `Domicilio: ${comanda.direccion}` : `Mesa: ${comanda.mesa}`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                          comanda.estado === "pendiente"
                            ? "bg-yellow-100 text-yellow-800"
                            : comanda.estado === "en_preparacion"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {comanda.estado}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                      {formatPrice(comanda.total)}
                    </td>
                  </tr>
                ))}
                {[...Array(Math.max(0, 5 - comandas.length))].map((_, index) => (
                  <tr key={`empty-${index}`}>
                    <td colSpan={4} className="h-[53px]"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#ded2e2] text-black rounded-md hover:bg-[#b6aaba] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Ver más
            </button>
          </div>
        </div>
        <div className="lg:col-span-3 bg-white rounded-3xl">
          <div className="p-4 bg-[#0a0104] rounded-3xl h-full flex justify-center items-center">
            <p className="text-white text-xl font-semibold text-center">
              🚀 <span className="text-lg">¡Próximamente!</span> ⏳ <br />
              Estamos trabajando en algo increíble, ¡mantente atento! 👀✨
            </p>
          </div>
        </div>
      </div>

      {isModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div
      ref={modalRef}
      className="bg-white rounded-lg w-full max-w-5xl flex flex-col h-[calc(100vh-2rem)] max-h-[90vh]"
    >
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-2xl font-semibold">Todos los pedidos</h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6">
          {[
            { id: "day", label: "Hoy", icon: Calendar },
            { id: "week", label: "Esta semana", icon: Calendar },
            { id: "all", label: "Todos", icon: Filter },
          ].map((button) => (
            <button
              key={button.id}
              onClick={() => filterOrders(button.id)}
              className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 ${
                orderTimeRange === button.id
                  ? "font-bold text-zinc-900 bg-gray-100"
                  : "text-zinc-900 hover:font-bold hover:bg-gray-50"
              }`}
            >
              {React.createElement(button.icon, { className: "w-4 h-4" })}
              <span>{button.label}</span>
            </button>
          ))}
        </div>

        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pr-4 py-3 text-left text-xs font-medium text-zinc-900 uppercase tracking-wider">
                Nº
              </th>
              <th className="pr-4 py-3 text-left text-xs font-medium text-zinc-900 uppercase tracking-wider">
                Mesa/Domicilio
              </th>
              <th className="pr-4 py-3 text-left text-xs font-medium text-zinc-900 uppercase tracking-wider">
                Estado
              </th>
              <th className="pr-4 py-3 text-left text-xs font-medium text-zinc-900 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrdersComandas.map((comanda) => (
              <tr key={comanda.id} className="hover:bg-gray-50 transition-colors">
                <td className="pr-4 py-4 whitespace-nowrap text-sm text-zinc-900">
                  #{comanda.numeroComanda}
                </td>
                <td className="pr-4 py-4 whitespace-nowrap text-sm text-zinc-900">
                  {comanda.esDomicilio
                    ? `Domicilio: ${comanda.direccion}`
                    : `Mesa: ${comanda.mesa}`}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                      comanda.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-800"
                        : comanda.estado === "en_preparacion"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {comanda.estado}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                  {formatPrice(comanda.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default ModernDashboard

