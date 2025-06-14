import type { FormProps } from 'antd';
import { Button, Card, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  clearError,
  setStorageOwner,
  usersState 
} from '../redux/slices/usersSlice';
import { ILoginFormData, IUser } from '../models';
import { loginUser } from '../services/authServices';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCSRFToken } from '../services/authServices';

interface FieldType {
  userName: string;
  password: string;
  remember: boolean;
}

export default function Login() {
  const { isLoading } = useAppSelector(usersState);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isCsrfLoading, setIsCsrfLoading] = useState(true);

  useEffect(() => {
    setIsCsrfLoading(true);
    fetchCSRFToken()
      .then(token => {
        setCsrfToken(token);
        setIsCsrfLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch CSRF token:', err);
        message.error('Ошибка загрузки системы безопасности');
        setIsCsrfLoading(false);
      });

    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const saveUserData = (user: IUser, remember: boolean) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify({
      username: user.username,
      is_staff: user.is_staff
    }));
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    if (!csrfToken) {
      message.error('Система безопасности не инициализирована');
      return;
    }

    const formData: ILoginFormData = {
      username: values.userName,
      password: values.password,
    };

    try {
      const { user } = await loginUser(formData);
      message.success('Вход выполнен успешно');
      saveUserData(user, values.remember);
      dispatch(setStorageOwner(user));
      
      navigate(user.is_staff ? '/admin' : '/storage', { replace: true });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка входа';
      message.error(errorMessage);
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Validation failed:', errorInfo);
    message.error(errorInfo.errorFields[0].errors[0]);
  };

  return (
    <Card 
      className="card"
      title={<h1>Аутентификация</h1>}
      bordered={false}
    > 
      <Form
        name="login"
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
          rules={[{ required: true, message: 'Пожалуйста, введите Ваш логин' }]}
        >
          <Input placeholder="Логин"/>
        </Form.Item>

        <Form.Item<FieldType>
          label="Пароль"
          name="password"
          wrapperCol={{ sm: 24 }}
          rules={[
            { required: true, message: 'Пожалуйста, введите Ваш пароль' },
            { min: 6, message: 'Пароль должен содержать минимум 6 символов' }
          ]}
        >
          <Input.Password placeholder="Пароль"/>
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ sm: 24 }}
        >
          <Checkbox>Запомнить меня</Checkbox>
        </Form.Item>
        
        <Form.Item wrapperCol={{ sm: 24 }}>
          <Button 
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading || isCsrfLoading}
            disabled={!csrfToken}
          >
            Войти
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}