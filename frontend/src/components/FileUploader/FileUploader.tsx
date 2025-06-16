/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../hooks/index';
import { uploadFile } from '../../services/fileServices';

export default function FileUploader() {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const beforeUpload = (file: File) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('Файл должен быть меньше 10MB');
    }
    return isLt10M;
  };

  const handleUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await dispatch(uploadFile(formData)).unwrap();
      message.success(`${file.name} успешно загружен`);
    } catch (error) {
      message.error('Ошибка загрузки файла');
    } finally {
      setLoading(false);
    }
    return false; 
  };

  return (
    <Upload
      beforeUpload={beforeUpload}
      customRequest={({ file }) => handleUpload(file as File)}
      showUploadList={false}
      multiple={false}
    >
      <Button icon={<UploadOutlined />} loading={loading}>
        Загрузить файл
      </Button>
    </Upload>
  );
}