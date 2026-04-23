// src/components/Sidebar.jsx
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="flex flex-col p-4 space-y-2 border border-gray-300 w-1/7">
      <Link className="hover:bg-[#F07057] p-2 rounded" to="/admin/">Dashboard</Link>
      <Link className="hover:bg-[#F07057] p-2 rounded" to="/admin/categories">Categories</Link>
      <Link className="hover:bg-[#F07057] p-2 rounded" to="/admin/products">Productes</Link>
      <Link className="hover:bg-[#F07057] p-2 rounded" to="/admin/caracteristicas">Caracteristicas</Link>
      <Link className="hover:bg-[#F07057] p-2 rounded" to="/admin/packs">Packs</Link>
      <Link className="hover:bg-[#F07057] p-2 rounded" to="/admin/solutions">Solucions</Link>
    </aside>
  );
}

export default Sidebar;