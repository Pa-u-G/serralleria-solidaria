import Navbar from "../../components/tienda/navbarTienda/Navbar";
import './Main_layout_tienda.scss';
function MainLayout({ children }) {
  return (
    <div className="divTienda">

      <Navbar />

      <div>


        <main>
          {children}
        </main>

      </div>

    </div>
  );
}

export default MainLayout;