import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Categories from "./pages/categorias/categories";
import Caracteristicas from "./pages/caracteristicas/caracteristicas";
import CharacteristicTypeShow from "./pages/caracteristicas/show";
import Packs from "./pages/Packs/packs"
import PackShow from "./pages/Packs/packShow"
import Products from "./pages/products/Products";
import Create_product from "./pages/products/Create";
import Edit_product from "./pages/products/Edit";

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
        

      </Routes>

    </BrowserRouter>

  )

}

export default App