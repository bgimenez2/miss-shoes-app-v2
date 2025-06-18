// src/utils/format.js
export function formatNumber(n) {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(n);
}
