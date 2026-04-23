// pages/store/perfil/Perfil.jsx
import { useAuth } from '../../../contexts/AuthContext';
import './Perfil.scss';

function PerfilCliente() {
  const { user } = useAuth();

  return (
    <div className="perfil-container">
      <h1>El meu perfil</h1>
      
      <div className="perfil-card">
        <div className="perfil-avatar">
          <span>👤</span>
        </div>
        
        <div className="perfil-info">
          <div className="info-group">
            <label>Email:</label>
            <p>{user?.email}</p>
          </div>
          
          <div className="info-group">
            <label>Rol:</label>
            <p>{user?.role === 'admin' ? 'Administrador' : 'Client'}</p>
          </div>
          
          <div className="info-group">
            <label>ID d'usuari:</label>
            <p>{user?.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilCliente;