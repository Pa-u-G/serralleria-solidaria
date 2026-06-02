import MainLayout from "../../layouts/Main_layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function CharacteristicTypeShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState(null);

  const fetchType = () => {
    axios.get(`http://localhost:8000/api/characteristics-types`)
      .then(res => {
        const found = res.data.find(t => t.id === parseInt(id));
        setType(found);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchType();
  }, [id]);

  const createCharacteristic = () => {
    const desc = prompt("Descripció de la nova característica:");
    if (!desc) return;

    axios.post("http://localhost:8000/api/characteristics", {
      characteristic_id: id,
      description: desc
    })
    .then(res => setType({ ...type, characteristics: [...type.characteristics, res.data] }))
    .catch(err => console.log(err));
  };

  if (!type) return <MainLayout>Carregant...</MainLayout>;

  const toggleCharacteristicStatus = async (id) => {
    try {
      const char = type.characteristics.find(c => c.id === id);

      await axios.patch(`http://localhost:8000/api/characteristics/${id}`, {
        status: !char.status
      });

      setType({
        ...type,
        characteristics: type.characteristics.map(c =>
          c.id === id ? { ...c, status: !c.status } : c
        )
      });

    } catch (err) {
      console.log(err);
    }
  };

  const edit = (id) => {
    const newName = prompt("Nova descripció de la característica:");
    if (!newName) return;

    axios.put(`http://localhost:8000/api/characteristics/${id}`, { description: newName })
      .then(res => {
        setType({
          ...type,
          characteristics: type.characteristics.map(c =>
            c.id === id ? { ...c, description: newName } : c
          )
        });
      })
      .catch(err => console.log(err));
  };

  return (
    <MainLayout>
      <div className="w-4/5 mx-auto mt-6 flex flex-col gap-2">
          <button onClick={() => navigate("/admin/caracteristicas")} className="text-gray-500 rounded cursor-pointer flex gap-2">
            <svg className="w-6 h-6">
              <use href="#icon-arrow-left"></use>
            </svg>
            Tornar enrere
          </button>
        <div className="flex items-center justify-between mb-4 w-full">
          <h1 className="text-3xl">{type.type}</h1>
          <button onClick={createCharacteristic} className="bg-[#F07057] text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 shadow cursor-pointer flex gap-2">
            <svg className="w-6 h-6">
              <use href="#icon-plus"></use>
            </svg>
            Afegir Característica
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full">
          <table className="p-10 w-full">
            <thead className="bg-gray-200 text-gray-600 border-b border-gray-300">
              <tr>
                <th>ID</th>
                <th>Descripció</th>
                <th>Estat</th>
                <th>Accions</th>
              </tr>
            </thead>
            <tbody>
              {type.characteristics.map(c => (
                <tr key={c.id} className="border-b border-gray-300 hover:bg-gray-50 transition">
                  <td className="pl-10 pr-10 pt-4 pb-4">{c.id}</td>
                  <td className="pl-10 pr-10 pt-4 pb-4">{c.description}</td>
                  <td className="pl-10 pr-10 pt-4 pb-4 text-center">
                    <div className={`${c.status ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"} rounded-2xl`}>
                      {c.status ? "actiu" : "inactiu"}
                    </div>
                  </td>
                  <td className="pl-10 pr-10 pt-4 pb-4 flex gap-2 justify-end">
                    <button onClick={(e) => {
                      e.stopPropagation();
                      edit(c.id)
                    }} className="text-[#F07057] cursor-pointer">
                      <svg className="w-6 h-6">
                        <use href="#icon-square-pen"></use>
                      </svg>
                    </button>
                    <button onClick={() => toggleCharacteristicStatus(c.id)} className={`${c.status ? "bg-red-500" : "bg-green-500"} text-white px-3 py-1 rounded cursor-pointer`}>
                      {c.status ? "Desactivar" : "Activa"}
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

export default CharacteristicTypeShow;