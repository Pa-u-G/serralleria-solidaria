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
    const desc = prompt("Descripción de la nueva característica:");
    if (!desc) return;

    axios.post("http://localhost:8000/api/characteristics", {
      characteristic_id: id,
      description: desc
    })
    .then(res => setType({ ...type, characteristics: [...type.characteristics, res.data] }))
    .catch(err => console.log(err));
  };

  if (!type) return <MainLayout>Cargando...</MainLayout>;

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
    const newName = prompt("Nueva Descripcion de la caracteristica:");
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
      <div className="w-4/5 mx-auto mt-6">
        <div className="flex items-center justify-between mb-4 w-full">
          <h1 className="text-3xl">{type.type}</h1>
          <button onClick={createCharacteristic} className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer">
            Añadir Característica
          </button>
          <button onClick={() => navigate("/caracteristicas")} className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">
            Volver
          </button>
        </div>

        <table className="border-1 border-black w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {type.characteristics.map(c => (
              <tr key={c.id} className="border-1 border-black">
                <td className="pl-10 pr-10 pt-4 pb-4">{c.id}</td>
                <td className="pl-10 pr-10 pt-4 pb-4">{c.description}</td>
                <td className="pl-10 pr-10 pt-4 pb-4">
                  <div className={`${c.status ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"} rounded-2xl`}>
                    {c.status ? "activo" : "inactivo"}
                  </div>
                </td>
                <td className="pl-10 pr-10 pt-4 pb-4 flex gap-2 justify-end">
                  <button onClick={(e) => {
                    e.stopPropagation();
                    edit(type.id)
                  }} className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer">
                    Editar
                  </button>
                  <button onClick={() => toggleCharacteristicStatus(c.id)} className={`${c.status ? "bg-red-500" : "bg-green-500"} text-white px-3 py-1 rounded cursor-pointer`}>
                    {c.status ? "Desactivar" : "Activar"}
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

export default CharacteristicTypeShow;