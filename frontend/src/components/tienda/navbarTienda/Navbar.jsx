import './Navbar.scss';
import logo from './logoweb.png';
import logoPequeño from './logo-sin-texto.png';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchRef = useRef(null);
  const hamburgerRef = useRef(null); 

  useEffect(() => {
    axios.get("http://localhost:8000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  const CategoriesActive = categories.filter(cat => cat.status == 1);

  // Tancar dropdowns al fer click fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Si el click és a l'hamburguesa, NO fer res
      if (hamburgerRef.current && hamburgerRef.current.contains(e.target)) {
        return;
      }
      
      // Tancar dropdown categories desktop
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
      
      // Tancar menú mòbil
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
        setMobileCategoriesOpen(false);
      }
      
      // Tancar cercador
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Funció per toggle del menú mòbil
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <nav>
      {/* Logo - Versió alternativa sense picture */}
      <div className="logo-container">
        <img 
          src={logo} 
          alt="logo" 
          className="logo-desktop" 
          onClick={() => navigate("/")} 
        />
        <img 
          src={logoPequeño} 
          alt="logo" 
          className="logo-mobile" 
          onClick={() => navigate("/")} 
        />
      </div>

      {/* Menú Hamburguesa (només mòbil) */}
      <button 
        ref={hamburgerRef}
        className="hamburger"
        onClick={toggleMobileMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menú Desktop */}
      <ul className="desktop-menu">
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
        <li onClick={() => navigate("/products")}>Productes</li>
        <li onClick={() => navigate("/packs")}>Packs</li>
        <li onClick={() => navigate("/solutions")}>Solucions</li>
      </ul>

      {/* Cercador Desktop */}
      <input className="desktop-search" type="text" placeholder="Busca alguna cosa" />

      {/* Icona Lupa (només mòbil) */}
      <div className="mobile-search-container" ref={searchRef}>
        <button 
          className="mobile-search-icon"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <span className="search-icon">🔍</span>
          <span className="search-text">Buscar</span>
        </button>
        
        <form className={`mobile-search-form ${searchOpen ? "active" : ""}`} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Cercar productes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus={searchOpen}
          />
          <button type="submit">🔍</button>
        </form>
      </div>

      {/* Botons */}
      <button className="cart-btn">🛒 Cesta</button>
      <button className="profile-btn">👤 Perfil</button>

      {/* Menú Mòbil desplegable */}
      <div className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`} ref={mobileMenuRef}>
        
        {/* Categories amb subdropdown */}
        <div className="mobile-menu-category">
          <div 
            className="mobile-menu-item category-item"
            onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
          >
            <span>Categories</span>
            <span className={`arrow ${mobileCategoriesOpen ? "open" : ""}`}>▼</span>
          </div>
          
          <div className={`mobile-submenu ${mobileCategoriesOpen ? "active" : ""}`}>
            {CategoriesActive.map(cat => (
              <div key={cat.id} className="mobile-submenu-item" onClick={() => {
                navigate(`/category/${cat.id}`);
                setMobileMenuOpen(false);
                setMobileCategoriesOpen(false);
              }}>
                {cat.name}
              </div>
            ))}
          </div>
        </div>

        {/* Altres enllaços */}
        <div className="mobile-menu-item" onClick={() => {
          navigate("/products");
          setMobileMenuOpen(false);
        }}>
          Productes
        </div>
        <div className="mobile-menu-item" onClick={() => {
          navigate("/packs");
          setMobileMenuOpen(false);
        }}>
          Packs
        </div>
        <div className="mobile-menu-item" onClick={() => {
          navigate("/solutions");
          setMobileMenuOpen(false);
        }}>
          Solucions
        </div>
      </div>
    </nav>
  );
}

export default Navbar;