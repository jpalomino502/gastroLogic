import React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ShoppingBag, Clock, CheckCircle, AlertCircle, TrendingUp, TrendingDown } from "lucide-react"

const data = [
  { date: "Lun", total: 4000 },
  { date: "Mar", total: 3000 },
  { date: "Mie", total: 2000 },
  { date: "Jue", total: 2780 },
  { date: "Vie", total: 1890 },
  { date: "Sab", total: 2390 },
  { date: "Dom", total: 3490 },
]

export default function Resumen() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6 md:mb-8">Hola Nuevamente ✌️</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="md:col-span-2 lg:col-span-3">
          <h3 className="text-2xl md:text-3xl font-semibold text-zinc-900 mb-3">Ganancias</h3>
          <div className="bg-[#e4f4ff] rounded-3xl border border-gray-100 shadow-sm p-4 md:p-6 flex flex-col">
            <div className="mb-2 md:mb-4">
              <h2 className="text-3xl font-bold mb-1 text-zinc-900">$15,231.89</h2>
              <p className="text-sm text-zinc-900">Balance del período</p>
            </div>
            <div className="h-[150px] md:h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#3B82F6"
                    fill="url(#colorTotal)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2">
              {["24h", "7d", "30d", "1y"].map((period) => (
                <button
                  key={period}
                  className="px-2 py-1 text-xs rounded-lg transition-colors text-zinc-900 hover:font-bold"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 lg:col-span-4 flex flex-col">
          <h3 className="text-2xl md:text-3xl font-semibold text-zinc-900 mb-3">Estado de Pedidos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-grow">
            {[
              {
                bg: "bg-[#e8dcec]",
                icon: <ShoppingBag className="w-5 h-5 text-zinc-900" />,
                title: "Total Pedidos",
                value: 150,
                percent: "100",
                trend: "up",
              },
              {
                bg: "bg-[#d7ecd6]",
                icon: <AlertCircle className="w-5 h-5 text-zinc-900" />,
                title: "Pendientes",
                value: 23,
                percent: "15.3",
                trend: "down",
              },
              {
                bg: "bg-green-50",
                icon: <CheckCircle className="w-5 h-5 text-zinc-900" />,
                title: "Finalizados",
                value: 127,
                percent: "84.7",
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
                {[
                  { id: 1, numero: 1001, mesa: "Mesa: 5", estado: "finalizado", total: "$45.00" },
                  { id: 2, numero: 1002, mesa: "Domicilio: Calle 123", estado: "en_preparacion", total: "$32.50" },
                  { id: 3, numero: 1003, mesa: "Mesa: 3", estado: "pendiente", total: "$28.75" },
                  { id: 4, numero: 1004, mesa: "Mesa: 7", estado: "finalizado", total: "$52.20" },
                  { id: 5, numero: 1005, mesa: "Domicilio: Av. Principal", estado: "pendiente", total: "$39.90" },
                ].map((comanda) => (
                  <tr key={comanda.id} className="hover:bg-gray-50 transition-colors">
                    <td className="pr-4 py-4 whitespace-nowrap text-sm zinc-900">#{comanda.numero}</td>
                    <td className="pr-4 py-4 whitespace-nowrap text-sm zinc-900">{comanda.mesa}</td>
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">{comanda.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <button className="px-4 py-2 bg-[#ded2e2] text-zinc-900 rounded-md hover:bg-[#b6aaba] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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
    </div>
  )
}

