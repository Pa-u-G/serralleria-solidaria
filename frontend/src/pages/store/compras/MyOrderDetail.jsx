import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import MainLayout from "../../../layouts/layoutTienda/Main_layout_tienda";
import styles from "./MyOrderDetail.module.scss";
import { generateAlbaranPDF } from "../../../components/AlbaranPDF";

function MyOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8000/api/my-orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data);
    } catch (error) {
      console.error("Error carregant la comanda:", error);
      navigate("/my-orders");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("es-ES");
  };

  const formatPrice = (price) => {
    const num = typeof price === 'number' ? price : parseFloat(price) || 0;
    return num.toFixed(2);
  };

  const getStatusText = (status) => {
    const map = {
      "pendiente": "Pendent",
      "enviado": "Enviat",
      "en camino": "En camí",
      "recibido": "Rebut / Finalitzat"
    };
    return map[status] || status;
  };

  const getStatusClass = (status) => {
    const map = {
      "pendiente": "pending",
      "enviado": "shipped",
      "en camino": "in_transit",
      "recibido": "delivered"
    };
    return map[status] || "pending";
  };

  if (loading) {
    return (
      <MainLayout>
        <div className={styles.loading}>Carregant els detalls de la comanda...</div>
      </MainLayout>
    );
  }

  if (!order) return null;

  return (
    <MainLayout>
      <div className={styles.detailContainer}>
        <Link to="/my-orders" className={styles.backButton}>
          ← Tornar a les meves comandes
        </Link>

        <h1 className={styles.title}>Comanda #{order.id}</h1>

        <div className={styles.card}>
          <h2>Informació de la comanda</h2>
          <div className={styles.infoGrid}>
            <div>
              <label>Data:</label>
              <p>{formatDate(order.created_at)}</p>
            </div>
            <div>
              <label>Instal·lació:</label>
              <p>{order.install ? "✓ Sol·licitada" : "✗ No sol·licitada"}</p>
            </div>
            <div>
              <label>Estat:</label>
              <p className={`${styles.status} ${styles[`status--${getStatusClass(order.status)}`]}`}>
                {getStatusText(order.status)}
              </p>
            </div>
            <div>
              <label>Total:</label>
              <p className={styles.total}>€{formatPrice(order.total_price)}</p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Productes</h2>
          <div className={styles.productsTable}>
            <table>
              <thead>
                <tr>
                  <th>Producte</th>
                  <th>Quantitat</th>
                  <th>Preu unitari</th>
                  <th>Claus extra</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.details?.map((detail) => {
                  const price = parseFloat(detail.product?.price) || 0;
                  const subtotal = price * detail.quantity;
                  return (
                    <tr key={detail.id}>
                      <td>{detail.product?.name || "-"}</td>
                      <td>{detail.quantity}</td>
                      <td>€{formatPrice(price)}</td>
                      <td>{detail.extra_key || 0}</td>
                      <td>€{formatPrice(subtotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Adreça d'enviament</h2>
          <p>{order.direction?.name} {order.direction?.surnames}</p>
          <p>{order.direction?.address}</p>
          <p>{order.direction?.postal_code} - {order.direction?.city}</p>
          <p>Tel: {order.direction?.phone_number}</p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={() => generateAlbaranPDF(order)} className={styles.pdfButton}>
            📄 Descarregar Albarà (PDF)
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default MyOrderDetail;