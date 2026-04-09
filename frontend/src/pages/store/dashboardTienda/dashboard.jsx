import MainLayout from "../../../layouts/layoutTienda/Main_layout_tienda";
import { useEffect, useState } from "react";
import axios from "axios";
//import ProductGrid from '../components/productGrid/ProductGrid';
import Carousel from '../components/carousel/Carousel';
import styles from './dashboard.module.scss';

function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);
  const featuredProducts = products.filter(product => product.star === 1 && product.status == true);
  const longitud = featuredProducts.length;
  console.log(longitud);
  return(
    <MainLayout>
      <h1>Productos destacados</h1>
      
      {featuredProducts.length > 0 ? (
        <Carousel products={featuredProducts} limit={10} />
      ) : (
        <div className={styles.emptyState}>
          <p>Actualmente no hay productos destacados</p>
        </div>
      )}
      
    </MainLayout>
  )
}

export default Dashboard