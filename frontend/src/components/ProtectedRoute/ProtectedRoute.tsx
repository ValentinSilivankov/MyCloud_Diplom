import { 
  useEffect, 
  // useRef
 } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { checkAuth,
  //  logoutUser
   } from '../../services/userServices';
import Loading from '../Loading/Loading';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { 
    isAuthenticated, 
    authChecked,
    isLoading,
    // error
  } = useAppSelector(state => state.users);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // const authCheckedRef = useRef(false);

  // Основной эффект для проверки аутентификации
  useEffect(() => {
    if (!authChecked) {
      // authCheckedRef.current = true;
      dispatch(checkAuth())
        .unwrap()
        .catch(() => {
          
          navigate('/login', { 
            state: { from: location }, 
            replace: true 
          });
        }
      );
    }
  }, [dispatch, navigate, location, authChecked, isAuthenticated, isLoading]);

// useEffect(() => {
//   if (error) {
//     dispatch(logoutUser())
//       .unwrap()
//       .finally(() => {
//         navigate('/', {
//           state: { from: location },
//           replace: true
//         });
//       });
//   }
// }, [error, dispatch, navigate, location]);


  if (!authChecked || isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? children : null;
}