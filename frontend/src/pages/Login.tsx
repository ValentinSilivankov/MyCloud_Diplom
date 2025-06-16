/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Card, message } from 'antd';
import { useAppDispatch } from '../hooks';
import { loginUser } from '../services/userServices';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const result = await dispatch(loginUser(values)).unwrap();
      message.success(`Добро пожаловать, ${result.user.username}!`);
      navigate(result.user.is_staff ? '/admin' : '/storage');
    } catch (error) {
      message.error('Неверные учетные данные');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Вход в систему" style={{ maxWidth: 500, margin: '20px auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Логин"
          name="username"
          rules={[{ required: true, message: 'Введите логин' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Войти
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}