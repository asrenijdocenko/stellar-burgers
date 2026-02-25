import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { login } from '../../services/slices/authSlice';
import { AppDispatch, RootState } from '../../services/store';

export const Login: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useSelector((state: RootState) => state.auth.error);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    dispatch(login({ email, password }));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
