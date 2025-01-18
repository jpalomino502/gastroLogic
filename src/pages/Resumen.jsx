import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

const EnhancedDashboard = ({ comandas, ganancias }) => {
  const [timeRange, setTimeRange] = useState('day');
  const [filteredComandas, setFilteredComandas] = useState(comandas);

  useEffect(() => {
    const now = new Date();
    const filtered = comandas.filter(comanda => {
      const comandaDate = new Date(comanda.tiempoInicio);
      switch (timeRange) {
        case 'day':
          return comandaDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return comandaDate >= weekAgo;
        case 'month':
          return comandaDate.getMonth() === now.getMonth() && 
                 comandaDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
    setFilteredComandas(filtered);
  }, [timeRange, comandas]);

  const pedidosPendientes = filteredComandas.filter(c => c.estado === 'pendiente').length;
  const pedidosEnCurso = filteredComandas.filter(c => c.estado === 'en_preparacion').length;
  const pedidosFinalizados = filteredComandas.filter(c => c.estado === 'finalizado').length;
  const totalPedidos = filteredComandas.length;

  const datosGrafica = [
    { name: 'Pendientes', cantidad: pedidosPendientes },
    { name: 'En Curso', cantidad: pedidosEnCurso },
    { name: 'Finalizados', cantidad: pedidosFinalizados },
  ];

  const COLORS = ['#FFA500', '#00C49F', '#0088FE'];

  const tiemposPreparacion = filteredComandas
    .filter(c => c.estado === 'finalizado' && c.tiempoInicio && c.tiempoFin)
    .map(c => (c.tiempoFin - c.tiempoInicio) / 60000);
  const tiempoPromedioPreparacion = tiemposPreparacion.length > 0
    ? (tiemposPreparacion.reduce((a, b) => a + b, 0) / tiemposPreparacion.length).toFixed(2)
    : 0;

  const ventasPorHora = filteredComandas.reduce((acc, comanda) => {
    const hour = new Date(comanda.tiempoInicio).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const ventasPorHoraData = Object.entries(ventasPorHora).map(([hour, count]) => ({
    hour: `${hour}:00`,
    ventas: count
  }));

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Resumen</h1>
      
      <div className="mb-6">
        <label htmlFor="timeRange" className="mr-2 font-semibold">Rango de tiempo:</label>
        <select 
          id="timeRange" 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="day">Hoy</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Pedidos", value: totalPedidos, color: "bg-blue-500" },
          { title: "Pedidos Pendientes", value: pedidosPendientes, color: "bg-yellow-500" },
          { title: "Pedidos en Curso", value: pedidosEnCurso, color: "bg-green-500" },
          { title: "Pedidos Finalizados", value: pedidosFinalizados, color: "bg-purple-500" },
        ].map((item, index) => (
          <div key={index} className={`${item.color} text-white rounded-lg shadow-lg p-6`}>
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Estado de Pedidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosGrafica}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="cantidad"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {datosGrafica.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Ventas por Hora</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ventasPorHoraData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ventas" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Ganancias Totales</h2>
          <p className="text-5xl font-bold text-green-600">{formatPrice(ganancias)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Estadísticas</h2>
          <div className="space-y-4">
            <div>
              <p className="text-lg font-semibold">Tiempo promedio de preparación:</p>
              <p className="text-3xl font-bold">{tiempoPromedioPreparacion} min</p>
            </div>
            <div>
              <p className="text-lg font-semibold">Pedido promedio:</p>
              <p className="text-3xl font-bold">{formatPrice(ganancias / totalPedidos)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">Últimos Pedidos</h2>
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
            {filteredComandas.slice(-5).reverse().map((comanda) => (
              <tr key={comanda.id}>
                <td className="px-6 py-4 whitespace-nowrap">{comanda.numeroComanda}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {comanda.esDomicilio ? `Domicilio: ${comanda.direccion}` : `Mesa: ${comanda.mesa}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    comanda.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                    comanda.estado === 'en_preparacion' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {comanda.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{formatPrice(comanda.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnhancedDashboard;

