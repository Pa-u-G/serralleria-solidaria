import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Categories from "./pages/categorias/categories";
import Caracteristicas from "./pages/caracteristicas/caracteristicas";
import CharacteristicTypeShow from "./pages/caracteristicas/show";
import Products from "./pages/products/Products";
import Create_product from "./pages/products/Create";
import Edit_product from "./pages/products/Edit";
import DashboardTienda from "./pages/tienda/dashboardTienda/dashboard";

import Packs from "./pages/Packs/packs"
import PackShow from "./pages/Packs/packShow"
import Pack_create from "./pages/Packs/create";
import Pack_edit from "./pages/Packs/edit";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/create" element={<Create_product />} />
        <Route path="/products/edit/:id" element={<Edit_product />} />

        <Route path="/caracteristicas" element={<Caracteristicas />} />

        <Route path="/caracteristicas/:id" element={<CharacteristicTypeShow />} />

        <Route path="/packs" element={<Packs />} />

        <Route path="/packs/:id" element={<PackShow />} />
        <Route path="/packs/create" element={<Pack_create />} />
        <Route path="/packs/edit/:id" element={<Pack_edit />} />
        
        <Route path="/dashboardTienda" element={<DashboardTienda />} />

      </Routes>

    </BrowserRouter>

  )

}

export default App