export const formatearMoneda = (val: number | string = 0): string => {
  const numero = Number(val);
  if (isNaN(numero)) return '$ 0';
  
  const tieneDecimales = numero % 1 !== 0;
  
  const numeroFormateado = new Intl.NumberFormat('es-AR', {
    style: 'decimal',
    minimumFractionDigits: tieneDecimales ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(numero);

  return `$ ${numeroFormateado}`;
};

export const formatearPrecioInput = (val: string | number): string => {
  if (val === null || val === undefined) return '';

  let str = String(val);

  if (typeof val === 'number') {
    // Si viene como número (ej. de la DB), su decimal nativo es punto, lo pasamos a coma
    str = str.replace('.', ',');
  } else {
    // Si viene del input del usuario, los puntos que pueda tener son separadores de miles, los ignoramos
    str = str.replace(/\./g, '');
  }

  // Removemos todo lo que no sea número o coma
  str = str.replace(/[^0-9,]/g, '');
  
  const parts = str.split(',');
  // Asegurar solo una coma (descartar las demás si escriben más de una)
  if (parts.length > 2) {
    str = parts[0] + ',' + parts.slice(1).join('');
  }
  
  const [entero, decimal] = str.split(',');

  // Quitar ceros a la izquierda (ej. "01" -> "1"), salvo que sea exactamente "0"
  let enteroLimpio = entero;
  if (enteroLimpio.length > 1 && enteroLimpio.startsWith('0')) {
    enteroLimpio = parseInt(enteroLimpio, 10).toString();
    if (enteroLimpio === 'NaN') enteroLimpio = '0';
  }

  const enteroFormateado = enteroLimpio.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return decimal !== undefined ? `${enteroFormateado},${decimal}` : enteroFormateado;
};

export const parsePrecioInput = (val: string): number => {
  if (!val) return 0;
  const parsed = parseFloat(val.replace(/\./g, '').replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
};

export const formatearPeso = (cantidad: number): string => {
  if (cantidad < 1 && cantidad > 0) {
    return `${(cantidad * 1000).toFixed(0)} gr`;
  }
  return `${cantidad.toFixed(3).replace(/\.?0+$/, '')} Kg`;
};

