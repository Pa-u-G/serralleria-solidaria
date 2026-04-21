// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Carregant...</div>;
  }

  // Si no està autenticat, redirigeix al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si té rol restringit i no és el permès
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;