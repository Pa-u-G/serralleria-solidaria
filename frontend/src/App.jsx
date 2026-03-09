import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Categories from "./pages/categories";
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

      </Routes>

    </BrowserRouter>

  )

}

export default App