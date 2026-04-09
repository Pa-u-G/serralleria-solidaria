import MainLayout from "../../../layouts/layoutTienda/Main_layout_tienda";
import { useEffect, useState } from "react";
import axios from "axios";
//import ProductGrid from '../components/productGrid/ProductGrid';
import Carousel from '../components/carousel/Carousel';

function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return(
    <MainLayout>
      <Carousel products={products} limit={10} />
      
    </MainLayout>
  )
}

export default Dashboard