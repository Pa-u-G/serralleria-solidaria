import MainLayout from "../../../layouts/layoutTienda/Main_layout";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return(
    <MainLayout>
      
    </MainLayout>
  )
}

export default Dashboard