import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthChecked = useSelector(
    (state: RootState) => state.auth.isAuthChecked
  );

  if (!isAuthChecked) {
    return null;
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return children;
};
