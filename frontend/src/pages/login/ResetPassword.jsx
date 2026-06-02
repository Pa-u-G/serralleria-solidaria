// pages/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './ResetPassword.scss';

function ResetPassword() {
  const { isAuthenticated } = useAuth();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  axios.defaults.baseURL = 'http://localhost:8000/api';

  // Obtenir el token i email de la URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!token || !email) {
    return (
      <div className="reset-container">
        <div className="reset-overlay"></div>
        <div className="reset-card">
          <h2>Enllaç invàlid</h2>
          <p>Aquest enllaç de recuperació no és vàlid o està incomplet.</p>
          <Link to="/forgot-password">Sol·licitar un nou enllaç</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/reset-password', {
        email,
        password,
        password_confirmation: passwordConfirmation,
        token
      });

      setMessage(response.data.message);
      
      // Redirigir al login després de 3 segons
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Error en restablir la contrasenya');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-overlay"></div>
      <div className="reset-card">
        <div className="reset-brand">
          <h2>Nova contrasenya</h2>
          <p>Introdueix la teva nova contrasenya</p>
        </div>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nova contrasenya"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirmar nova contrasenya"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Restablint...' : 'Restablir contrasenya'}
          </button>
        </form>
        
        <div className="reset-footer">
          <Link to="/login">Tornar al login</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;