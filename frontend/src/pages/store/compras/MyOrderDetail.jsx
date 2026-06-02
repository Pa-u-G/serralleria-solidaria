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
      console.error("Error cargando el pedido:", error);
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
      "pendiente": "Pendiente",
      "enviado": "Enviado",
      "en camino": "En camino",
      "recibido": "Recibido / Finalizado"
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
        <div className={styles.loading}>Cargando detalles del pedido...</div>
      </MainLayout>
    );
  }

  if (!order) return null;

  return (
    <MainLayout>
      <div className={styles.detailContainer}>
        <Link to="/my-orders" className={styles.backButton}>
          ← Volver a mis pedidos
        </Link>

        <h1 className={styles.title}>Pedido #{order.id}</h1>

        <div className={styles.card}>
          <h2>Información del pedido</h2>
          <div className={styles.infoGrid}>
            <div>
              <label>Fecha:</label>
              <p>{formatDate(order.created_at)}</p>
            </div>
            <div>
              <label>Instalación:</label>
              <p>{order.install ? "✓ Solicitada" : "✗ No solicitada"}</p>
            </div>
            <div>
              <label>Estado:</label>
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
          <h2>Productos</h2>
          <div className={styles.productsTable}>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Extra keys</th>
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
          <h2>Dirección de envío</h2>
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