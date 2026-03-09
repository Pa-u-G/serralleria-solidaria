// src/layouts/MainLayout.jsx
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <div className="flex flex-1">

        <Sidebar className="w-64 bg-gray-800 text-white" />

        <main className="flex-1 bg-[#F9FAFB] p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default MainLayout;