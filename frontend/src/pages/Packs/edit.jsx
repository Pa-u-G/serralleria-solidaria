import MainLayout from "../../layouts/Main_layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function Pack_edit() {
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    price: "",
    extra_key: false,
    key_price: "",
    installable: false,
    description: ""
  });
  
  // cargar pack
  useEffect(() => {
    axios.get(`http://localhost:8000/api/packs/${id}`)
    .then(res => {
      
      const pack = res.data;
      setImages(pack.images);

        setForm({
          name: pack.name,
          price: pack.price,
          description: pack.description,
          extra_key: pack.extra_key,
          key_price: pack.key_price,
          installable: pack.installable
        });

      })
      .catch(err => console.log(err));
  }, [id]);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

  };


  const submitPack = (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', parseFloat(form.price));
    formData.append("extra_key", form.extra_key ? 1 : 0);
    formData.append("key_price", form.key_price ? form.key_price : 0);
    formData.append("installable", form.installable ? 1 : 0);

    for (let i = 0; i < newImages.length; i++) {
        formData.append("images[]", newImages[i]);
    }
    
    formData.append('_method', 'PUT');

    axios.post(`http://localhost:8000/api/packs/${id}`, formData)
        .then(res => {
            console.log(res.data);
            setImages(res.data.images);
            setNewImages([]);
            navigate("/admin/packs");
        })
        .catch(err => console.log(err));
};


  return (

    <MainLayout>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Editar Pack
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
              className="border rounded-lg px-4 py-2 w-full"
              required
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
              className="border rounded-lg px-4 py-2 w-full"
              required
            />
          </div>

          <div className="flex items-center gap-2 mt-6">
              <input
              type="checkbox"
              name="extra_key"
              checked={form.extra_key}
              onChange={handleChange}
              />
              <label>Clau extra</label>
          </div>

          <div>
              <label className="block text-sm font-medium mb-1">Preu claus</label>
              <input
              type="number"
              name="key_price"
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
              checked={form.installable}
              onChange={handleChange}
              />
              <label>producte instal·lable</label>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Descripció
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full"
              required
            />
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
                    axios.delete(`http://localhost:8000/api/packs/image/${img.id}`)
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
            <label className="block text-sm font-medium mb-1">
              Afegir noves imatges
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setNewImages(e.target.files)}
              className="border rounded-lg px-4 py-2 w-full"
            />
          </div>

          <div className="col-span-2 flex gap-4 mt-4">

            <button
              type="submit"
              className="bg-[#F07057] text-white px-5 py-2 rounded-lg font-medium hover:opacity-90"
            >
              Guardar Canvis
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

export default Pack_edit;