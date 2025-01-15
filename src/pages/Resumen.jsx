import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ClipboardListIcon, ClockIcon, CheckCircleIcon, TrendingUpIcon, TrendingDownIcon } from '../components/Icons';
import { formatPrice } from '../utils/formatPrice';

function Resumen({ comandas, ganancias }) {
  const pedidosPendientes = comandas.filter(c => c.estado === 'pendiente').length;
  const pedidosEnCurso = comandas.filter(c => c.estado === 'en_preparacion').length;
  const pedidosFinalizados = comandas.filter(c => c.estado === 'finalizado').length;
  const totalPedidos = comandas.length;

  const datosGrafica = [
    { name: 'Pendientes', cantidad: pedidosPendientes },
    { name: 'En Curso', cantidad: pedidosEnCurso },
    { name: 'Finalizados', cantidad: pedidosFinalizados },
  ];

  const datosPie = [
    { name: 'Pendientes', value: pedidosPendientes },
    { name: 'En Curso', value: pedidosEnCurso },
    { name: 'Finalizados', value: pedidosFinalizados },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Calcular el promedio de tiempo de preparación
  const tiemposPreparacion = comandas
    .filter(c => c.estado === 'finalizado' && c.tiempoInicio && c.tiempoFin)
    .map(c => (c.tiempoFin - c.tiempoInicio) / 60000); // Convertir a minutos
  const tiempoPromedioPreparacion = tiemposPreparacion.length > 0
    ? (tiemposPreparacion.reduce((a, b) => a + b, 0) / tiemposPreparacion.length).toFixed(2)
    : 0;

  // Calcular la tendencia de ventas (comparando con el día anterior)
  const ventasHoy = comandas.filter(c => {
    const hoy = new Date();
    const fechaComanda = new Date(c.tiempoInicio);
    return fechaComanda.toDateString() === hoy.toDateString();
  }).length;

  const ventasAyer = comandas.filter(c => {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const fechaComanda = new Date(c.tiempoInicio);
    return fechaComanda.toDateString() === ayer.toDateString();
  }).length;

  const tendenciaVentas = ventasHoy - ventasAyer;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white shadow-lg rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Pedidos</h3>
          <div className="flex items-center">
            <ClipboardListIcon className="h-8 w-8 text-black mr-2" />
            <span className="text-3xl font-bold text-black">{totalPedidos}</span>
          </div>
        </motion.div>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white shadow-lg rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Pedidos Pendientes</h3>
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-black mr-2" />
            <span className="text-3xl font-bold text-black">{pedidosPendientes}</span>
          </div>
        </motion.div>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white shadow-lg rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Pedidos en Curso</h3>
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-black mr-2" />
            <span className="text-3xl font-bold text-black">{pedidosEnCurso}</span>
          </div>
        </motion.div>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white shadow-lg rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Pedidos Finalizados</h3>
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-black mr-2" />
            <span className="text-3xl font-bold text-black">{pedidosFinalizados}</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ganancias Totales</h2>
          <div className="flex items-center justify-center">
            <span className="text-5xl font-bold text-black ml-2 break-all">${formatPrice(ganancias)}</span>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-white shadow-lg rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Estadísticas</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tiempo promedio de preparación:</span>
              <span className="text-2xl font-bold text-black">{tiempoPromedioPreparacion} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tendencia de ventas:</span>
              <div className="flex items-center">
                {tendenciaVentas > 0 ? (
                  <TrendingUpIcon className="h-6 w-6 text-green-500 mr-2" />
                ) : (
                  <TrendingDownIcon className="h-6 w-6 text-red-500 mr-2" />
                )}
                <span className={`text-2xl font-bold ${tendenciaVentas > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(tendenciaVentas)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.7 }}
        className="bg-white shadow-lg rounded-lg p-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Resumen de Pedidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosGrafica}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosPie}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => {
                  const value = `${(percent * 100).toFixed(0)}%`;
                  return (
                    <text
                      x={name.length > 10 ? -15 : 0}
                      y={0}
                      fill="#fff"
                      textAnchor={name.length > 10 ? "end" : "middle"}
                      dominantBaseline="central"
                    >
                      {name.length > 10 ? `${name.substr(0, 10)}...` : name}
                      {window.innerWidth > 640 && `: ${value}`}
                    </text>
                  );
                }}
              >
                {datosPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.8 }}
        className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Últimos Pedidos</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Comanda</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa/Domicilio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comandas.slice(-5).reverse().map((comanda) => (
              <tr key={comanda.id}>
                <td className="px-6 py-4 whitespace-nowrap">{comanda.numeroComanda}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {comanda.esDomicilio ? `Domicilio: ${comanda.direccion}` : `Mesa: ${comanda.mesa}`}
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    comanda.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                    comanda.estado === 'en_preparacion' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {comanda.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${formatPrice(comanda.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

export default Resumen;

