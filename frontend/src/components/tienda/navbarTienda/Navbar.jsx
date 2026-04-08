import './Navbar.scss';
import logo from './logoweb.png';

function Navbar() {
  return (
    <nav>
        <img src={logo} alt="logo" />
        <ul>
            <li>Categories</li>
            <li>Productes</li>
            <li>Packs</li>
        </ul>
        <input type="text" placeholder='Busca alguna cosa'/>
    </nav>
  );
}

export default Navbar;