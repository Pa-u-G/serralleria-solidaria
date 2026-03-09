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

  const createPack = () => {

    const name = prompt("Nombre del pack:");
    if (!name) return;

    const description = prompt("Descripción:");
    if (!description) return;

    const price = prompt("Precio:");
    if (!price) return;

    axios.post("http://localhost:8000/api/packs", {
      name,
      description,
      price
    })
    .then(res => setPacks([...packs, res.data]))
    .catch(err => console.log(err));

  };

  return (
    <MainLayout>
      <div className="w-full flex flex-col justify-center items-center">

        <div className="flex items-center justify-between w-4/5 mb-4">
          <h1 className="text-3xl">Packs</h1>

          <button
            onClick={createPack}
            className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Crear Pack
          </button>
        </div>

        <table className="border-1 border-black p-10 w-4/5 text-center">
          <thead className="bg-gray-200">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
            </tr>
          </thead>

          <tbody>
            {packs.map(pack => (
              <tr
                key={pack.id}
                className="border-1 border-black cursor-pointer"
                onClick={() => navigate(`/packs/${pack.id}`)}
              >
                <td className="pl-10 pr-10 pt-4 pb-4">{pack.id}</td>
                <td className="pl-10 pr-10 pt-4 pb-4">{pack.name}</td>
                <td className="pl-10 pr-10 pt-4 pb-4">{pack.price}€</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </MainLayout>
  );
}

export default Packs;