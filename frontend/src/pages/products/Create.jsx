import MainLayout from "../../layouts/Main_layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateProduct() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    code: "",
    name: "",
    category_id: "",
    price: "",
    stock: "",
    star: false
  });

  // Estado para categorías
  const [categories, setCategories] = useState([]);

  // Traer categorías de la API
  useEffect(() => {
    axios.get("http://localhost:8000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });

  };

  const submitProduct = (e) => {

    e.preventDefault();

    axios.post("http://localhost:8000/api/create_product", form)
      .then(res => {

        console.log(res.data);

        navigate("/products"); // volver a la lista

      })
      .catch(err => console.log(err));

  };

  return (

    <MainLayout>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Afegir Producte
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-sm">

        <form onSubmit={submitProduct} className="grid grid-cols-2 gap-6">

          
          <div>
            <label className="block text-sm font-medium mb-1">
              Codi
            </label>

            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full" required
            />
          </div>

          
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
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full" required
            >
              <option value="">Selecciona categoria</option>
              {categories.map(cat => (
                cat.status ? <option key={cat.id} value={cat.id}>{cat.name}</option> : ""
              ))}
            </select>
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
              className="border rounded-lg px-4 py-2 w-full" required min={0}
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium mb-1">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full" required min={0}
            />
          </div>

          
          <div className="flex items-center gap-2 mt-6">

            <input
              type="checkbox"
              name="star"
              checked={form.star}
              onChange={handleChange}
            />

            <label>
              Producte destacat
            </label>

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
              Guardar Producte
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
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

export default CreateProduct;