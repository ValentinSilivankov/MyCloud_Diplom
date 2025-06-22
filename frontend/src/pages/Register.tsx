import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Alert } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined 
} from '@ant-design/icons';
import { useAppDispatch } from '../hooks';
import { registerUser } from '../services/userServices';
// import { IRegisterFormData } from '../models';

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirm: string;
  firstName?: string;
  lastName?: string;
}

export default function Register() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: FormValues) => {
    if (values.password !== values.confirm) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await dispatch(registerUser({
        username: values.username,
        email: values.email,
        password: values.password,
        first_name: values.firstName,
        last_name: values.lastName,
      })).unwrap();
      
      navigate('/login');
    } catch (error) {
      setError('Ошибка регистрации. Возможно, пользователь уже существует.' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Регистрация" style={{ maxWidth: 500, margin: '0 auto' }}>
      {error && <Alert message={error} type="error" style={{ marginBottom: 24 }} />}
      <Form<FormValues>
        name="register"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: 'Введите имя пользователя' },
            { min: 4, message: 'Минимум 4 символа' }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Имя пользователя" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Некорректный email' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="firstName"
        >
          <Input placeholder="Имя (необязательно)" />
        </Form.Item>

        <Form.Item
          name="lastName"
        >
          <Input placeholder="Фамилия (необязательно)" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Введите пароль' },
            { min: 6, message: 'Минимум 6 символов' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Подтвердите пароль' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('Пароли не совпадают');
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Подтверждение пароля" />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size='large'
            loading={isLoading}
          >
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}