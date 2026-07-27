import { Navigate } from 'react-router-dom';
import { getRouteForRole, getUser } from '../utils/authStorage.js';

function RoleBasedRedirect() {
  const user = getUser();
  // UI note: each role lands on its operational dashboard after login.
  return <Navigate to={getRouteForRole(user?.role)} replace />;
}

export default RoleBasedRedirect;
