import { 
  Route, 
  createBrowserRouter, 
  createRoutesFromElements, 
  RouterProvider } from 'react-router-dom'
import { Main } from './components/Main'
import Welcome from './pages/Welcome/Welcome'
import Register from './pages/Register'
import Login from './pages/Login'
import Admin from './pages/Admin'
import FileStorage from './pages/FileStorage'
import ErrorPage from './pages/ErrorPage'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import './App.css'

export default function App() {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Main />} >
        <Route index element={<Welcome />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin' element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path='/storage' element={<ProtectedRoute><FileStorage /></ProtectedRoute>} />
        <Route path='/storage/:username' element={<ProtectedRoute><FileStorage /></ProtectedRoute>} />
        <Route path='/*' element={<ErrorPage  />} />
      </Route>
    )
  );
 
  return (
    <RouterProvider router={routes} />
 );
}