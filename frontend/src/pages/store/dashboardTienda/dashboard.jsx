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
  const popularProducts = products.filter(product => product.stock > 80 && product.status == true);
  const banners = [
    {
      id: 1,
      image: banner2
    },
    {
      id: 2,
      image: banner1,
      title: "Solucions Personalitzades",
      subtitle: "Si tens dubtes contacta amb nosaltres",
      button: "Contacte'm",
      link: "/novedades",
      overlayColor: "rgba(0,0,0,0.4)"
    },
    {
      id: 3,
      image: banner3
    }
  ];
  return(
    <MainLayout>

      <BannerCarousel banners={banners} />
      
      <section className={styles.productsDestacados}>
        <h1>Productos destacados</h1>
        
        {featuredProducts.length > 0 ? (
          <Carousel products={featuredProducts} limit={10} />
        ) : (
          <div className={styles.emptyState}>
            <div className={`${styles.emptyIcon} category-box`}>
                <svg>
                    <use href="#icon-box?"></use>
                </svg>
            </div>
            <h3>No hay productos destacados disponibles</h3>
          </div>
        )}
        
      </section>

      <section className={styles.bannersCard}>
        <img src={miniBanner1} alt="Prueba" />
        <img src={miniBanner2} alt="Prueba" />
        <img src={miniBanner3} alt="Prueba" />
      </section>
          
      <section className={styles.productsPopular}>
        <h1>Productos Populares</h1>
        
        {popularProducts.length > 0 ? (
          <Products products={popularProducts} limit={20} />
        ) : (
          <div className={styles.emptyState}>
            <div className={`${styles.emptyIcon} category-box`}>
                <svg>
                    <use href="#icon-box?"></use>
                </svg>
            </div>
            <h3>No hay productos populares disponibles</h3>
          </div>
        )}
      </section>
    </MainLayout>
  )
}

export default Dashboard