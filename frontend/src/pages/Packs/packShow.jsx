import MainLayout from "../../layouts/Main_layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function PackShow(){

  const { id } = useParams();
  const navigate = useNavigate();

  const [pack,setPack] = useState(null);
  const [products,setProducts] = useState([]);

  const fetchPack = () => {

    axios.get(`http://localhost:8000/api/packs/${id}`)
      .then(res => setPack(res.data))
      .catch(err => console.log(err));

  };

  const fetchProducts = () => {

    axios.get("http://localhost:8000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));

  };

  useEffect(() => {

    fetchPack();
    fetchProducts();

  },[id]);



  const addProduct = (product_id) => {

    const amount = prompt("Cantidad:");
    if(!amount) return;

    axios.post("http://localhost:8000/api/product-pack",{
      product_id,
      pack_id:id,
      amount
    })
    .then(()=>fetchPack())
    .catch(err=>console.log(err));

  };


  const removeProduct = (product_id) => {

    axios.delete(`http://localhost:8000/api/product-pack/${product_id}/${id}`)
      .then(()=>fetchPack())
      .catch(err=>console.log(err));

  };


  const editAmount = (product) => {

    const amount = prompt("Nueva cantidad:",product.pivot.amount);
    if(!amount) return;

    axios.put("http://localhost:8000/api/product-pack",{
      product_id:product.id,
      pack_id:id,
      amount
    })
    .then(()=>fetchPack())
    .catch(err=>console.log(err));

  };


  if(!pack) return <MainLayout>Cargando...</MainLayout>;



  return(
    <MainLayout>

      <div className="w-4/5 mx-auto mt-6">

        <div className="flex items-center justify-between mb-4 w-full">
          <h1 className="text-3xl">{pack.name}</h1>

          <button
            onClick={()=>navigate("/packs")}
            className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Volver
          </button>
        </div>


{/* TABLA PRODUCTOS DEL PACK */}

        <h2 className="text-xl mb-2">Productos del pack</h2>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full mb-4">
          <table className="p-10 w-full">

            <thead className="bg-gray-200 text-gray-600 border-b border-gray-300">
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {pack.products.map(product=>(
                <tr key={product.id} className="border-b border-gray-300 hover:bg-gray-50 transition">

                  <td className="pl-10 pr-10 pt-4 pb-4">{product.name}</td>
                  <td className="pl-10 pr-10 pt-4 pb-4 text-center">{product.price}€</td>
                  <td className="pl-10 pr-10 pt-4 pb-4 text-center">{product.pivot.amount}</td>

                  <td className="pl-10 pr-10 pt-4 pb-4 flex gap-2 justify-center">

                    <button
                      onClick={()=>editAmount(product)}
                      className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer"
                    >
                      Editar
                    </button>

                    <button
                      onClick={()=>removeProduct(product.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
                    >
                      Eliminar
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>



{/* TABLA PRODUCTOS DISPONIBLES */}

        <h2 className="text-xl mb-2">Añadir producto</h2>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full mb-4">
          <table className="p-10 w-full">

            <thead className="bg-gray-200 text-gray-600 border-b border-gray-300">
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Añadir</th>
              </tr>
            </thead>

            <tbody>

              {products
                // filtramos los que ya están en el pack
                .filter(product => !pack.products.some(p => p.id === product.id))
                .map(product => (
                  <tr key={product.id} className="border-b border-gray-300 hover:bg-gray-50 transition">

                    <td className="pl-10 pr-10 pt-4 pb-4">{product.name}</td>
                    <td className="pl-10 pr-10 pt-4 pb-4 text-center">{product.price}€</td>

                    <td className="pl-10 pr-10 pt-4 pb-4 flex justify-center">

                      <button
                        onClick={() => addProduct(product.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer"
                      >
                        Añadir
                      </button>

                    </td>

                  </tr>
                ))}

            </tbody>

          </table>
        </div>

      </div>

    </MainLayout>
  )

}

export default PackShow