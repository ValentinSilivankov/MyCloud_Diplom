import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { checkAuth } from '../../services/userServices';
import Loading from '../Loading/Loading';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, authChecked } = useAppSelector(state => state.users);
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation();
  const authCheckedRef = useRef(false);

  // useEffect(() => {
  //   dispatch(checkAuth())
  //     .unwrap()
  //     .catch(() => navigate('/login'))
  // }, [dispatch, navigate])

  // return children

  useEffect(() => {
    if (!authChecked && !authCheckedRef.current) {
      authCheckedRef.current = true;
      dispatch(checkAuth())
        .unwrap()
        .catch(() => {
          navigate('/login', { state: { from: location }, replace: true });
        });
    }
  }, [dispatch, navigate, authChecked, location]);

  if (!authChecked) {
    return <Loading />;
  }

  return isAuthenticated ? children : null;
}