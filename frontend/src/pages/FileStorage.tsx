/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { Table, Button, Card, message } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getFilesList, downloadFile, deleteFile } from '../services/fileServices';
import FileUploader from '../components/FileUploader/FileUploader';

export default function FileStorage() {
  const dispatch = useAppDispatch();
  const { filesList, isLoading } = useAppSelector(state => state.files);
  const currentUser = useAppSelector(state => state.users.currentUser);

  useEffect(() => {
    if (currentUser) {
      dispatch(getFilesList(currentUser.username));
    }
  }, [dispatch, currentUser]);

  const handleDownload = async (id: number, name: string) => {
    try {
      await dispatch(downloadFile({ id, file_name: name })).unwrap();
      message.success('Файл скачан');
    } catch (error) {
      message.error('Ошибка скачивания');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteFile(id)).unwrap();
      message.success('Файл удалён');
      dispatch(getFilesList(currentUser?.username));
    } catch (error) {
      message.error('Ошибка удаления');
    }
  };

  const columns = [
    {
      title: 'Имя файла',
      dataIndex: 'file_name',
      key: 'file_name',
    },
    {
      title: 'Размер (КБ)',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => (size / 1024).toFixed(2),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button 
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.id, record.file_name)}
          />
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <Card 
      title="Мое хранилище" 
      extra={<FileUploader />}
    >
      <Table
        columns={columns}
        dataSource={filesList}
        rowKey="id"
        loading={isLoading}
      />
    </Card>
  );
}