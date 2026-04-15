import Navbar from "../../components/tienda/navbarTienda/Navbar";
import './Main_layout_tienda.scss';
import SplashCursor from './SplashCursor'

function MainLayout({ children }) {
  return (
    <div className="divTienda">
      <SplashCursor
        DENSITY_DISSIPATION={10}
        VELOCITY_DISSIPATION={0.5}
        PRESSURE={0.1}
        CURL={50}
        SPLAT_RADIUS={0.1}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
        SHADING
        RAINBOW_MODE={false}
        COLOR="#F07057"
      />

      <Navbar />

      <div className="divMain">


        <main>
          {children}
        </main>

      </div>

    </div>
  );
}

export default MainLayout;