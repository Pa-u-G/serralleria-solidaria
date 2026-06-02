import MainLayout from "../layouts/Main_layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar components de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [packs, setPacks] = useState([]);

  useEffect(() => {
    // Carregar productes
    axios.get("http://localhost:8000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
    
    // Carregar categories
    axios.get("http://localhost:8000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));

    // Carregar packs
    axios.get("http://localhost:8000/api/packs")
      .then(res => setPacks(res.data))
      .catch(err => console.log(err));
  }, []);

  // Calcular estadístiques
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status == 1 || p.status === true).length;
  const inactiveProducts = products.filter(p => p.status == 0 || p.status === false).length;
  const totalPacks = packs.length;
  
  // Productes amb stock baix (<= 5)
  const lowStockProducts = products.filter(p => p.stock <= 5);
  const lowStockCount = lowStockProducts.length;

  // Productes destacats (star = true)
  const starredProducts = products.filter(p => p.star === true).length;

  // Valor real de l'inventari total (preu × stock)
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  // Dades per categoria
  const categoryData = categories.map(cat => {
    const productsInCategory = products.filter(p => p.category_id === cat.id);
    const productCount = productsInCategory.length;
    const inventoryValue = productsInCategory.reduce((sum, p) => sum + (p.price * p.stock), 0);
    return {
      name: cat.name,
      count: productCount,
      value: inventoryValue
    };
  }).filter(cat => cat.count > 0);

  // GRÀFIC 1: Productes per Categoria (Pastís)
  const categoryChartData = {
    labels: categoryData.map(cat => cat.name),
    datasets: [
      {
        label: 'Nombre de Productes',
        data: categoryData.map(cat => cat.count),
        backgroundColor: [
          '#F07057',
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#8B5CF6',
          '#EC4899',
          '#06B6D4',
          '#EF4444',
          '#84CC16',
          '#A855F7',
        ],
        borderWidth: 0,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Productes per Categoria',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw} productes`;
          }
        }
      }
    },
  };

  // GRÀFIC 2: Valor de l'Inventari per Categoria (Barres)
  const inventoryChartData = {
    labels: categoryData.map(cat => cat.name),
    datasets: [
      {
        label: "Valor de l'Inventari (€)",
        data: categoryData.map(cat => cat.value),
        backgroundColor: '#F07057',
        borderRadius: 8,
        barPercentage: 0.7,
      },
    ],
  };

  const inventoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: "Valor de l'Inventari per Categoria",
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `€${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Valor (€)',
        },
        ticks: {
          callback: function(value) {
            return '€' + value.toLocaleString();
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Categories',
        }
      }
    }
  };

  const get_status = (stock) => {
    const status = 
      stock <= 5 ? { text: "Crític", color: "text-red-600", bg: "bg-red-100" } :
      stock <= 15 ? { text: "Baix", color: "text-orange-500", bg: "bg-orange-100" } :
      { text: "Normal", color: "text-green-600", bg: "bg-green-100" };
    return status;
  };

  return (
    <MainLayout>
      <h1 className="text-4xl font-bold text-[#F07057] mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-6">Benvingut al panell de control de Serralleria Solidària</p>

      {/* Targetes d'estadístiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#F07057]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Valor de l'Inventari</p>
              <p className="text-3xl font-bold text-gray-800">€{totalInventoryValue.toLocaleString()}</p>
              <p className="text-gray-500 text-sm mt-2">{totalProducts} productes en stock</p>
            </div>
            <div className="bg-[#F07057]/10 p-3 rounded-full">
              <svg className="w-6 h-6 text-[#F07057]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Productes Totals</p>
              <p className="text-3xl font-bold text-gray-800">{totalProducts}</p>
              <p className="text-green-600 text-sm mt-2">{activeProducts} actius · {inactiveProducts} inactius</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Packs Actius</p>
              <p className="text-3xl font-bold text-gray-800">{totalPacks}</p>
              <p className="text-gray-500 text-sm mt-2">{starredProducts} productes destacats</p>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Stock Baix</p>
              <p className="text-3xl font-bold text-gray-800">{lowStockCount}</p>
              <p className="text-red-600 text-sm mt-2">Requereix atenció</p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-full">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* GRÀFIC 1: Productes per Categoria (Pastís) */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="h-96">
          {categoryData.length > 0 ? (
            <Pie data={categoryChartData} options={categoryChartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No hi ha dades de categories per mostrar
            </div>
          )}
        </div>
      </div>

      {/* GRÀFIC 2: Valor de l'Inventari per Categoria (Barres) */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="h-96">
          {categoryData.length > 0 ? (
            <Bar data={inventoryChartData} options={inventoryChartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No hi ha dades d'inventari per mostrar
            </div>
          )}
        </div>
      </div>

      {/* Taula de productes amb stock baix */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          Productes amb Stock Baix
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 font-medium">Producte</th>
                <th className="p-3 font-medium">Categoria</th>
                <th className="p-3 font-medium">Stock</th>
                <th className="p-3 font-medium">Estat</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map(product => {
                  const status = get_status(product.stock);
                  return (
                    <tr key={product.id} className="border-b border-gray-300 hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{product.name}</td>
                      <td className="p-3 text-gray-500">{product.category?.name}</td>
                      <td className={`p-3 font-semibold ${status.color}`}>{product.stock} unitats</td>
                      <td className="p-3">
                        <span className={`${status.bg} ${status.color} px-3 py-1 rounded-full text-sm font-medium`}>
                          {status.text}
                        </span>
                       </td>
                     </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No hi ha productes amb stock baix
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;