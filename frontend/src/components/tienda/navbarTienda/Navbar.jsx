// components/tienda/navbarTienda/Navbar.jsx
import './Navbar.scss';
import logo from './logoweb.png';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../../../contexts/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  const CategoriesActive = categories.filter(cat => cat.status == 1);

  // Tancar dropdowns al fer click fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav>
      <img src={logo} alt="logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}/>

      <ul>
        <li 
          className="dropdown"
          ref={dropdownRef}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          Categories
          <div className={`dropdown-menu ${open ? "active" : ""}`}>
            {CategoriesActive.map(cat => (
              <div key={cat.id} className="dropdown-item" onClick={() => navigate(`/category/${cat.id}`)}>
                {cat.name}
              </div>
            ))}
          </div>
        </li>
        <li>Productes</li>
        <li>Packs</li>
      </ul>

      <input type="text" placeholder='Busca alguna cosa'/>
      <button>Cesta</button>
      
      {/* Menú d'usuari condicional */}
      {isAuthenticated ? (
        <div className="user-menu-container" ref={userMenuRef}>
          <button 
            className="user-menu-button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <span className="user-email">{user?.email?.split('@')[0]}</span>
            <span className="user-icon">👤</span>
            <span className={`dropdown-arrow ${userMenuOpen ? 'open' : ''}`}>▼</span>
          </button>
          
          <div className={`user-dropdown ${userMenuOpen ? "active" : ""}`}>
            <div className="user-info-dropdown">
              <strong>{user?.email}</strong>
              <span className="user-role">{user?.role === 'admin' ? 'Administrador' : 'Client'}</span>
            </div>
            
            <div className="dropdown-divider"></div>
            
            {/* Opcions per a tots els usuaris loguejats */}
            <div className="dropdown-item" onClick={() => {
              setUserMenuOpen(false);
              navigate('/perfil');
            }}>
              <span>👤</span> El meu perfil
            </div>
            
            <div className="dropdown-item" onClick={() => {
              setUserMenuOpen(false);
              navigate('/mis-compras');
            }}>
              <span>📦</span> Les meves compres
            </div>
            
            {/* Opció només per a admin */}
            {user?.role === 'admin' && (
              <div className="dropdown-item" onClick={() => {
                setUserMenuOpen(false);
                navigate('/admin');
              }}>
                <span>⚙️</span> Panel d'administració
              </div>
            )}
            
            <div className="dropdown-divider"></div>
            
            <div className="dropdown-item logout" onClick={handleLogout}>
              <span>🚪</span> Tancar sessió
            </div>
          </div>
        </div>
      ) : (
        <button className="login-button" onClick={() => navigate('/login')}>
          <span>🔑</span> Iniciar Sessió
        </button>
      )}
    </nav>
  );
}

export default Navbar;