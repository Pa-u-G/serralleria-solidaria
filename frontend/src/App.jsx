import { BrowserRouter, Routes, Route } from "react-router-dom";

import Categories from "./pages/categories";
import Dashboard from "./pages/dashboard";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/categories" element={<Categories />} />

      </Routes>

    </BrowserRouter>

  )

}

export default App