import MainLayout from "../../layouts/Main_layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Packs() {

  const [packs, setPacks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/packs")
      .then(res => setPacks(res.data))
      .catch(err => console.log(err));
  }, []);

  // const createPack = () => {
  //   const name = prompt("Nombre del pack:");
  //   if (!name) return;

  //   const description = prompt("Descripción:");
  //   if (!description) return;

  //   const price = prompt("Precio:");
  //   if (!price) return;

  //   axios.post("http://localhost:8000/api/packs", { name, description, price })
  //     .then(res => setPacks([...packs, res.data]))
  //     .catch(err => console.log(err));
  // };

  // const editPack = (pack) => {
  //   const newName = prompt("Nuevo nombre del pack:", pack.name);
  //   if (!newName) return;

  //   const newDescription = prompt("Nueva descripción:", pack.description);
  //   if (!newDescription) return;

  //   const newPrice = prompt("Nuevo precio:", pack.price);
  //   if (!newPrice) return;

  //   axios.put(`http://localhost:8000/api/packs/${pack.id}`, {
  //     name: newName,
  //     description: newDescription,
  //     price: newPrice
  //   })
  //   .then(() => {
  //     setPacks(packs.map(p => p.id === pack.id ? { ...p, name: newName, description: newDescription, price: newPrice } : p));
  //   })
  //   .catch(err => console.log(err));
  // };

  const togglePackStatus = async (pack) => {
    try {
      await axios.patch(`http://localhost:8000/api/packs/${pack.id}`, {
        status: !pack.status
      });
      setPacks(packs.map(p => p.id === pack.id ? { ...p, status: !p.status } : p));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout>
      <div className="w-full flex flex-col justify-center items-center">

        <div className="flex items-center justify-between w-4/5 mb-4">
          <h1 className="text-3xl">Packs</h1>

          <button
            onClick={() => navigate("/packs/create")}
            className="bg-[#F07057] text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 shadow mb-4 cursor-pointer"
          >
            Crear Pack
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden w-4/5">
          <table className="p-10 w-full">
            <thead className="bg-gray-200 text-gray-600 border-b border-gray-300">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {packs.map(pack => (
                <tr key={pack.id} className="border-b border-gray-300 hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate(`/packs/${pack.id}`)}>
                  <td className="pl-10 pr-10 pt-4 pb-4">{pack.id}</td>
                  <td className="pl-10 pr-10 pt-4 pb-4">{pack.name}</td>
                  <td className="pl-10 pr-10 pt-4 pb-4">{pack.price}€</td>
                  <td className="pl-10 pr-10 pt-4 pb-4 text-center">
                    <div className={`${pack.status ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"} rounded-2xl`}>
                      {pack.status ? "activo" : "inactivo"}
                    </div>
                  </td>
                  <td className="pl-10 pr-10 pt-4 pb-4 flex gap-2 justify-end">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/packs/edit/${pack.id}`);
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        togglePackStatus(pack);
                      }}
                      className={`${pack.status ? "bg-red-500" : "bg-green-500"} text-white px-2 py-1 rounded cursor-pointer`}
                    >
                      {pack.status ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </MainLayout>
  );
}

export default Packs;