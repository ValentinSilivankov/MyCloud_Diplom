import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks'
import { checkAuth } from '../../services/userServices'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(checkAuth())
      .unwrap()
      .catch(() => navigate('/login'))
  }, [dispatch, navigate])

  return children
}