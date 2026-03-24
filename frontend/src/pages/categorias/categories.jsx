  import MainLayout from "../../layouts/Main_layout";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import "../../styles/categories.scss";

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
      const newName = prompt("Nou nom de la categoria:");
      if (newName) {
        axios.put(`http://localhost:8000/api/categories/${id}`, { name: newName })
          .then(res => {
            setPosts(posts.map(p => p.id === id ? { ...p, name: newName } : p));
          })
          .catch(err => console.log(err));
      }

    };


    // Crear nueva categoría
    const createCategory = () => {
      const name = prompt("Nom de la nova categoria:");
      if (name) {
        axios.post("http://localhost:8000/api/categories", { name })
          .then(res => {
            // Añadimos la nueva categoría a la lista
            setPosts([...posts, res.data]);
          })
          .catch(err => console.log(err));
      }
    };

    useEffect(() => {
      axios.get("http://localhost:8000/api/categories")
        .then(res => setPosts(res.data))
        .catch(err => console.log(err));
    }, []);

    return (
      <MainLayout>
        <div className="categories">

          <div className="categories__header">
            <h1 className="categories__title">Categorias</h1>

            <button
              onClick={createCategory}
              className="categories__add-btn"
            >
              Afegir Categoria
            </button>
          </div>

          <div className="categories__table-box">

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Categoria</th>
                  <th>Estat</th>
                  <th>Accions</th>
                </tr>
              </thead>

              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>

                    <td>{post.id}</td>

                    <td>{post.name}</td>

                    <td>
                      <div
                        className={
                          post.status
                            ? "status status--active"
                            : "status status--inactive"
                        }
                      >
                        {post.status ? "actiu" : "inactiu"}
                      </div>
                    </td>

                    <td className="acction_btn">

                      <button
                        onClick={() => editCategory(post.id)}
                        className="btn btn--edit"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => toggleStatus(post.id)}
                        className={
                          post.status
                            ? "btn btn--off"
                            : "btn btn--on"
                        }
                      >
                        {post.status ? "Desactivar" : "Activa"}
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