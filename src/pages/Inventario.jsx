import React, { useState, useEffect } from 'react';

export default function Inventario() {
  // 1. Carga inicial desde LocalStorage
  const [productos, setProductos] = useState(() => {
    const saved = localStorage.getItem('ms_productos');
    return saved ? JSON.parse(saved) : [];
  });
  // 2. Estados para formulario y edición
  const [form, setForm] = useState({
    codigo: '', nombre: '', talle: '', color: '', costo: '', venta: '', stock: '', imagen: null
  });
  const [editingId, setEditingId] = useState(null);
  // 3. Estado de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // 4. Persistir cuando cambian productos
  useEffect(() => {
    localStorage.setItem('ms_productos', JSON.stringify(productos));
  }, [productos]);

  // 5. Manejo de inputs de texto y números
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  // 6. Manejo de archivo de imagen
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setForm(prev => ({ ...prev, imagen: reader.result }));
      reader.readAsDataURL(file);
    }
  };
  // 7. Envío (nuevo o editar)
  const handleSubmit = e => {
    e.preventDefault();
    // Validación: código único
    if (!form.codigo.trim()) return alert('El código es obligatorio.');
    if (editingId === null && productos.some(p => p.codigo === form.codigo)) {
      return alert('Este código ya está en uso.');
    }
    if (editingId !== null) {
      setProductos(productos.map(p =>
        p.id === editingId ? { id: p.id, ...form } : p
      ));
      setEditingId(null);
    } else {
      setProductos([...productos, { id: Date.now(), ...form }]);
    }
    setForm({ codigo: '', nombre: '', talle: '', color: '', costo: '', venta: '', stock: '', imagen: null });
  };
  // 8. Editar producto
  const handleEdit = p => {
    setForm({ codigo: p.codigo, nombre: p.nombre, talle: p.talle, color: p.color, costo: p.costo, venta: p.venta, stock: p.stock, imagen: p.imagen || null });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // 9. Eliminar producto
  const handleDelete = id => {
    if (window.confirm('¿Eliminar este producto?')) {
      setProductos(productos.filter(p => p.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm({ codigo: '', nombre: '', talle: '', color: '', costo: '', venta: '', stock: '', imagen: null });
      }
    }
  };

  // 10. Filtrar productos según buscador (por nombre, código o id)
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm)
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inventario</h1>

      {/* Formulario de producto */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 grid grid-cols-2 gap-4">
        <input name="codigo" value={form.codigo} onChange={handleChange} placeholder="Código" className="border p-2 rounded" required />
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="border p-2 rounded" required />
        <input name="talle" value={form.talle} onChange={handleChange} placeholder="Talle" className="border p-2 rounded" />
        <input name="color" value={form.color} onChange={handleChange} placeholder="Color" className="border p-2 rounded" />
        <input name="costo" type="number" value={form.costo} onChange={handleChange} placeholder="Precio costo" className="border p-2 rounded" />
        <input name="venta" type="number" value={form.venta} onChange={handleChange} placeholder="Precio venta" className="border p-2 rounded" />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" className="border p-2 rounded" />
        <div className="col-span-2">
          <label className="block mb-1 font-medium">Imagen</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded w-full" />
        </div>
        <div className="col-span-2 text-right">
          <button type="submit" className={`px-5 py-2 rounded text-white ${editingId ? 'bg-green-600' : 'bg-blue-500'}`}> 
            {editingId ? 'Guardar cambios' : 'Agregar producto'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ codigo: '', nombre: '', talle: '', color: '', costo: '', venta: '', stock: '', imagen: null }); }} className="ml-3 px-5 py-2 bg-gray-400 text-white rounded">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Buscador de inventario */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar producto por código, nombre o id..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Tabla de productos filtrados */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>{['Imagen','Código','Nombre','Talle','Color','Costo','Venta','Stock','Acciones'].map((h,i) => <th key={i} className="px-4 py-2 bg-gray-100">{h}</th>)}</tr>
          </thead>
          <tbody>
            {productosFiltrados.length > 0 ? productosFiltrados.map(p => (
              <tr key={p.id}>
                <td className="border px-4 py-2">
                  {p.imagen ? <img src={p.imagen} alt={p.nombre} className="w-16 h-16 object-cover rounded" /> : <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-500 rounded">Sin foto</div>}
                </td>
                <td className="border px-4 py-2">{p.codigo}</td>
                <td className="border px-4 py-2">{p.nombre}</td>
                <td className="border px-4 py-2">{p.talle}</td>
                <td className="border px-4 py-2">{p.color}</td>
                <td className="border px-4 py-2">{p.costo}</td>
                <td className="border px-4 py-2">{p.venta}</td>
                <td className="border px-4 py-2">{p.stock}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(p)} className="px-3 py-1 bg-yellow-500 text-white rounded">Editar</button>
                  <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="9" className="text-center py-6 text-gray-500">No hay productos que coincidan</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}