import './Navbar.scss';
import logo from './logoweb.png';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  const CategoriesActive = categories.filter(cat => cat.status == 1);

  // cerrar si haces click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav>
      <img src={logo} alt="logo" />

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
              <div key={cat.id} className="dropdown-item" onClick={() => navigate(`../pages/store/category/CategoryPage/${cat.id}`)}>
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
      <button>Perfil</button>
    </nav>
  );
}

export default Navbar;