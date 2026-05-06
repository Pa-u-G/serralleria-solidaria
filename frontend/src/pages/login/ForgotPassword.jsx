// pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './ForgotPassword.scss';

function ForgotPassword() {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  axios.defaults.baseURL = 'http://localhost:8000/api';

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/forgot-password', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error en enviar la sol·licitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-overlay"></div>
      <div className="forgot-back-link">
        <Link to="/login" className="back-home">
          ← Tornar al login
        </Link>
      </div>
      <div className="forgot-card">
        <div className="forgot-brand">
          <h2>Has oblidat la contrasenya?</h2>
          <p>Introdueix el teu email i t'enviarem un enllaç per restablir-la</p>
        </div>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="El teu correu electrònic"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Enviant...' : 'Enviar enllaç de recuperació'}
          </button>
        </form>
        
        <div className="forgot-footer">
          <Link to="/login">Recordo la meva contrasenya</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;