import MainLayout from "../../../layouts/layoutTienda/Main_layout_tienda";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./solutions.module.scss";
import img from "./prueba.jpg"

function Solutions() {
  const [details, setDetails] = useState("");
  const maxDetails = 1500;
  const [files, setFiles] = useState([]);
  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    const total = [...files, ...selected].slice(0, 3);

    setFiles(total);

    if (selected.length + files.length > 3) {
      alert("Solo puedes subir un máximo de 3 imágenes");
    }
  };
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  return (
    <MainLayout>
      <div className={styles.layoutFlex}>
        <img src={img} alt="Imagen de puerta arreglandose"/>
      
        <div className={styles.formSolutions}>
          
          <h1>Solucions personalitzades</h1>
          <form action="">
            <section className={styles.personalInfo}>
              <div>
                <label htmlFor="name">Nom*</label><br />
                <input type="text" name="name" placeholder="Escriu el teu nom" required maxLength={20}/>
              </div>
              <div>
                <label htmlFor="surname">Cognoms *</label><br />
                <input type="text" name="surname" placeholder="Escriu el teu cognom" required maxLength={30}/>
              </div>
            </section>
            <section className={styles.contactInfo}>
              <div>
                <label htmlFor="email">Correu electronic *</label><br />
                <input type="email" name="email" placeholder="Escriu el teu correu electronic" required />
              </div>
              <div>
                <label htmlFor="phoneNumber">Telefon *</label><br />
                <input type="number" name="phoneNumber" placeholder="Escriu el teu telefon de contacte" required maxLength={9}/>
              </div>
            </section>
            <section className={styles.issue}>
              <div>
                <label htmlFor="titleIssue">Titol del problema *</label><br />
                <input type="text" name="titleIssue" placeholder="Escriu un petit titol" required maxLength={20}/>
              </div>
            </section>
            <div className={styles.textareaWrapper}>
              <label htmlFor="detailsIssue">Detalls *</label><br />
              <textarea type="number" name="detailsIssue" placeholder="Escriu detalladament el problema" required maxLength={maxDetails} value={details} onChange={(e) => setDetails(e.target.value)}></textarea>
              <div className={styles.counter}>
                {details.length} / {maxDetails}
              </div>
            </div>
            <div className={styles.uploadWrapper}>
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
                {files.map((file, index) => (
                  <div key={index} className={styles.previewItem}>
                    <img src={URL.createObjectURL(file)} alt="preview" />

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
              <button type="submit" className={styles.primary}>
                Enviar
              </button>

              <button type="reset" className={styles.secondary}>
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