import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import MainLayout from "../../layouts/Main_layout";
import styles from "./OrderDetail.module.scss";
import { generateAlbaranPDF } from "../../components/AlbaranPDF";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const statusOptions = [
    { value: "pendiente", label: "Pendiente", color: "#d97706", bg: "#fef3c7" },
    { value: "enviado", label: "Enviado", color: "#2563eb", bg: "#dbeafe" },
    { value: "en camino", label: "En camino", color: "#7c3aed", bg: "#ede9fe" },
    { value: "recibido", label: "Recibido / Finalizado", color: "#059669", bg: "#d1fae5" }
  ];

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/orders/${id}`);
      setOrder(response.data);
      setSelectedStatus(response.data.status);
    } catch (error) {
      console.error("Error cargando el pedido:", error);
      if (error.response?.status === 404) {
        navigate("/admin/orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await axios.put(`http://localhost:8000/api/admin/orders/${id}`, {
        status: newStatus
      });
      setSelectedStatus(newStatus);
      setOrder({ ...order, status: newStatus });
    } catch (error) {
      console.error("Error actualizando el estado:", error);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("es-ES");
  };

  const getStatusStyle = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option || { color: "#666", bg: "#e5e7eb" };
  };

  const calculateSubtotal = () => {
    if (!order?.details) return 0;
    return order.details.reduce((sum, detail) => {
      const price = detail.product?.price || 0;
      return sum + (price * detail.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className={styles.loading}>Cargando detalles del pedido...</div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className={styles.notFound}>
          <h2>No se ha encontrado el pedido</h2>
          <Link to="/admin/orders">Volver al listado</Link>
        </div>
      </MainLayout>
    );
  }

  const statusStyle = getStatusStyle(selectedStatus);
  const subtotal = calculateSubtotal();

  return (
    <MainLayout>
      <div className={styles.detailContainer}>
        <div className={styles.header}>
          <Link to="/admin/orders" className={styles.backButton}>
            ← Volver al listado
          </Link>
          <h1>Pedido #{order.id}</h1>
        </div>

        <div className={styles.content}>
          {/* Información del pedido */}
          <div className={styles.card}>
            <h2>Información del pedido</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Fecha del pedido:</label>
                <p>{formatDate(order.created_at)}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Instalación solicitada:</label>
                <p>{order.install ? "✓ Sí" : "✗ No"}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Cliente:</label>
                <p>{order.user?.name || "-"}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Email:</label>
                <p>{order.user?.email || "-"}</p>
              </div>
            </div>
          </div>

          {/* Productos del pedido */}
          <div className={styles.card}>
            <h2>Productos / Packs</h2>
            <div className={styles.productsTable}>
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Precio unitario</th>
                    <th>Cantidad</th>
                    <th>Extra keys</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.details?.map((detail) => {
                    const price = parseFloat(detail.product?.price) || 0;
                    const subtotalItem = price * detail.quantity;
                    return (
                      <tr key={detail.id}>
                        <td>{detail.product?.name || "-"}</td>
                        <td>
                          <span className={detail.product_type === "App\\Models\\Product" ? styles.productType : styles.packType}>
                            {detail.product_type === "App\\Models\\Product" ? "Producto" : "Pack"}
                          </span>
                        </td>
                        <td>€{price.toFixed(2)}</td>
                        <td>{detail.quantity}</td>
                        <td>{detail.extra_key || 0}</td>
                        <td>€{subtotalItem.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" className={styles.totalLabel}>Total:</td>
                    <td className={styles.totalValue}>€{order.total_price || subtotal.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Direcciones */}
          <div className={styles.card}>
            <h2>Direcciones</h2>
            <div className={styles.addressesGrid}>
              <div className={styles.addressBox}>
                <h3>📦 Dirección de envío</h3>
                <p>{order.direction?.name} {order.direction?.surnames}</p>
                <p>{order.direction?.address}</p>
                <p>{order.direction?.postal_code} - {order.direction?.city}</p>
                <p>Tel: {order.direction?.phone_number}</p>
                <p>NIF: {order.direction?.nif}</p>
              </div>
              <div className={styles.addressBox}>
                <h3>💰 Dirección de facturación</h3>
                <p>{order.facturation?.name} {order.facturation?.surnames}</p>
                <p>{order.facturation?.address}</p>
                <p>{order.facturation?.postal_code} - {order.facturation?.city}</p>
                <p>Tel: {order.facturation?.phone_number}</p>
                <p>NIF: {order.facturation?.nif}</p>
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className={styles.card}>
            <h2>Estado del pedido</h2>
            <div className={styles.statusSection}>
              <div 
                className={styles.currentStatus}
                style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
              >
                Estado actual: {statusStyle.label}
              </div>
              
              <div className={styles.statusOptions}>
                <label>Cambiar estado:</label>
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
          <button onClick={() => generateAlbaranPDF(order)} className={styles.pdfButton}>
            📄 Descarregar Albarà (PDF)
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default OrderDetail;