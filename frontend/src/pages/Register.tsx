/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Card, message } from 'antd';
import { useAppDispatch } from '../hooks';
import { registerUser } from '../services/userServices';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values: { 
    username: string; 
    email: string; 
    password: string; 
    confirmPassword: string 
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Пароли не совпадают');
      return;
    }

    setLoading(true);
    try {
      await dispatch(registerUser({
        username: values.username,
        email: values.email,
        password: values.password,
        first_name: '',
        last_name: ''
      })).unwrap();
      message.success('Регистрация успешна!');
      navigate('/login');
    } catch (error) {
      message.error('Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Регистрация" style={{ maxWidth: 500, margin: '20px auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Логин"
          name="username"
          rules={[
            { required: true, message: 'Введите логин' },
            { min: 4, message: 'Минимум 4 символа' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Некорректный email' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: 'Введите пароль' },
            { min: 6, message: 'Минимум 6 символов' }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Подтвердите пароль"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Подтвердите пароль' }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}