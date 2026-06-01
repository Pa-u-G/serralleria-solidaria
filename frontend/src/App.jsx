import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from './contexts/CartContext';

// Components públics (botiga)
import DashboardTienda from "./pages/store/dashboardTienda/dashboard";
import CategoryPage from './pages/store/category/CategoryPage';
import Solutions from './pages/store/solutions/solutions';

// Components d'admin (protegits)
import Dashboard from "./pages/dashboard";
import Categories from "./pages/categorias/categories";
import Caracteristicas from "./pages/caracteristicas/caracteristicas";
import CharacteristicTypeShow from "./pages/caracteristicas/show";
import Products from "./pages/products/Products";
import Create_product from "./pages/products/Create";
import Edit_product from "./pages/products/Edit";
import Packs from "./pages/Packs/packs";
import PackShow from "./pages/Packs/packShow";
import Pack_create from "./pages/Packs/create";
import Pack_edit from "./pages/Packs/edit";
import SolutionsShow from "./pages/solutions/solutions";
import SolutionDetail from "./pages/solutions/SolutionDetail";
import Settings from "./pages/settings/Settings";

// Components de client (protegits - només usuaris loguejats)
import PerfilCliente from "./pages/store/perfil/Perfil";

// Altres
import Icons from "./assets/icons";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register"; // ← AFEGIR AIXÒ

import ProductPage from './pages/store/products/ProductPage'
import ProductsPage from './pages/store/products/Products';
import PacksPage from './pages/store/packs/PacksPage';
import PackPage from './pages/store/packs/PackPage';

import CartPage from './pages/store/cart/CartPage';
import Orders from "./pages/orders/Orders";
import OrderDetail from "./pages/orders/OrderDetail";

function App() {
  return (
    <AuthProvider>
      <CartProvider>

        <Icons />
        <BrowserRouter>
          <Routes>
            {/* RUTES PÚBLIQUES (tothom pot veure) */}
            <Route path="/" element={<DashboardTienda />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/product/:id" element={< ProductPage />}/>
            <Route path="/products/" element={< ProductsPage />}/>
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/packs" element={<PacksPage />} />
            <Route path="/pack/:id" element={<PackPage />} />
            
            {/* RUTES DE LOGIN I REGISTER */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* ← AFEGIR AIXÒ */}


            {/* RUTA CARRITO */}
            <Route path="/carrito" element={
              <ProtectedRoute allowedRoles={['cliente', 'admin']}>
                <CartPage />
              </ProtectedRoute>
            } />

            
            {/* RUTES PROTEGIDES D'ADMIN (només admin) */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/categories" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Categories />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/products" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Products />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/products/create" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Create_product />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/products/edit/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Edit_product />
              </ProtectedRoute>
            } />

            <Route path="/admin/caracteristicas" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Caracteristicas />
              </ProtectedRoute>
            } />

            <Route path="/admin/caracteristicas/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CharacteristicTypeShow />
              </ProtectedRoute>
            } />

            <Route path="/admin/packs" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Packs />
              </ProtectedRoute>
            } />

            <Route path="/admin/packs/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PackShow />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/packs/create" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Pack_create />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/packs/edit/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Pack_edit />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/solutions" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SolutionsShow />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/solutions/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SolutionDetail />
              </ProtectedRoute>
            } />

            <Route path="/admin/settings" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <OrderDetail />
              </ProtectedRoute>
            } />

            {/* RUTES PROTEGIDES DE CLIENT (qualsevol usuari loguejat) */}
            <Route path="/perfil" element={
              <ProtectedRoute allowedRoles={['cliente', 'admin']}>
                <PerfilCliente />
              </ProtectedRoute>
            } />

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;