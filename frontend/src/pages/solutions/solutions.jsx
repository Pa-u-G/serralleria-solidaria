import MainLayout from "../../layouts/Main_layout";
import { useEffect, useState } from "react";
import styles from "./solutions.module.scss";
import axios from "axios";

function Solutions() {
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/solutions-admin")
      .then(res => setSolutions(res.data))
      .catch(err => console.log(err));
  }, []);
  return (
    <MainLayout>
      <div className={styles["solutions-table-container"]}>
        <div className={styles["solutions-table"]}>
          {/* Capçalera */}
          <div className={styles["solutions-table__header"]}>
            <div className={styles["solutions-table__cell"]}>Nom</div>
            <div className={styles["solutions-table__cell"]}>Cognom</div>
            <div className={styles["solutions-table__cell"]}>Email</div>
            <div className={styles["solutions-table__cell"]}>Telèfon</div>
            <div className={styles["solutions-table__cell"]}>Problema</div>
            <div className={styles["solutions-table__cell"]}>Estat</div>
          </div>

          {/* Cos de la taula */}
          <div className={styles["solutions-table__body"]}>
            {solutions.length > 0 ? (
              solutions.map(solution => (
                <div key={solution.id} className={styles["solutions-table__row"]}>
                  <div className={styles["solutions-table__cell"]}>{solution.name}</div>
                  <div className={styles["solutions-table__cell"]}>{solution.surname}</div>
                  <div className={styles["solutions-table__cell"]}>{solution.email}</div>
                  <div className={styles["solutions-table__cell"]}>{solution.phone_number}</div>
                  <div className={styles["solutions-table__cell"]}>{solution.issue}</div>
                  <div className={styles["solutions-table__cell"]}>
                    <span className={`${styles["solutions-table__status"]} ${styles[`solutions-table__status--${solution.status.toLowerCase().replace(' ', '_')}`]}`}>
                      {solution.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles["solutions-table__empty"]}>
                No hi ha solucions per mostrar
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Solutions