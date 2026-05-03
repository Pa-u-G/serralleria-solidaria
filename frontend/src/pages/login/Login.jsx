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
    e.stopPropagation();
    
    if (!email || !password) {
      setError('Si us plau, omple tots els camps');
      return;
    }
    
    setLoading(true);
    setError(''); // Netejar error anterior

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
      console.log('Error capturat:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Error de connexió. Comprova que el servidor estigui actiu.');
      } else if (err.response?.status === 401) {
        setError('Credencials incorrectes. Revisa el teu email i contrasenya.');
      } else {
        setError(err.response?.data?.message || 'Error al iniciar sessió. Torna-ho a intentar.');
      }
      
      // Assegurar que l'error es manté visible
      setTimeout(() => {
        console.log('Error encara visible:', error);
      }, 100);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay"></div>
      <div className="login-back-link">
        <Link to="/" className="back-home" onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}>
          ← Tornar a la botiga
        </Link>
      </div>
      <div className="login-card">
        <div className="login-brand">
          <h2>Iniciar Sessió</h2>
          <p>Benvingut de nou</p>
        </div>
        
        {error && (
          <div className="error-message">
            <span>⚠️ </span>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correu electrònic"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contrasenya"
              required
            />
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Has oblidat la contrasenya?</Link>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Carregant...' : 'Iniciar Sessió'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>No tens compte? <Link to="/register">Registra't</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;