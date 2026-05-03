// pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './Register.scss';

function Register() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  axios.defaults.baseURL = 'http://localhost:8000/api';

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/register', {
        email,
        password,
        password_confirmation
      });

      const { token, user, role } = response.data;
      login(token, user);
      navigate('/');

    } catch (err) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0];
        setError(firstError[0]);
      } else {
        setError(err.response?.data?.message || 'Error al registrar l\'usuari');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-overlay"></div>
      <div className="register-back-link">
        <Link to="/" className="back-home">
          ← Tornar a la botiga
        </Link>
      </div>
      <div className="register-card">
        <div className="register-brand">
          <h2>Crear compte</h2>
          <p>Registra't per començar</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
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
              placeholder="Contrasenya (mínim 6 caràcters)"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirmar contrasenya"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Carregant...' : 'Registrar-se'}
          </button>
        </form>
        
        <div className="register-footer">
          <p>Ja tens compte? <Link to="/login">Inicia sessió</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;