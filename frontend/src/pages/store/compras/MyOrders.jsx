import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MainLayout from "../../../layouts/layoutTienda/Main_layout_tienda";
import styles from "./MyOrders.module.scss";

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/my-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/my-orders/${id}`);
  };

  const getStatusClass = (status) => {
    const statusMap = {
      "pendiente": "pending",
      "enviado": "shipped",
      "en camino": "in_transit",
      "recibido": "delivered"
    };
    return statusMap[status] || "pending";
  };

  const getStatusText = (status) => {
    const statusMap = {
      "pendiente": "Pendiente",
      "enviado": "Enviado",
      "en camino": "En camino",
      "recibido": "Recibido / Finalizado"
    };
    return statusMap[status] || status;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-ES");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className={styles.loading}>Cargando tus pedidos...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles["orders-container"]}>
        <h1 className={styles.title}>Mis Pedidos</h1>

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <p>No has realizado ningún pedido todavía.</p>
            <button onClick={() => navigate("/tienda")} className={styles.shopBtn}>
              Ir a la tienda
            </button>
          </div>
        ) : (
          <div className={styles["orders-table"]}>
            <div className={styles["orders-table__header"]}>
              <div>ID</div>
              <div>Fecha</div>
              <div>Total</div>
              <div>Instalación</div>
              <div>Estado</div>
            </div>

            <div className={styles["orders-table__body"]}>
              {orders.map(order => (
                <div 
                  key={order.id} 
                  className={`${styles["orders-table__row"]} ${styles[`row--${getStatusClass(order.status)}`]}`}
                  onClick={() => handleRowClick(order.id)}
                >
                  <div>#{order.id}</div>
                  <div>{formatDate(order.created_at)}</div>
                  <div>€{order.total_price || "0.00"}</div>
                  <div>{order.install ? "✓ Sí" : "✗ No"}</div>
                  <div>
                    <span className={`${styles.status} ${styles[`status--${order.status}`]}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default MyOrders;