import MainLayout from "../layouts/Main_layout";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  
  const get_status = (stock) => {
    const status = 
      stock <= 5 ? { text: "Critic", color: "text-red-600" } :
      stock <= 15 ? { text: "Baix", color: "text-orange-500" } :
      { text: "Normal", color: "text-green-600" };

    return status;
  };
  return (
    <MainLayout>
      <h1 className="text-4xl font-bold text-[#F07057] mb-4">Dashboard</h1>
      <p className="text-gray-700">Bienvenido al panel de control</p>
      <div className="bg-white p-6 rounded-lg shadow mt-4">
        <h2 className="text-xl font-semibold mb-4">Stock de Productes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 font-medium">Producte</th>
                <th className="p-3 font-medium">Categoria</th>
                <th className="p-3 font-medium">Stock</th>
                <th className="p-3 font-medium">Estat</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const status = get_status(product.stock);
                return (
                  <tr key={product.id} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{product.name}</td>
                    <td className="p-3 text-gray-500">{product.category.name}</td>
                    <td className={`p-3 font-semibold ${status.color}`}>{product.stock} unitats</td>
                    <td className={`p-3 font-medium ${status.color}`}>{status.text}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  )
}

export default Dashboard