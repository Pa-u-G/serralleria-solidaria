import { BrowserRouter, Routes, Route } from "react-router-dom";

import Categories from "./pages/categorias/categories";
import Caracteristicas from "./pages/caracteristicas/caracteristicas";
import CharacteristicTypeShow from "./pages/caracteristicas/show";
import Packs from "./pages/Packs/packs"
import PackShow from "./pages/Packs/packShow"
import Dashboard from "./pages/dashboard";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/categories" element={<Categories />} />

        <Route path="/caracteristicas" element={<Caracteristicas />} />

        <Route path="/caracteristicas/:id" element={<CharacteristicTypeShow />} />

        <Route path="/packs" element={<Packs />} />

        <Route path="/packs/:id" element={<PackShow />} />

      </Routes>

    </BrowserRouter>

  )

}

export default App