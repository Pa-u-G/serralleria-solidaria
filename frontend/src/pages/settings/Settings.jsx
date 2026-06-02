import MainLayout from "../../layouts/Main_layout";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/settings.scss";

function Settings() {
  const [posts, setPosts] = useState([]);

  const editCategory = (id) => {
    const newName = prompt("Nou nom de la categoria:");
    if (newName) {
      axios.put(`http://localhost:8000/api/settings/${id}`, { name: newName })
        .then(res => {
          setPosts(posts.map(p => p.id === id ? { ...p, name: newName } : p));
        })
        .catch(err => console.log(err));
    }
  };

  const editarPreu = (e) => {
    e.preventDefault();
    let id = e.target.id;
    let preu = document.getElementById(`p_${id}`).value;
    if (preu != "") {
      axios.put(`http://localhost:8000/api/settings/${id}`, { value: preu })
        .then(res => {
          setPosts(posts.map(p => p.id === id ? { ...p, value: preu } : p));
        })
        .catch(err => console.log(err));
    } else {
      alert("Si us plau, no deixis l'input en blanc");
    }
  };

  useEffect(() => {
    axios.get("http://localhost:8000/api/settings")
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <MainLayout>
      <div className="settings">

        <div className="categories__header">
          <h1 className="categories__title">Configuració</h1>
          <div>Nota: posar un preu menor a 0 per activar l'opció de "consultar preu instal·lació"</div>
        </div>

        <div className="categories__table-box">

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Configuració</th>
                <th>Preu per defecte (€)</th>
                <th>Preu (€)</th>
              </tr>
            </thead>

            <tbody>
              {posts.map(post => (
                <tr key={post.id}>

                  <td>{post.id}</td>

                  <td>{post.desc}</td>

                  <td>{post.default}</td>

                  <td className="acction_btn">
                    <form onSubmit={editarPreu} id={post.id}>
                      <input required type="number" className="precio" id={`p_${post.id}`} defaultValue={post.value} />
                      <button type="submit">Actualitzar</button>
                    </form>
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

export default Settings;