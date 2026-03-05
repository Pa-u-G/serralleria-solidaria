// src/layouts/MainLayout.jsx
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar arriba */}
      <Navbar className="border-black rounded-xl"/>

      {/* Contenido principal */}
      <div className="flex flex-1">
        {/* Sidebar a la izquierda */}
        <Sidebar className="w-64 bg-gray-800 text-white" />

        {/* Área de contenido */}
        <main className="flex-1 p-6 bg-[#F9FAFB]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;