import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store'; // Updated to use the typed dispatch
import { logout } from '../../services/slices/authSlice';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate('/login'); // Redirect to the login page after logout
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
