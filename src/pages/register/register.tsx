import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { register } from '../../services/slices/authSlice';
import { AppDispatch, RootState } from '../../services/store';

export const Register: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useSelector((state: RootState) => state.auth.error);
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const getErrorText = (): string => {
    if (password.length > 0 && password.length < 6) {
      return 'Пароль должен содержать минимум 6 символов';
    }
    return error || '';
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      return;
    }

    if (password.length < 6) {
      return;
    }

    dispatch(
      register({
        name: userName,
        email,
        password
      })
    );
  };

  return (
    <RegisterUI
      errorText={getErrorText()}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
