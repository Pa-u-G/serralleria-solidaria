/*// pages/store/compras/MisCompras.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import './MisCompras.scss';

function MisCompras() {
  const { user } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí faràs la petició al teu backend per obtenir les comandes de l'usuari
    axios.get(`http://localhost:8000/api/user/orders`)
      .then(res => {
        setCompras(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Carregant les teves compres...</div>;
  }

  return (
    <div className="mis-compras-container">
      <h1>Les meves compres</h1>
      
      {compras.length === 0 ? (
        <div className="empty-compras">
          <span>🛒</span>
          <p>Encara no has fet cap compra</p>
          <button onClick={() => window.location.href = '/'}>Començar a comprar</button>
        </div>
      ) : (
        <div className="compras-list">
          {compras.map(compra => (
            <div key={compra.id} className="compra-card">
              <div className="compra-header">
                <span className="compra-id">Comanda #{compra.id}</span>
                <span className="compra-date">{new Date(compra.created_at).toLocaleDateString()}</span>
              </div>
              <div className="compra-total">
                <strong>Total:</strong> {compra.total}€
              </div>
              <div className="compra-status">
                <span className={`status ${compra.status}`}>{compra.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisCompras;*/