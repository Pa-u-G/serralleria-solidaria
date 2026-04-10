import MainLayout from "../../../layouts/layoutTienda/Main_layout_tienda";
import { useEffect, useState } from "react";
import axios from "axios";
import BannerCarousel from '../components/heroCarousel/carouselBanners';
import Carousel from '../components/carousel/Carousel';
import styles from './dashboard.module.scss';
import banner1 from "./bannersCarousel/banner1.jpg";
import banner2 from "./bannersCarousel/banner2.jpg";
import banner3 from "./bannersCarousel/banner3.jpg";
import miniBanner1 from "./bannersCard/miniBanner1.jpg";
import miniBanner2 from "./bannersCard/miniBanner2.jpg";
import miniBanner3 from "./bannersCard/miniBanner3.jpg";
import Products from '../components/productGrid/ProductGrid';

function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);
  const featuredProducts = products.filter(product => product.star === 1 && product.status == true);
  const selledProducts = products.filter(product => product.stock > 80 && product.status == true);
  const banners = [
    { id: 1, url: banner1 },
    { id: 2, url: banner2 },
    { id: 3, url: banner3 },
  ];
  return(
    <MainLayout>

      
      <BannerCarousel banners={banners} />
      


      <section className={styles.productsDestacados}>
        <h1>Productos destacados</h1>
        <div>
          {featuredProducts.length > 0 ? (
            <Carousel products={featuredProducts} limit={10} />
          ) : (
            <div className={styles.emptyState}>
              <p>Actualmente no hay productos destacados</p>
            </div>
          )}
        </div>
      </section>

      <section className={styles.bannersCard}>
        <img src={miniBanner1} alt="Prueba" />
        <img src={miniBanner2} alt="Prueba" />
        <img src={miniBanner3} alt="Prueba" />
      </section>
          
      <section className={styles.productsPopular}>
        <h1>Productos Populares</h1>
        <Products products={products} limit={10} />
      </section>
    </MainLayout>
  )
}

export default Dashboard