import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Flex, Button, ConfigProviderProps } from 'antd'
import { useState } from 'react'
import './main.scss'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { usersState } from '../../redux/slices/usersSlice'
import { logoutUser } from '../../services/userServices'

const { Header, Footer, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#000',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#f5f5f5',

};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  minWidth: 1120,
  lineHeight: '120px',
  color: '#000',
  backgroundColor: '#f5f5f5',
  fontFamily: 'Roboto',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: 'darkgray',
  backgroundColor: '#f5f5f5',
  fontSize: '16px',
};

const layoutStyle: React.CSSProperties = {
  borderRadius: 8,
  overflow: 'hidden',
  width: '100%',
};

export const Main = () => {
  const { currentUser } = useAppSelector(usersState);
  const navigate = useNavigate();
  const location = useLocation();
  const [size] = useState<SizeType>('large');
  const dispatch = useAppDispatch();
  type SizeType = ConfigProviderProps['componentSize'];

  // const handleLogout = () => {
  //   dispatch(logoutUser())
  //     .unwrap()
  //     .then(() => {
  //       console.log("Пользователь успешно вышел из системы");
  //       // localStorage.removeItem("token");
  //       navigate("/");
  //     })
  //     .catch((error) => console.log(error));
  // };
  const handleLogout = async () => {
  try {
    await dispatch(logoutUser()).unwrap();
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'sessionid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'csrftoken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    navigate('/');
  } catch (error) {
    console.error('Logout error:', error);
    // Принудительный редирект даже при ошибке
    navigate('/');
  }
};

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <div className='header'>
          <div className='home' onClick={ () => navigate('/') }>
            <span role='img' aria-label='home'>
              <svg viewBox='0 0 3873 3873' className='svg' focusable='false' data-icon='home' width='46px' height='46px' aria-hidden='true'>
                <g id='cloud'>
                  <path className='st0' d='M557.9,53.1h2761.2c279.8,0,508.7,228.9,508.7,508.7v2761.2c0,279.8-228.9,508.7-508.7,508.7H557.9 c-279.8,0-508.7-228.9-508.7-508.7V561.7C49.3,282,278.2,53.1,557.9,53.1z'/>
                  <g>
                    <path className='st1' d='M2384.9,2812h-1163c-67.2,0-132.4-13.2-193.8-39.1c-59.3-25.1-112.5-61-158.2-106.7 c-45.7-45.7-81.6-99-106.7-158.2c-26-61.4-39.1-126.6-39.1-193.8c0-128.7,49-250.9,137.9-343.9c80.1-83.9,185.3-136.4,299.2-150.3 c33.3-275.6,268-486.5,549.6-486.5c74.7,0,147.2,14.6,215.5,43.5c65.9,27.9,125.1,67.8,176,118.6c50.8,50.8,90.7,110,118.6,176 c21.7,51.3,35.3,104.9,40.8,160.1c40.1-10.2,81.3-15.4,123.2-15.4c67.2,0,132.4,13.2,193.8,39.1c59.3,25.1,112.5,61,158.2,106.7 c45.7,45.7,81.6,99,106.7,158.2c26,61.4,39.1,126.6,39.1,193.8c0,67.2-13.2,132.4-39.1,193.8c-25.1,59.3-61,112.5-106.7,158.2 c-45.7,45.7-99,81.6-158.2,106.7C2517.3,2798.9,2452.1,2812,2384.9,2812L2384.9,2812z M1710.7,1416.9 c-249.6,0-455.8,195-469.5,443.9c-1.2,21.3-18.3,38.3-39.6,39.4c-221,10.6-394.2,192.5-394.2,414c0,228.5,185.9,414.5,414.5,414.5 l1163,0c228.5,0,414.5-185.9,414.5-414.5c0-228.5-185.9-414.5-414.5-414.5c-50.7,0-100.3,9.1-147.4,27 c-12.8,4.9-27.2,3.1-38.5-4.6c-11.3-7.8-18-20.6-18-34.3c0-0.3,0-0.6,0-0.9C2180.8,1627.6,1969.9,1416.9,1710.7,1416.9z'/>
                    <path className='st1' d='M2837.5,2413.2c-16.9,0-32.9-10.4-39.1-27.2c-8-21.6,3-45.6,24.6-53.6c147.5-54.6,246.6-197.1,246.6-354.5 c0-208.4-169.5-377.9-377.9-377.9c-46.3,0-91.5,8.3-134.4,24.6c-12.8,4.9-27.2,3.1-38.5-4.6c-11.3-7.8-18-20.6-18-34.3v-0.5 c0-236.6-192.5-429.1-429.1-429.1c-165.4,0-313.3,92.4-385.9,241.2c-10.1,20.7-35.1,29.3-55.8,19.2 c-20.7-10.1-29.3-35.1-19.2-55.8c41.5-85.1,105.7-157,185.6-207.9c82.2-52.4,177.3-80.1,275.2-80.1c69.2,0,136.3,13.6,199.5,40.3 c61,25.8,115.9,62.8,162.9,109.8c47.1,47.1,84,101.9,109.8,162.9c19.6,46.3,32.1,94.6,37.4,144.3c36-8.8,72.9-13.3,110.4-13.3 c62.3,0,122.7,12.2,179.6,36.3c54.9,23.2,104.3,56.5,146.6,98.8c42.3,42.4,75.6,91.7,98.8,146.6c24.1,56.9,36.3,117.3,36.3,179.6 c0,96.1-29.3,188.2-84.6,266.4c-54.1,76.4-129,133.9-216.4,166.3C2847.2,2412.4,2842.3,2413.2,2837.5,2413.2z'/>
                  </g>
                </g>
              </svg>
            </span>
          </div>

          <div className='header__space'></div>

          <Flex gap='middle' align='center'>
            {["/", "/register", "/register/"].includes(location.pathname) && (
              <NavLink to='/login'>
                <Button type='primary' size={size}>Вход</Button>
              </NavLink>
            )}

            {["/", "/login", "/login/"].includes(location.pathname) && (
              <NavLink to='/register'>
                <Button type='primary' size={size}>Регистрация</Button>
              </NavLink>
            )}

            {["/admin", "/storage", "/admin/", "/storage/"].includes(location.pathname) && (
              <>
                {currentUser && <span>Добро пожаловать, {currentUser.username}</span>}
                <NavLink to='/'>
                  <Button type='primary' size={size} onClick={handleLogout}>Выход</Button>
                </NavLink>
              </>
            )}
          </Flex>
        </div>
      </Header>
      
      <Layout>
        <Content style={contentStyle}>
          <Outlet />
        </Content>
      </Layout>

      <Footer style={footerStyle}>
        LiTiN ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};