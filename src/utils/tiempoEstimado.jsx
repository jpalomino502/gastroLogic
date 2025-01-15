export function calcularTiempoEstimado(tiemposPreparacion) {
    if (tiemposPreparacion.length === 0) {
      return 5; // Tiempo predeterminado en minutos si no hay datos previos
    }
    
    const tiempoPromedioMs = tiemposPreparacion.reduce((a, b) => a + b, 0) / tiemposPreparacion.length;
    return Math.round(tiempoPromedioMs / 60000); // Convertir de milisegundos a minutos y redondear
  }
  
  