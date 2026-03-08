import MainLayout from "../../layouts/Main_layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Characteristics() {
  const [types, setTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/characteristics-types")
      .then(res => setTypes(res.data))
      .catch(err => console.log(err));
  }, []);

  const createType = () => {
    const name = prompt("Nombre del nuevo tipo de característica:");
    if (!name) return;

    axios.post("http://localhost:8000/api/characteristics-types", { type: name })
      .then(res => setTypes([...types, { ...res.data, characteristics: [] }]))
      .catch(err => console.log(err));
  };

  const toggleTypeStatus = async (id) => {
    try {
      const type = types.find(t => t.id === id);

      await axios.patch(`http://localhost:8000/api/characteristics-types/${id}`, {
        status: !type.status
      });

      setTypes(types.map(t =>
        t.id === id ? { ...t, status: !t.status } : t
      ));

    } catch (err) {
      console.log(err);
    }
  };

  const edit = (id) => {
    const newName = prompt("Nuevo nombre del tipo de caracteristica:");
    if (!newName) return;

    axios.put(`http://localhost:8000/api/characteristics-types/${id}`, { type: newName }) 
      .then(res => {
        setTypes(types.map(t => t.id === id ? { ...t, type: newName } : t));
      })
      .catch(err => console.log(err));
  };

  return (
    <MainLayout>
      <div className="w-full flex flex-col justify-center items-center">
        <div className="flex items-center justify-between w-4/5 mb-4">
          <h1 className="text-3xl">Tipos de Características</h1>
          <button onClick={createType} className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer">
            Añadir Tipo
          </button>
        </div>

        <table className="border-1 border-black p-10 w-4/5 text-center">
          <thead className="bg-gray-200">
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {types.map(type => (
              <tr key={type.id} className="border-1 border-black cursor-pointer" onClick={() => navigate(`/caracteristicas/${type.id}`)}>
                <td className="pl-10 pr-10 pt-4 pb-4">{type.id}</td>
                <td className="pl-10 pr-10 pt-4 pb-4">{type.type}</td>
                <td className="pl-10 pr-10 pt-4 pb-4">
                  <div className={`${type.status ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"} rounded-2xl`}>
                    {type.status ? "activo" : "inactivo"}
                  </div>
                </td>
                <td className="pl-10 pr-10 pt-4 pb-4 flex gap-2 justify-end">
                  <button onClick={(e) => {
                    e.stopPropagation();
                    edit(type.id)
                  }} className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer">
                    Editar
                  </button>
                  <button onClick={(e) =>{
                    e.stopPropagation();
                    toggleTypeStatus(type.id);
                  } } className={`${type.status ? "bg-red-500" : "bg-green-500"} text-white px-2 py-1 rounded cursor-pointer`}>
                    {type.status ? "Desactivar" : "Activar"}
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

export default Characteristics;