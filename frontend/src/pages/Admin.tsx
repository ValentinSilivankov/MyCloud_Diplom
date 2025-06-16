/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { Table, Button, Card, Tag, Space, message } from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getUsersList, deleteUser, toggleAdminStatus } from '../services/userServices';
import { IUserForAdmin } from '../models';

export default function Admin() {
  const dispatch = useAppDispatch();
  const { usersList, isLoading } = useAppSelector(state => state.users);
  const currentUser = useAppSelector(state => state.users.currentUser);

  useEffect(() => {
    dispatch(getUsersList());
  }, [dispatch]);

  const handleToggleAdmin = async (userId: number, isAdmin: boolean) => {
    try {
      await dispatch(toggleAdminStatus({ userId, isAdmin })).unwrap();
      message.success('Права пользователя изменены');
    } catch (error) {
      message.error('Ошибка при изменении прав');
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      message.success('Пользователь удалён');
    } catch (error) {
      message.error('Ошибка при удалении');
    }
  };

  const columns = [
    {
      title: 'Логин',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Статус',
      key: 'is_staff',
      render: (_: any, record: IUserForAdmin) => (
        <Tag color={record.is_staff ? 'red' : 'green'}>
          {record.is_staff ? 'Админ' : 'Пользователь'}
        </Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: IUserForAdmin) => (
        <Space>
          <Button
            danger={!record.is_staff}
            onClick={() => handleToggleAdmin(record.id, record.is_staff)}
            disabled={record.id === currentUser?.id}
          >
            {record.is_staff ? 'Снять админа' : 'Назначить админом'}
          </Button>
          <Button 
            danger 
            onClick={() => handleDelete(record.id)}
            disabled={record.id === currentUser?.id}
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Управление пользователями">
      <Table
        columns={columns}
        dataSource={usersList}
        rowKey="id"
        loading={isLoading}
      />
    </Card>
  );
}