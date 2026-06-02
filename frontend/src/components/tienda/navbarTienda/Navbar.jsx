import './Navbar.scss';
import logo from './logoweb.WebP';
import logoPequeño from './logo-sin-texto.png';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchRef = useRef(null);
  const searchResultsRef = useRef(null); // NUEVO: para evitar cerrar al hacer clic en resultados
  const hamburgerRef = useRef(null); 
  const userMenuRef = useRef(null);
  const { cartCount } = useCart();

  useEffect(() => {
    axios.get("http://localhost:8000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  const CategoriesActive = categories.filter(cat => cat.status == 1);

  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const delayDebounce = setTimeout(() => {
        axios.get(`http://localhost:8000/api/products/search?q=${searchTerm}`)
          .then(res => {
            setSearchResults(res.data);
            setShowResults(true);
          })
          .catch(err => console.log(err));
      }, 300);
      return () => clearTimeout(delayDebounce);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (hamburgerRef.current && hamburgerRef.current.contains(e.target)) return;
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
        setMobileCategoriesOpen(false);
      }
      // MODIFICADO: no cerrar si se clica dentro de los resultados (searchResultsRef)
      if (searchRef.current && !searchRef.current.contains(e.target) && 
          searchResultsRef.current && !searchResultsRef.current.contains(e.target)) {
        setSearchOpen(false);
        setShowResults(false);
        setSearchTerm('');
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchOpen(false);
      setShowResults(false);
      setSearchTerm('');
    }
  };

  const handleProductClick = (e, productId) => {
    e.preventDefault();
    e.stopPropagation(); // Evita que el evento cierre el dropdown antes de navegar
    console.log("Click en producto:", productId);
    navigate(`/product/${productId}`);
    // Pequeño retraso para permitir la navegación y luego limpiar
    setTimeout(() => {
      setSearchOpen(false);
      setShowResults(false);
      setSearchTerm('');
    }, 100);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <nav>
        <div className="logo-container">
          <img src={logo} alt="logo" className="logo-desktop" onClick={() => navigate("/")} />
          <img src={logoPequeño} alt="logo" className="logo-mobile" onClick={() => navigate("/")} />
        </div>

        <button aria-label="Menú" ref={hamburgerRef} className="hamburger" onClick={toggleMobileMenu}>
          <span></span><span></span><span></span>
        </button>

        <ul className="desktop-menu">
          <li className="dropdown" ref={dropdownRef} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
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

        <div className="desktop-search-container">
          <input className="desktop-search" type="text" placeholder="Busca alguna cosa..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.trim().length >= 2 && setShowResults(true)} />
          {showResults && searchResults.length > 0 && (
            <div className="search-results-dropdown" ref={searchResultsRef}>
              {searchResults.slice(0, 8).map(product => (
                <div key={product.id} className="search-result-item" onClick={(e) => handleProductClick(e, product.id)}>
                  {product.images?.[0]?.path ? (
                    <img src={`http://localhost:8000/storage/${product.images[0].path}`} alt={product.name} />
                  ) : <div className="search-result-no-image">📦</div>}
                  <div className="search-result-info">
                    <span className="search-result-name">{product.name}</span>
                    <span className="search-result-price">{product.price}€</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showResults && searchTerm.trim().length >= 2 && searchResults.length === 0 && (
            <div className="search-results-dropdown">
              <div className="search-result-empty">No s'han trobat productes per "{searchTerm}"</div>
            </div>
          )}
        </div>

        <div className="mobile-search-container" ref={searchRef}>
          <button className="mobile-search-icon" onClick={() => setSearchOpen(!searchOpen)}>
            <svg className="icon"><use href="#icon-search"></use></svg>
            <span className="search-text">Buscar</span>
          </button>
          <form className={`mobile-search-form ${searchOpen ? "active" : ""}`} onSubmit={handleSearchSubmit}>
            <input type="text" placeholder="Cercar productes..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} autoFocus={searchOpen} />
            <button type="submit"><svg className="icon"><use href="#icon-search"></use></svg></button>
          </form>
          {searchOpen && showResults && (
            <div className="mobile-search-results" ref={searchResultsRef}>
              {searchResults.slice(0, 5).map(product => (
                <div key={product.id} className="mobile-search-result" onClick={(e) => handleProductClick(e, product.id)}>
                  <span>{product.name}</span>
                  <span>{product.price}€</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="cart-btn" onClick={() => navigate('/carrito')}>
          🛒 {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>

        <div className="user-menu-container" ref={userMenuRef}>
          {isAuthenticated ? (
            <>
              <button className="user-menu-button" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <svg className="icon"><use href="#icon-user-circle"></use></svg>
                <span className="user-email">{user?.email?.split('@')[0]}</span>
                <span className={`dropdown-arrow ${userMenuOpen ? 'open' : ''}`}>▼</span>
              </button>
              <div className={`user-dropdown ${userMenuOpen ? "active" : ""}`}>
                <div className="user-info-dropdown"><strong>{user?.email}</strong><span className="user-role">{user?.role === 'admin' ? 'Administrador' : 'Client'}</span></div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onClick={() => { setUserMenuOpen(false); navigate('/perfil'); }}>
                  <svg className="icon"><use href="#icon-user"></use></svg> El meu perfil
                </div>
                
                <div className="dropdown-item" onClick={() => {
                  setUserMenuOpen(false);
                  navigate('/my-orders');
                }}>
                  <svg className="icon">
                    <use href="#icon-document"></use>
                  </svg>
                  Les meves compres
                </div>
                {user?.role === 'admin' && (
                  <div className="dropdown-item" onClick={() => { setUserMenuOpen(false); navigate('/admin'); }}>
                    <svg className="icon"><use href="#icon-cog-6-tooth"></use></svg> Panel d'administració
                  </div>
                )}
                <div className="dropdown-divider"></div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  <svg className="icon"><use href="#icon-logout"></use></svg> Tancar sessió
                </div>
              </div>
            </>
          ) : (
            <button className="login-button" onClick={() => navigate('/login')}>
              <svg className="icon"><use href="#icon-user"></use></svg> Iniciar Sessió
            </button>
          )}
        </div>

        <div className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`} ref={mobileMenuRef}>
          <div className="mobile-menu-category">
            <div className="mobile-menu-item category-item" onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}>
              <span>Categories</span>
              <span className={`arrow ${mobileCategoriesOpen ? "open" : ""}`}>▼</span>
            </div>
            <div className={`mobile-submenu ${mobileCategoriesOpen ? "active" : ""}`}>
              {CategoriesActive.map(cat => (
                <div key={cat.id} className="mobile-submenu-item" onClick={() => {
                  navigate(`/category/${cat.id}`);
                  setMobileMenuOpen(false);
                  setMobileCategoriesOpen(false);
                }}>{cat.name}</div>
              ))}
            </div>
          </div>
          <div className="mobile-menu-item" onClick={() => { navigate("/products"); setMobileMenuOpen(false); }}>Productes</div>
          <div className="mobile-menu-item" onClick={() => { navigate("/packs"); setMobileMenuOpen(false); }}>Packs</div>
          <div className="mobile-menu-item" onClick={() => { navigate("/solutions"); setMobileMenuOpen(false); }}>Solucions</div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;