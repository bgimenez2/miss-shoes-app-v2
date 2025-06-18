import React, { useState, useEffect } from 'react';

export default function Ventas() {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState(() => {
    const saved = localStorage.getItem('ms_ventas');
    return saved ? JSON.parse(saved) : [];
  });

  const [buscar, setBuscar] = useState('');
  const [seleccionados, setSeleccionados] = useState([]);
  const [total, setTotal] = useState(0);

  // Cargar productos desde localStorage
  useEffect(() => {
    const prod = localStorage.getItem('ms_productos');
    if (prod) setProductos(JSON.parse(prod));
  }, []);

  // Calcular total automáticamente
  useEffect(() => {
    const totalCalculado = seleccionados.reduce((sum, item) => {
      return sum + (item.venta * item.cantidad);
    }, 0);
    setTotal(totalCalculado);
  }, [seleccionados]);

  const handleAgregar = (prod) => {
    const yaEsta = seleccionados.find(p => p.codigo === prod.codigo);
    if (yaEsta) return alert('Este producto ya está en la venta.');
    setSeleccionados([...seleccionados, { ...prod, cantidad: 1 }]);
  };

  const handleCantidad = (codigo, cant) => {
    const actualizados = seleccionados.map(p => {
      if (p.codigo === codigo) {
        const nueva = Number(cant);
        if (nueva > p.stock) {
          alert('No hay suficiente stock.');
          return { ...p, cantidad: p.stock };
        }
        return { ...p, cantidad: nueva };
      }
      return p;
    });
    setSeleccionados(actualizados);
  };

  const confirmarVenta = () => {
    if (seleccionados.length === 0) return alert('No hay productos en la venta.');

    // 1. Actualizar productos (descontar stock)
    const nuevosProductos = productos.map(prod => {
      const vendido = seleccionados.find(s => s.codigo === prod.codigo);
      if (vendido) {
        const nuevoStock = prod.stock - vendido.cantidad;
        return { ...prod, stock: nuevoStock >= 0 ? nuevoStock : 0 };
      }
      return prod;
    });

    // 2. Guardar en localStorage
    localStorage.setItem('ms_productos', JSON.stringify(nuevosProductos));
    setProductos(nuevosProductos);

    // 3. Guardar venta
    const nuevaVenta = {
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      items: seleccionados,
      total
    };
    const nuevasVentas = [...ventas, nuevaVenta];
    localStorage.setItem('ms_ventas', JSON.stringify(nuevasVentas));
    setVentas(nuevasVentas);

    // 4. Limpiar venta
    setSeleccionados([]);
    setTotal(0);
    alert('Venta confirmada');
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
    p.codigo.toLowerCase().includes(buscar.toLowerCase())
  );

  const formatNumber = n => Number(n).toLocaleString('es-ES');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ventas</h1>

      {/* Buscar producto */}
      <input
        type="text"
        value={buscar}
        onChange={e => setBuscar(e.target.value)}
        placeholder="Buscar producto por código o nombre"
        className="border p-2 rounded w-full mb-4"
      />

      {/* Lista de resultados */}
      <div className="mb-4">
        {productosFiltrados.map(p => (
          <div key={p.codigo} className="flex justify-between items-center border p-2 rounded mb-1">
            <span>{p.nombre} - Talle {p.talle} - Stock: {p.stock}</span>
            <button onClick={() => handleAgregar(p)} className="bg-blue-500 text-white px-4 py-1 rounded">Agregar</button>
          </div>
        ))}
      </div>

      {/* Productos seleccionados para la venta */}
      {seleccionados.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Productos a vender</h2>
          <table className="min-w-full bg-white shadow rounded mb-4">
            <thead>
              <tr>
                <th className="px-4 py-2">Producto</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {seleccionados.map(p => (
                <tr key={p.codigo}>
                  <td className="border px-4 py-2">{p.nombre}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={p.cantidad}
                      min={1}
                      max={p.stock}
                      onChange={e => handleCantidad(p.codigo, e.target.value)}
                      className="w-20 border rounded p-1"
                    />
                  </td>
                  <td className="border px-4 py-2">{formatNumber(p.venta)}</td>
                  <td className="border px-4 py-2">{formatNumber(p.venta * p.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mb-4 font-bold text-lg">
            Total: {formatNumber(total)} Gs.
          </div>

          <button onClick={confirmarVenta} className="bg-green-600 text-white px-6 py-2 rounded">Confirmar Venta</button>
        </>
      )}

      {/* Historial de ventas */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Historial de ventas</h2>
        {ventas.length === 0 ? (
          <p className="text-gray-500">Aún no hay ventas registradas.</p>
        ) : (
          <ul className="space-y-2">
            {ventas.map(v => (
              <li key={v.id} className="border p-2 rounded">
                <div className="font-semibold">{v.fecha}</div>
                <ul className="ml-4 text-sm">
                  {v.items.map(item => (
                    <li key={item.codigo}>
                      {item.nombre} x{item.cantidad} = {formatNumber(item.venta * item.cantidad)} Gs.
                    </li>
                  ))}
                </ul>
                <div className="text-right font-bold mt-1">Total: {formatNumber(v.total)} Gs.</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
