import MainLayout from "../layouts/Main_layout";
import { useEffect, useState } from "react";
import axios from "axios";

function Products() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/products")
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <MainLayout>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Gestió de Productes
        </h1>

        <button className="bg-[#F07057] text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 shadow">
          + Afegir Producte
        </button>

      </div>


      {/* FILTERS */}
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


      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600 border-b border-gray-300">

            <tr>

              <th className="text-left p-4 font-medium">Codi</th>
              <th className="text-left p-4 font-medium">Nom</th>
              <th className="text-left p-4 font-medium">Categoria</th>
              <th className="text-left p-4 font-medium">Preu</th>
              <th className="text-left p-4 font-medium">Stock</th>
              <th className="text-left p-4 font-medium">Destacat</th>
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


                {/* FEATURED */}
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


                {/* ACTIONS */}
                <td className="p-4 flex gap-3">

                  <button className="text-blue-500 hover:text-blue-700">
                    ✏️
                  </button>

                  <button className="text-red-500 hover:text-red-700">
                    🗑️
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