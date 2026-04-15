import MainLayout from "../../../layouts/layoutTienda/Main_layout_tienda";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./solutions.module.scss";

function Solutions() {
  
  return (
    <MainLayout>
      <div className={styles.formSolutions}>
        <h1>Solucions personalitzades</h1>
        <form action="">
          <section className={}>
            <div>
              <label htmlFor="name">Nom*</label><br />
              <input type="text" name="name" placeholder="Escriu el teu nom" required/>
            </div>
            <div>
              <label htmlFor="name">Cognoms *</label><br />
              <input type="text" name="surname" placeholder="Escriu el teu cognom" required/>
            </div>
          </section>
          
          
        </form>
      </div>
      
    </MainLayout>
  )
}

export default Solutions