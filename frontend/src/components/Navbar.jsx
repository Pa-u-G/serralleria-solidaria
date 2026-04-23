// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import LogoutButton from './LogoutButton';
import logo from './tienda/navbarTienda/logoweb.png';

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="p-4 shadow border border-gray-300">
      <img 
          src={logo} 
          alt="logo" 
          onClick={() => navigate("/")} 
        />
      <LogoutButton />
    </nav>
  );
}

export default Navbar;