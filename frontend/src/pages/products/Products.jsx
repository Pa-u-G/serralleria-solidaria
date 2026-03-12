import MainLayout from "../../layouts/Main_layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Products() {

  const toggleStatus = async (id) => {
      console.log("a")
      try {
        const post = posts.find(p => p.id === id);

        const res = await axios.patch(`http://localhost:8000/api/product/${id}`, {
          status: !post.status
        });

        // Actualizamos localmente el estado
        setPosts(posts.map(p => p.id === id ? { ...p, status: !p.status } : p));

      } catch (err) {
        console.log(err);
      }
    };
  
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/products")
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <MainLayout>

      
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Gestió de Productes
        </h1>

        <button className="bg-[#F07057] text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 shadow">
          <Link to="/products/create">+ Afegir Producte</Link>
        </button>

      </div>


      
      <div className="flex gap-4 mb-6">

        <input
          type="text"
          placeholder="Cercar productes..."
          className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#F07057] bg-white"
        />

        <select className="border rounded-lg px-4 py-2 bg-white">
          <option>Totes les categories</option>
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
              <th className="text-left p-4 font-medium">Accions</th>

            </tr>

          </thead>

          <tbody>

            {posts.map(product => (

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
                  {product.category.name}
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
                    {product.status ? "activo" : "inactivo"}
                  </div>
                </td>

                
                <td className="p-4 flex gap-3">

                  <button className="text-blue-500 hover:text-blue-700">
                    <Link to={`/products/edit/${product.id}`}>✏️</Link>
                  </button>

                  <button onClick={() => toggleStatus(product.id)} className={`${product.status ? "bg-red-500" : "bg-green-500"} text-white px-2 py-1 rounded cursor-pointer`}>
                    {product.status ? "Desactivar" : "Activar"}
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </MainLayout>
  );
}

export default Products;