import MainLayout from "../../../layouts/layoutTienda/Main_layout_tienda";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./solutions.module.scss";
import img from "./prueba.jpg"

function Solutions() {
  const navigate = useNavigate();
  const maxDetails = 1500;
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone_number: "",
    issue: "",
  });

  const [details, setDetails] = useState("");
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Generar URLs quan els fitxers canvien
  useEffect(() => {
    // Netejar URLs anteriors
    imageUrls.forEach(url => URL.revokeObjectURL(url));
    
    // Crear noves URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setImageUrls(urls);
    
    // Netejar quan es desmonta el component
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);
  
  const addFiles = (newFiles) => {
    setFiles(prev => {
      const total = [...prev, ...newFiles].slice(0, 3);

      if (prev.length + newFiles.length > 3) {
        alert("Solo puedes subir un máximo de 3 imágenes");
      }

      return total;
    });
  };
  
  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    addFiles(selected);
    e.target.value = "";
  };
  
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files || []);
    addFiles(dropped);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();

    data.append("name", form.name);
    data.append("surname", form.surname);
    data.append("email", form.email);
    data.append("phone_number", form.phone_number);
    data.append("issue", form.issue);
    data.append("description", details);

    files.forEach((file) => {
      data.append("images[]", file);
    });

    try {
      await axios.post("http://localhost:8000/api/solutions", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Mostrar missatge d'èxit
      setShowSuccess(true);
      
      // Redirigir a la pàgina principal després de 3 segons
      setTimeout(() => {
        navigate("/");
      }, 3000);
      
    } catch (error) {
      console.error("Error enviant el formulari:", error);
      alert("Hi ha hagut un error. Si us plau, torna a intentar-ho.");
      setLoading(false);
    }
  };
  
  // Si s'ha enviat correctament, mostrar la targeta d'èxit
  if (showSuccess) {
    return (
      <MainLayout>
        <div className={styles.successContainer}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✅</div>
            <h2>Sol·licitud enviada correctament!</h2>
            <p>Gràcies per contactar amb nosaltres.</p>
            <p>En breu ens posarem en contacte amb tu per donar solució al teu problema.</p>
            <div className={styles.successLoader}>
              <div className={styles.spinner}></div>
              <p>Redirigint a la pàgina principal...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className={styles.layoutFlex}>
        <img src={img} alt="Imagen de puerta arreglandose"/>
      
        <div className={styles.formSolutions}>
          
          <h1>Solucions personalitzades</h1>
          <form onSubmit={handleSubmit}>
            <section className={styles.personalInfo}>
              <div>
                <label htmlFor="name">Nom*</label><br />
                <input type="text" name="name" placeholder="Escriu el teu nom" required maxLength={20} onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }/>
              </div>
              <div>
                <label htmlFor="surname">Cognoms *</label><br />
                <input type="text" name="surname" placeholder="Escriu el teu cognom" required maxLength={30} onChange={(e) =>
                setForm({ ...form, surname: e.target.value })
              }/>
              </div>
            </section>
            <section className={styles.contactInfo}>
              <div>
                <label htmlFor="email">Correu electronic *</label><br />
                <input type="email" name="email" placeholder="Escriu el teu correu electronic" required onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }/>
              </div>
              <div>
                <label htmlFor="phoneNumber">Telefon *</label><br />
                <input type="tel" name="phone_number" placeholder="Escriu el teu telefon de contacte" required pattern="[0-9]{9}" onChange={(e) =>
                setForm({ ...form, phone_number: e.target.value })
              }/>
              </div>
            </section>
            <section className={styles.issue}>
              <div>
                <label htmlFor="issue">Titol del problema *</label><br />
                <input type="text" name="issue" placeholder="Escriu un petit titol" required maxLength={20} onChange={(e) =>
                setForm({ ...form, issue: e.target.value })
              }/>
              </div>
            </section>
            <div className={styles.textareaWrapper}>
              <label htmlFor="description">Detalls *</label><br />
              <textarea name="description" placeholder="Escriu detalladament el problema" required maxLength={maxDetails} value={details} onChange={(e) => setDetails(e.target.value)}></textarea>
              <div className={styles.counter}>
                {details.length} / {maxDetails}
              </div>
            </div>
            <div className={`${styles.uploadWrapper} ${isDragging ? styles.dragging : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}>
              <label className={styles.uploadLabel}>
                📎 Subir imágenes (máx 3)
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFiles}
                />
              </label>

              <div className={styles.preview}>
                {imageUrls.map((url, index) => (
                  <div key={index} className={styles.previewItem}>
                    <img 
                      src={url} 
                      alt={`preview-${index}`}
                      onError={(e) => console.log('Error carregant imatge:', e)}
                      onLoad={() => console.log('Imatge carregada:', url)}
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.actions}>
              <button type="submit" className={styles.primary} disabled={loading}>
                {loading ? "Enviant..." : "Enviar"}
              </button>

              <button type="reset" className={styles.secondary} onClick={() => {
                setForm({
                  name: "",
                  surname: "",
                  email: "",
                  phone_number: "",
                  issue: "",
                });
                setDetails("");
                setFiles([]);
              }}>
                Borrar
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </MainLayout>
  )
}

export default Solutions