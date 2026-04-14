import MainLayout from "../../layouts/Main_layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Pack_create() {

    const [packs, setPacks] = useState([]);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        price: "",
        description: ""
    });

    const submitPack = (e) => {

        e.preventDefault();

        axios.post("http://localhost:8000/api/packs", form)
            .then(res => setPacks([...packs, res.data]))

        navigate("/admin/packs");
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

    };

  return (

    <MainLayout>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Afegir Pack
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-sm">

        <form onSubmit={submitPack} className="grid grid-cols-2 gap-6">

          
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full" required
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium mb-1">
              Preu
            </label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full" required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descripció
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full" required
            ></textarea>
          </div>
          
          <div className="col-span-2 flex gap-4 mt-4">

            <button
              type="submit"
              className="bg-[#F07057] text-white px-5 py-2 rounded-lg font-medium hover:opacity-90"
            >
              Guardar Pack
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/packs")}
              className="bg-gray-200 px-5 py-2 rounded-lg"
            >
              Cancel·lar
            </button>

          </div>

        </form>

      </div>

    </MainLayout>

  );

}

export default Pack_create;