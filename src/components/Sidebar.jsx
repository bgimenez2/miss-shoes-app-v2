import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `block p-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`;

export default function Sidebar() {
  return (
    <nav className="w-60 bg-white border-r">
      <ul className="p-4 space-y-2">
        <li><NavLink to="/" className={linkClass}>Dashboard</NavLink></li>
        <li><NavLink to="/inventario" className={linkClass}>Inventario</NavLink></li>
        <li><NavLink to="/ventas" className={linkClass}>Ventas</NavLink></li>
        <li><NavLink to="/gastos" className={linkClass}>Gastos</NavLink></li>
      </ul>
    </nav>
  );
}
