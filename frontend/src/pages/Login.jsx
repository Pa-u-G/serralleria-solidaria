// pages/Login.jsx
import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom'; // ← Afegir Navigate
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Login.scss';

function Login() {
  const { isAuthenticated, user, login } = useAuth(); // ← Juntar tot en una línia
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Configurar axios
  axios.defaults.baseURL = 'http://localhost:8000/api';

  // Si ja està loguejat, redirigeix
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace />;
  }

  // De quin lloc ve? (per redirigir després)
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/login', {
        email,
        password
      });

      const { token, user: userData, role } = response.data; // ← canviar nom per evitar conflicte
      login(token, userData);

      // Redirigir segons el rol
      if (role === 'admin') {
        navigate('/admin');
      } else {
        // Si és client, redirigeix a la pàgina on anava o a l'inici
        navigate(from === '/login' ? '/' : from);
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sessió');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sessió</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Contrasenya:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Carregant...' : 'Iniciar Sessió'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;