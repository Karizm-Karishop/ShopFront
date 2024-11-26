import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAppSelector } from '../../Redux/hooks';

interface ProtectedRouteProps {
  children: ReactNode;
  roles: string[];
}

function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const user = useAppSelector((state) => state.loginIn.user);

  if (user && user.role && roles.includes(user.role)) {
    return children;
  }

  return <Navigate to="/login" />;
}

export default ProtectedRoute;
