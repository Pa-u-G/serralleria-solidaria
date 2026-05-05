// pages/solutions/SolutionDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import MainLayout from "../../layouts/Main_layout";
import styles from "./SolutionDetail.module.scss";

function SolutionDetail() {
  const { id } = useParams();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const statusOptions = [
    { value: "Pendent de revisar", label: "Pendent de revisar", color: "#f59e0b", bg: "#fef3c7" },
    { value: "Revisat", label: "Revisat", color: "#3b82f6", bg: "#dbeafe" },
    { value: "En procés", label: "En procés", color: "#8b5cf6", bg: "#ede9fe" },
    { value: "Finalitzat", label: "Finalitzat", color: "#10b981", bg: "#d1fae5" }
  ];

  useEffect(() => {
    fetchSolution();
  }, [id]);

  const fetchSolution = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/solutions-admin/${id}`);
      setSolution(response.data);
      setSelectedStatus(response.data.status);
      setLoading(false);
    } catch (error) {
      console.error("Error carregant la solució:", error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await axios.put(`http://localhost:8000/api/solutions-admin/${id}`, {
        status: newStatus
      });
      setSelectedStatus(newStatus);
      setSolution({ ...solution, status: newStatus });
    } catch (error) {
      console.error("Error actualitzant l'estat:", error);
    } finally {
      setUpdating(false);
    }
  };

  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/solutions-admin/download-file/${fileId}`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descarregant l'arxiu:", error);
    }
  };

  const getStatusStyle = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option || { color: "#666", bg: "#e5e7eb" };
  };

  if (loading) {
    return (
      <MainLayout>
        <div className={styles.loading}>Carregant detalls...</div>
      </MainLayout>
    );
  }

  if (!solution) {
    return (
      <MainLayout>
        <div className={styles.notFound}>
          <h2>No s'ha trobat la sol·licitud</h2>
          <Link to="/admin/solutions">Tornar al llistat</Link>
        </div>
      </MainLayout>
    );
  }

  const isImage = (fileType, fileName) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const ext = fileName.split('.').pop().toLowerCase();
    return imageExtensions.includes(ext);
  };

  const statusStyle = getStatusStyle(selectedStatus);

  return (
    <MainLayout>
      <div className={styles.detailContainer}>
        <div className={styles.header}>
          <Link to="/admin/solutions" className={styles.backButton}>
            ← Tornar al llistat
          </Link>
        </div>

        <div className={styles.content}>
          {/* Informació de l'usuari */}
          <div className={styles.card}>
            <h2>Informació del client</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Nom complet:</label>
                <p>{solution.name} {solution.surname}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Email:</label>
                <p>{solution.email}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Telèfon:</label>
                <p>{solution.phone_number}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Data de sol·licitud:</label>
                <p>{new Date(solution.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Problema i descripció */}
          <div className={styles.card}>
            <h2>Detalls del problema</h2>
            <div className={styles.infoItem}>
              <label>Títol del problema:</label>
              <p className={styles.issueTitle}>{solution.issue}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Descripció:</label>
              <p className={styles.description}>{solution.description}</p>
            </div>
          </div>

          {/* Imatges */}
          {solution.images && solution.images.length > 0 && (
            <div className={styles.card}>
              <h2>Arxius adjunts ({solution.images.length})</h2>
              <div className={styles.imagesGrid}>
                {solution.images.map((img) => (
                  <div key={img.id} className={styles.imageCard}>
                    {isImage(img.file_type, img.name_img) ? (
                      <img 
                        src={`http://localhost:8000/storage/${img.path}`} 
                        alt={img.name_img}
                      />
                    ) : (
                      <div className={styles.documentPreview}>
                        <div className={styles.pdfIcon}>📄</div>
                        <span className={styles.fileName}>{img.name_img}</span>
                      </div>
                    )}
                    <button 
                      onClick={() => downloadFile(img.id, img.name_img)}
                      className={styles.downloadBtn}
                    >
                      📥 Descarregar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estat */}
          <div className={styles.card}>
            <h2>Estat de la sol·licitud</h2>
            <div className={styles.statusSection}>
              <div 
                className={styles.currentStatus}
                style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
              >
                Estat actual: {selectedStatus}
              </div>
              
              <div className={styles.statusOptions}>
                <label>Canviar estat:</label>
                <div className={styles.statusButtons}>
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`${styles.statusBtn} ${selectedStatus === option.value ? styles.active : ''}`}
                      style={{ backgroundColor: option.bg, color: option.color }}
                      onClick={() => handleStatusChange(option.value)}
                      disabled={updating}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default SolutionDetail;