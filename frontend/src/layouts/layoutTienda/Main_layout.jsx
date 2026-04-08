import Navbar from "../../components/tienda/navbarTienda/Navbar";
import './Main_layout.scss';
function MainLayout({ children }) {
  return (
    <div>

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