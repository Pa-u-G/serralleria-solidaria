// src/components/Navbar.jsx
import LogoutButton from './LogoutButton';
function Navbar() {
  return (
    <nav className="p-4 shadow border border-gray-300">
      <h1 className="text-xl font-bold">Serralleria Solidaria</h1>
      <LogoutButton />
    </nav>
  );
}

export default Navbar;