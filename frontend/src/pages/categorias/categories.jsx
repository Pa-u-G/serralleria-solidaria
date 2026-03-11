  import MainLayout from "../../layouts/Main_layout";
  import { useEffect, useState } from "react";
  import axios from "axios";

  function Categories() {
    const [posts, setPosts] = useState([]);

    const toggleStatus = async (id) => {
      console.log("a")
      try {
        const post = posts.find(p => p.id === id);

        const res = await axios.patch(`http://localhost:8000/api/categories/${id}`, {
          status: !post.status
        });

        // Actualizamos localmente el estado
        setPosts(posts.map(p => p.id === id ? { ...p, status: !p.status } : p));

      } catch (err) {
        console.log(err);
      }
    };

    const editCategory = (id) => {
      const newName = prompt("Nuevo nombre de la categoría:");
      if (!newName) return;

      axios.put(`http://localhost:8000/api/categories/${id}`, { name: newName })
        .then(res => {
          setPosts(posts.map(p => p.id === id ? { ...p, name: newName } : p));
        })
        .catch(err => console.log(err));
    };


    // Crear nueva categoría
    const createCategory = () => {
      const name = prompt("Nombre de la nueva categoría:");
      if (!name) return;

      axios.post("http://localhost:8000/api/categories", { name })
        .then(res => {
          // Añadimos la nueva categoría a la lista
          setPosts([...posts, res.data]);
        })
        .catch(err => console.log(err));
    };

    useEffect(() => {
      axios.get("http://localhost:8000/api/categories")
        .then(res => setPosts(res.data))
        .catch(err => console.log(err));
    }, []);

    return (
      <MainLayout>
        <div className="w-full flex flex-col justify-center items-center">
          <div className="flex items-center justify-between w-4/5">
            <h1 className="text-3xl">Categorias</h1>
            <button onClick={createCategory} className="bg-[#F07057] text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 shadow mb-4 cursor-pointer">
              Añadir Categoría
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden w-4/5">
            <table className="p-10 w-full">
              <thead className="bg-gray-200 text-gray-600 border-b border-gray-300">
                <tr>
                  <th>ID</th>
                  <th>Categoria</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} id={post.id} className="border-b border-gray-300 hover:bg-gray-50 transition">
                    <td className="pl-10 pr-10 pt-4 pb-4">{post.id}</td>
                    <td className="pl-10 pr-10 pt-4 pb-4">{post.name}</td>
                    <td className="pl-10 pr-10 pt-4 pb-4 text-center">
                      <div className={`${post.status ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"} rounded-2xl`}>
                        {post.status ? "activo" : "inactivo"}
                      </div>
                    </td>
                    <td className="pl-10 pr-10 pt-4 pb-4 flex gap-2 justify-end">
                      <button onClick={() => editCategory(post.id)} className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer">
                        Editar
                      </button>
                      <button onClick={() => toggleStatus(post.id)} className={`${post.status ? "bg-red-500" : "bg-green-500"} text-white px-2 py-1 rounded cursor-pointer`}>
                        {post.status ? "Desactivar" : "Activar"}
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

  export default Categories;