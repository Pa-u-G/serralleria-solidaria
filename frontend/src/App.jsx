import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Categories from "./pages/categories";
import Products from "./pages/products";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />

      </Routes>

    </BrowserRouter>

  )

}

export default App