import MainLayout from "../../layouts/Main_layout";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Pack_create() {
    const navigate = useNavigate();
    const [images, setImages] = useState([]); // Estado para las imágenes
    
    const [form, setForm] = useState({
        name: "",
        price: "",
        description: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const submitPack = (e) => {
        e.preventDefault();

        // Crear FormData para enviar archivos
        const formData = new FormData();
        
        // Añadir datos del formulario
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('price', parseFloat(form.price));
        
        // Añadir imágenes
        for (let i = 0; i < images.length; i++) {
            formData.append("images[]", images[i]);
        }

        // Enviar con multipart/form-data
        axios.post("http://localhost:8000/api/packs", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(res => {
            navigate("/admin/packs");
        })
        .catch(err => {
            if (err.response && err.response.data) {
                console.log("Errores de validación:", err.response.data);
                alert("Hi ha errors a les dades enviades. Revisa la consola.");
            }
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
                            min={0}
                            step="0.01"
                        />
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
                            rows="4"
                        />
                    </div>

                    {/* Campo para subir imágenes */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">
                            Imatges del Pack
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setImages(e.target.files)}
                            className="border rounded-lg px-4 py-2 w-full"
                        />
                        {images.length > 0 && (
                            <p className="text-sm text-gray-500 mt-2">
                                {images.length} imatge(s) seleccionada(s)
                            </p>
                        )}
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