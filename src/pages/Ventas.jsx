import React, { useState } from 'react';
import { formatNumber } from '../utils/format';
import { useLocalStorage } from '../utils/useLocalStorage';
import SearchBar from '../components/SearchBar';

export default function Ventas() {
  const [ventas, setVentas] = useLocalStorage('ventas', []);
  const [search, setSearch] = useState('');
  const [producto, setProducto] = useState('');
  const [monto, setMonto] = useState('');

  // Filtra por producto o ID
  const filtered = ventas.filter(v =>
    v.producto.toLowerCase().includes(search.toLowerCase()) ||
    String(v.id).includes(search)
  );

  // Agrega una venta nueva
  function addVenta() {
    if (!producto.trim() || !monto) return;
    const id = ventas.length ? Math.max(...ventas.map(v => v.id)) + 1 : 1;
    setVentas([
      ...ventas,
      { id, producto: producto.trim(), monto: Number(monto) }
    ]);
    setProducto('');
    setMonto('');
  }

  // Edita el monto de una venta existente
  function editVenta(id) {
    const updated = prompt('Ingrese nuevo monto (Gs.):');
    if (updated != null) {
      const m = Number(updated);
      if (!isNaN(m))
        setVentas(
          ventas.map(v =>
            v.id === id ? { ...v, monto: m } : v
          )
        );
    }
  }

  // Elimina una venta
  function deleteVenta(id) {
    if (window.confirm('¿Eliminar esta venta?')) {
      setVentas(ventas.filter(v => v.id !== id));
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Ventas</h1>

      {/* Formulario */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Producto"
          value={producto}
          onChange={e => setProducto(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          placeholder="Monto (Gs.)"
          value={monto}
          onChange={e => setMonto(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={addVenta}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Agregar venta
        </button>
      </div>

      {/* Búsqueda */}
      <SearchBar
        placeholder="Buscar por ID o producto"
        value={search}
        onChange={setSearch}
      />

      {/* Tabla */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Producto</th>
            <th className="px-4 py-2 border text-right">Monto (Gs.)</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map(v => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{v.id}</td>
                <td className="px-4 py-2 border">{v.producto}</td>
                <td className="px-4 py-2 border text-right">
                  {formatNumber(v.monto)}
                </td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => editVenta(v.id)}
                    className="text-blue-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteVenta(v.id)}
                    className="text-red-500"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-500">
                No hay ventas registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
);
}
