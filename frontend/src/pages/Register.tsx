import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { FormProps } from 'antd'
import { Button, Card, Form, Input, message } from 'antd'
import { useAppDispatch, useAppSelector } from '../hooks'
import { clearError, usersState } from '../redux/slices/usersSlice'
import { fetchCSRFToken, registerUser } from '../services/authServices'

interface FieldType {
  userName?: string
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  repeat?: string
}

export default function Register() {
  const { isLoading } = useAppSelector(usersState)
  const [, setError] = useState<string>('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [csrfToken, setCsrfToken] = useState('')

  // Исправлено: useEffect вместо useState для side effects
  useEffect(() => {
    fetchCSRFToken()
      .then(token => setCsrfToken(token))
      .catch(err => {
        console.error('CSRF token error:', err)
        message.error('Ошибка инициализации системы безопасности')
      })
  }, [])

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setError('')
    
    if (!csrfToken) {
      message.error('Система безопасности не инициализирована')
      return
    }

    const formData = {
      username: values.userName ?? '',
      first_name: values.firstName ?? '',
      last_name: values.lastName ?? '',
      email: values.email ?? '',
      password: values.password ?? '',
    }

    try {
      // Регистрация пользователя
      await dispatch(registerUser({ data: formData, csrfToken })).unwrap()

      message.success({
        content: 'Регистрация выполнена успешно',
        duration: 2,
      })

      dispatch(clearError())

      
      const loginResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/session/login/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      })

      if (loginResponse.ok) {
        navigate('/dashboard')
      } else {
        navigate('/login')
      }
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Ошибка регистрации'
      setError(errorMessage)
      message.error({
        content: errorMessage,
        duration: 2,
        style: { marginTop: '35vh' },
      })
    }
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Validation failed:', errorInfo)
    message.error({
      content: errorInfo.errorFields[0].errors[0],
      duration: 2,
      style: { marginTop: '35vh' },
    })
  }

  return (
    <Card 
      className="card"
      title={<h1>Регистрация</h1>}
      bordered={false}
    > 
      <Form
        name="register"
        layout="vertical"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="form"
      >
        <Form.Item<FieldType>
          label="Логин"
          name="userName"
          wrapperCol={{ sm: 24 }}
          validateTrigger="onBlur"
          rules={[
            { required: true, message: 'Пожалуйста, введите логин' },
            {
              pattern: /^[a-zA-Z]{1}[a-zA-Z0-9]{3,19}$/,
              message: 'Логин должен содержать только латинские буквы и цифры, начинаться на букву и быть от 4 до 20 символов',
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Email"
          name="email"
          wrapperCol={{ sm: 24 }}
          validateTrigger="onBlur"
          rules={[
            { required: true, message: 'Пожалуйста, введите email' },
            {  
              type: 'email',
              message: 'Введите корректный адрес электронной почты',
            }
          ]}
        >
          <Input placeholder="user@example.com" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Имя"
          name="firstName"
          wrapperCol={{ sm: 24 }}
          rules={[{ required: false }]}

        >
          <Input placeholder="Иван" />
        </Form.Item>

        <Form.Item<FieldType>
          label='Фамилия'
          name='lastName'
          wrapperCol={{ sm: 24 }}
          rules={[{ required: false }]}

        >
          <Input placeholder="Иванов" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Пароль"
          name="password"
          wrapperCol={{ sm: 24 }}
          validateTrigger="onBlur"
          rules={[
            { required: true, message: 'Пожалуйста, введите пароль' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{6,}$/,
              message: 'Пароль должен содержать минимум 6 символов, включая одну заглавную букву, одну строчную букву, одну цифру и один специальный символ',
            }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          label="Подтверждение пароля"
          name="repeat"
          dependencies={['password']}
          wrapperCol={{ sm: 24 }}
          rules={[
            { required: true, message: 'Пожалуйста, подтвердите пароль' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Пароли не совпадают'))
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ sm: 24 }}>
          <Button 
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
            disabled={!csrfToken}
          >
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}