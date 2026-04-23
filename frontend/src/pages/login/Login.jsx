// pages/login/Login.jsx
import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom'; 
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './Login.scss';

function Login() {
  const { isAuthenticated, user, login } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  axios.defaults.baseURL = 'http://localhost:8000/api';

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace />;
  }

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

      const { token, user: userData, role } = response.data; 
      login(token, userData);

      if (role === 'admin') {
        navigate('/admin');
      } else {
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
        
        <div className="login-footer">
          <p>No tens compte? <Link to="/register">Registra't aquí</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login; // ← Això és OBLIGATORI