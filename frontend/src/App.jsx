import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Categories from "./pages/categorias/categories";
import Caracteristicas from "./pages/caracteristicas/caracteristicas";
import CharacteristicTypeShow from "./pages/caracteristicas/show";
import Products from "./pages/products/Products";
import Create_product from "./pages/products/Create";
import Edit_product from "./pages/products/Edit";
import DashboardTienda from "./pages/store/dashboardTienda/dashboard";

import Packs from "./pages/Packs/packs"
import PackShow from "./pages/Packs/packShow"
import Pack_create from "./pages/Packs/create";
import Pack_edit from "./pages/Packs/edit";

import Icons from "./assets/icons";
import CategoryPage from './pages/store/category/CategoryPage';

function App() {

  return (
    <>
      <Icons />
      <BrowserRouter>

        <Routes>

          <Route path="/admin/" element={<Dashboard />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/products/create" element={<Create_product />} />
          <Route path="/admin/products/edit/:id" element={<Edit_product />} />

          <Route path="/admin/caracteristicas" element={<Caracteristicas />} />

          <Route path="/admin/caracteristicas/:id" element={<CharacteristicTypeShow />} />

          <Route path="/admin/packs" element={<Packs />} />

          <Route path="/admin/packs/:id" element={<PackShow />} />
          <Route path="/admin/packs/create" element={<Pack_create />} />
          <Route path="/admin/packs/edit/:id" element={<Pack_edit />} />
          
          <Route path="/" element={<DashboardTienda />} />
          <Route path="/category/:id" element={<CategoryPage />} />

        </Routes>

      </BrowserRouter>
    </>

  )

}

export default App