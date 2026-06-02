import MainLayout from "../../layouts/Main_layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Orders.module.scss";
import axios from "axios";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error carregant comandes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/admin/orders/${id}`);
  };

  // Funció per obtenir la classe de l'estat
  const getStatusClass = (status) => {
    const statusMap = {
      "pendiente": "pending",
      "enviado": "shipped",
      "en camino": "in_transit",
      "recibido": "delivered"
    };
    return statusMap[status] || "pending";
  };

  // Traducció de l'estat per mostrar
  const getStatusText = (status) => {
    const statusMap = {
      "pendiente": "Pendent",
      "enviado": "Enviat",
      "en camino": "En camí",
      "recibido": "Rebut / Finalitzat"
    };
    return statusMap[status] || status;
  };

  // Formatar data
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ca-ES");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className={styles.loading}>Carregant comandes...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles["orders-table-container"]}>
        <div className={styles["orders-header"]}>
          <h1>Gestió de Comandes</h1>
        </div>

        <div className={styles["orders-table"]}>
          {/* Capçalera */}
          <div className={styles["orders-table__header"]}>
            <div className={styles["orders-table__cell"]}>ID</div>
            <div className={styles["orders-table__cell"]}>Client</div>
            <div className={styles["orders-table__cell"]}>Email</div>
            <div className={styles["orders-table__cell"]}>Total</div>
            <div className={styles["orders-table__cell"]}>Instal·lació</div>
            <div className={styles["orders-table__cell"]}>Data</div>
            <div className={styles["orders-table__cell"]}>Estat</div>
          </div>

          {/* Cos de la taula */}
          <div className={styles["orders-table__body"]}>
            {orders.length > 0 ? (
              orders.map(order => (
                <div 
                  key={order.id} 
                  className={`${styles["orders-table__row"]} ${styles[`row--${getStatusClass(order.status)}`]}`}
                  onClick={() => handleRowClick(order.id)}
                >
                  <div className={styles["orders-table__cell"]}>#{order.id}</div>
                  <div className={styles["orders-table__cell"]}>{order.user?.name || "-"}</div>
                  <div className={styles["orders-table__cell"]}>{order.user?.email || "-"}</div>
                  <div className={styles["orders-table__cell"]}>€{order.total_price || "0.00"}</div>
                  <div className={styles["orders-table__cell"]}>
                    {order.install ? (
                      <span className={styles["install-yes"]}>✓ Sí</span>
                    ) : (
                      <span className={styles["install-no"]}>✗ No</span>
                    )}
                  </div>
                  <div className={styles["orders-table__cell"]}>{formatDate(order.created_at)}</div>
                  <div className={styles["orders-table__cell"]}>
                    <span className={`${styles["orders-table__status"]} ${styles[`orders-table__status--${order.status}`]}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles["orders-table__empty"]}>
                No hi ha comandes per mostrar
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Orders;