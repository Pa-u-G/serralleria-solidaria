import MainLayout from "../../layouts/Main_layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Products() {

  const navigate = useNavigate();
  
  // Estados para productos y categorías
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("totes");

  const toggleStatus = async (id) => {
    console.log("a")
    try {
      const post = posts.find(p => p.id === id);

      const res = await axios.patch(`http://localhost:8000/api/product/${id}`, {
        status: !post.status
      });

      setPosts(posts.map(p => p.id === id ? { ...p, status: !p.status } : p));

    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    // Cargar productos
    axios.get("http://localhost:8000/api/products")
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
    
    // Cargar categorías para el filtro
    axios.get("http://localhost:8000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  // Filtrar productos
  const filteredProducts = posts.filter(product => {
    // Filtro por búsqueda (nombre o código)
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por categoría
    const matchesCategory = selectedCategory === "totes" || 
                           product.category_id === parseInt(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Gestió de Productes
        </h1>

        <button onClick={() => navigate("/admin/products/create")} className="bg-[#F07057] text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 shadow cursor-pointer flex gap-2">
          <svg className="w-6 h-6">
            <use href="#icon-plus"></use>
          </svg>
          Afegir Producte
        </button>

      </div>

      <div className="flex gap-4 mb-6">

        <input
          type="text"
          placeholder="Cercar productes..."
          className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#F07057] bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select 
          className="border rounded-lg px-4 py-2 bg-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="totes">Totes les categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-200 text-gray-600 border-b border-gray-300">

            <tr>
              <th className="text-left p-4 font-medium">Codi</th>
              <th className="text-left p-4 font-medium">Nom</th>
              <th className="text-left p-4 font-medium">Categoria</th>
              <th className="text-left p-4 font-medium">Preu</th>
              <th className="text-left p-4 font-medium">Stock</th>
              <th className="text-left p-4 font-medium">Destacat</th>
              <th className="text-left p-4 font-medium">Estat</th>
              <th className="text-center p-4 font-medium">Accions</th>
            </tr>

          </thead>

          <tbody>

            {filteredProducts.map(product => (

              <tr
                key={product.id}
                className="border-b border-gray-300 hover:bg-gray-50 transition"
              >

                <td className="p-4 text-gray-500">
                  {product.code}
                </td>

                <td className="p-4 font-medium text-gray-800">
                  {product.name}
                </td>

                <td className="p-4 text-gray-500">
                  {product.category?.name}
                </td>

                <td className="p-4 font-semibold">
                  {product.price}€
                </td>

                <td className="p-4">
                  {product.stock}
                </td>

                <td className="p-4">
                  {product.star ? (
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                      Yes
                    </span>
                  ) : (
                    <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                      No
                    </span>
                  )}
                </td>

                <td className="p-4 text-center">
                  <div className={`${product.status ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"} rounded-2xl`}>
                    {product.status ? "actiu" : "inactiu"}
                  </div>
                </td>

                <td className="p-4 flex gap-3 justify-center">
                  <button onClick={() => navigate(`/admin/products/edit/${product.id}`)} className="text-[#F07057] cursor-pointer">
                    <svg className="w-6 h-6">
                      <use href="#icon-square-pen"></use>
                    </svg>
                  </button>

                  <button onClick={() => toggleStatus(product.id)} className={`${product.status ? "bg-red-500" : "bg-green-500"} text-white px-2 py-1 rounded cursor-pointer`}>
                    {product.status ? "Desactivar" : "Activa"}
                  </button>
                </td>

              </tr>

            ))}

            {/* Mensaje si no hay resultados */}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-8 text-gray-500">
                  No s'han trobat productes
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </MainLayout>
  );
}

export default Products;