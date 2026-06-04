import MainLayout from "../../layouts/Main_layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams(); // <-- id del producto desde la URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    code: "",
    name: "",
    category_id: "",
    price: "",
    stock: "",
    star: false,
    extra_key: false,
    key_price: "",
    installable: false,
    description: ""
  });

  const [categories, setCategories] = useState([]);
  const [characteristicTypes, setCharacteristicTypes] = useState([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState({});
  useEffect(() => {
    axios.get("http://localhost:8000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
    axios.get("http://localhost:8000/api/characteristics-types")
    .then(res => {
      const activeTypes = res.data.filter(type => type.status);
      setCharacteristicTypes(activeTypes);
    })
    .catch(err => console.log(err));
  }, []);


  // useEffect(() => {
  //   axios.get(`http://localhost:8000/api/products/${id}`)
  //   .then(res => {
  //     const product = res.data;

  //     setForm(product);
  //     setImages(product.images);

  //     const selected = {};

  //     product.characteristics?.forEach(c => {
  //       selected[c.type.id] = c.id; // <-- usar c.type.id
  //     });

  //     setSelectedCharacteristics(selected);
  //   })
  //   .catch(err => console.log(err));
  // }, [id]);
  
  const [images, setImages] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${id}`)
      .then(res => {
        setForm(res.data);
        setImages(res.data.images);
      })
      .catch(err => console.log(err));
  }, [id]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };
  const handleCharacteristicChange = (typeId, value) => {
    setSelectedCharacteristics({
      ...selectedCharacteristics,
      [typeId]: value
    });
  };
  const [newImages, setNewImages] = useState([]);
  const submitProduct = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Convertir tipos para Laravel
    formData.append('code', form.code);
    formData.append('name', form.name);
    formData.append('category_id', form.category_id);
    formData.append('description', form.description);
    formData.append('price', parseFloat(form.price));
    formData.append('stock', parseInt(form.stock));
    formData.append('star', form.star ? 1 : 0);
    formData.append("extra_key", form.extra_key ? 1 : 0);
    formData.append("key_price", form.key_price ? form.key_price : 0);
    formData.append("installable", form.installable ? 1 : 0);


    // Agregar nuevas imágenes
    for (let i = 0; i < newImages.length; i++) {
      formData.append("images[]", newImages[i]);
    }
    Object.values(selectedCharacteristics).forEach(id => {
      if (id) {
        formData.append("characteristics[]", id);
      }
    });
    // Simular PUT porque axios FormData y PUT a veces falla
    formData.append('_method', 'PUT');

    axios.post(`http://localhost:8000/api/edit_product/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(res => {
      setImages(res.data.images); // actualizar imágenes
      setNewImages([]);
      navigate("/admin/products");
    })
    .catch(err => console.log(err.response?.data || err));
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Editar Producte
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={submitProduct} className="grid grid-cols-2 gap-6">

          <div>
            <label htmlFor="code" className="block text-sm font-medium mb-1">Codi</label>
            <input
              type="text"
              name="code"
              id="code"
              value={form.code}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full" required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full" required
            />
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-medium mb-1">Categoria</label>
            <select
              name="category_id"
              id="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full" required
            >
              <option value="">Selecciona categoria</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">Preu</label>
            <input
              type="number"
              name="price"
              id="price"
              value={form.price}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full" required
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              id="stock"
              value={form.stock}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full" required
            />
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              name="star"
              id="star"
              checked={form.star}
              onChange={handleChange}
            />
            <label htmlFor="star">Producte destacat</label>
          </div>
          
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              name="extra_key"
              id="extra_key"
              checked={form.extra_key}
              onChange={handleChange}
            />
            <label htmlFor="extra_key">Clau extra</label>
          </div>

          <div>
            <label htmlFor="key_price" className="block text-sm font-medium mb-1">Preu claus</label>
            <input
              type="number"
              name="key_price"
              id="key_price"
              value={form.key_price}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full"
              min={0}
              step="0.01"
            />
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              name="installable"
              id="installable"
              checked={form.installable}
              onChange={handleChange}
            />
            <label htmlFor="installable">producte instal·lable</label>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Descripció</label>
            <textarea
              name="description"
              id="description"
              value={form.description}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full" required
            ></textarea>
          </div>
          <div className="flex gap-4 flex-wrap mt-4">
            {images.map((img) => (
              <div key={img.id} className="relative">
                <img
                  src={`http://localhost:8000/storage/${img.path}`}
                  width="100"
                  className="rounded border"
                />
                <button
                  type="button"
                  onClick={() => {
                    axios.delete(`http://localhost:8000/api/product_image/${img.id}`)
                      .then(() => setImages(images.filter(i => i.id !== img.id)))
                      .catch(err => console.log(err));
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                >
                  x
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label htmlFor="newImages" className="block text-sm font-medium mb-1">
              Afegir noves imatges
            </label>
            <input
              type="file"
              id="newImages"
              multiple
              onChange={(e) => setNewImages(e.target.files)}
              className="border rounded-lg px-4 py-2 w-full"
            />
          </div>
          {characteristicTypes.map(type => (
            type.status && (
              <div key={type.id}>
                <label htmlFor={type.id} className="block text-sm font-medium mb-1">
                  {type.type}
                </label>

                <select 
                  id={type.id}
                  className="border rounded-lg px-4 py-2 w-full"
                  value={selectedCharacteristics[type.id] || ""}
                  onChange={(e) =>
                    handleCharacteristicChange(type.id, e.target.value)
                  }
                >
                  <option value="">Selecciona {type.type}</option>

                  {type.characteristics
                    ?.filter(c => c.status)
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.description}
                      </option>
                  ))}

                </select>
              </div>
            )
          ))}
          <div className="col-span-2 flex gap-4 mt-4">
            <button
              type="submit"
              className="bg-[#F07057] text-white px-5 py-2 rounded-lg font-medium hover:opacity-90"
            >
              Guardar Canvis
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
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

export default EditProduct;