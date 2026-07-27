import { Navigate } from 'react-router-dom';
import { getToken, getUser } from '../utils/authStorage.js';

function ProtectedRoute({ allowedRoles, children }) {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Security note: route-level checks complement backend role authorization; they do not replace API security.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
