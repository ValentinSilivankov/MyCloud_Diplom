import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, Flex, message, Table, TableProps, Tooltip } from 'antd'
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  FileSearchOutlined
} from '@ant-design/icons'
import { usersState } from '../redux/slices/usersSlice'
import {
  // clearError,
  // clearFilesList,
  filesState
} from '../redux/slices/filesSlice'
import { formatFileSize, useAppDispatch, useAppSelector } from '../hooks'
import { IChangeFileData, IDownloadFileData, IFile } from '../models'
import DownloadSection from '../components/DownloadSection/DownloadSection'
import { changeFile, deleteFile, downloadFile, getFileLink, getFilesList } from '../services/fileServices'
import { useNavigate, useParams } from 'react-router-dom'

export default function StoragePage() {
  const { currentUser, storageOwner, isAuthenticated, authChecked } = useAppSelector(usersState);
  const { filesList, error } = useAppSelector(filesState);
  
  const [, setShowAlert] = useState(false);
  const dispatch = useAppDispatch(); 
  const navigate = useNavigate();
  const requestSent = useRef(false);
  const { username } = useParams();

  useEffect(() => {
        if (authChecked && isAuthenticated) {
            const targetUsername = username || storageOwner?.username || currentUser?.username;
            if (targetUsername && !requestSent.current) {
                requestSent.current = true;
                dispatch(getFilesList(targetUsername))
                    .finally(() => {
                        requestSent.current = false;
                    });
            }
        } else if (authChecked && !isAuthenticated) {
            navigate('/login');
        }
    }, [dispatch, navigate, isAuthenticated, authChecked, storageOwner, currentUser, username]);
    

  const handleEditFileName = (id: number, file_name: string) => {
    const newFileName = prompt(
      'Введите новое имя файла:',
      file_name
    );

    if (newFileName) {
      const newFileData: IChangeFileData = { id, file_name: newFileName };

      dispatch(changeFile(newFileData))
        .unwrap()
        .then(() => {
          console.log('Файл переименован');
          dispatch(getFilesList(storageOwner?.username));
        })
        .catch((error) => {
          console.log(error)
          message.error({
            content: 'Ошибка переименования: ' + error,
            duration: 2,
          });
        });
    }
  };

  const handleEditFileComment = (id: number, comment: string) => {
    const newFileComment = prompt(
      'Введите новый комментарий к файлу:',
      comment
    );

    if (newFileComment) {
      const newFileData: IChangeFileData = { id, comment: newFileComment };

      dispatch(changeFile(newFileData))
        .unwrap()
        .then(() => {
          console.log('Комментарий к файлу изменён');
          dispatch(getFilesList(storageOwner?.username));
        })
        .catch((error) => {
          console.log(error);
          message.error({
            content: 'Ошибка изменения комментария: ' + error,
            duration: 2,
          });
        })
    }
  };

  const handleFileSearchOutlined = async (id:number) => {
    try {
      const response = await dispatch(getFileLink(id));

      const link = response.payload.link || response.payload.special_link;
      
      const textArea = document.createElement('textarea');
      textArea.value = link;

      window.open(link, '_blank');

    } catch (error) {
      console.error('Полная ошибка:', error);
      message.error({
        content: 'Ошибка при получении ссылки',
        duration: 3,
      });
    }
  }

  const handleDownloadFile = (id: number, file_name: string) => {
    const fileData : IDownloadFileData = { id, file_name };

    dispatch(downloadFile(fileData))
      .unwrap()
      .then(() => {
        console.log('Файл успешно скачан');
        message.success({
          content: 'Файл успешно скачан',
          duration: 2,
        });
        dispatch(getFilesList(storageOwner?.username));
      })
      .catch((error) => {
        console.log(error);
        message.error({
          content: 'Ошибка скачивания файла: ' + error,
          duration: 2,
        });
      })
  };

  async function handleGetFileLink(id: number) {
    try {

      const response = await dispatch(getFileLink(id))

      if (!response.payload) {
        throw new Error('Пустой ответ от сервера')
      }

      const link = response.payload.link || response.payload.special_link
      if (!link) {
        console.error('Неверная структура ответа:', response.payload)
        throw new Error('Ссылка не найдена в ответе сервера')
      }

      const textArea = document.createElement('textarea')
      textArea.value = link
      document.body.appendChild(textArea)
      textArea.select()

      try {
        document.execCommand('copy')
        message.success({
          content: 'Специальная ссылка на файл получена и скопирована в буфер обмена',
          duration: 5,
        })
      } finally {
        document.body.removeChild(textArea)
      }

    } catch (error) {
      console.error('Полная ошибка:', error)
      message.error({
        content: 'Ошибка при получении ссылки',
        duration: 3,
      })
    }
  }

  const handleDeleteFile = async (id: number) => {
  if (confirm('Вы действительно хотите удалить файл?')) {
    try {
      await dispatch(deleteFile(id)).unwrap();
      
      const targetUsername = username || storageOwner?.username || currentUser?.username;
      if (!targetUsername) {
        throw new Error('Не удалось определить пользователя');
      }

      await dispatch(getFilesList(targetUsername));
      
      message.success('Файл успешно удалён');
    } catch (error) {
      message.error('Ошибка при удалении файла');
      console.error('Delete error:', error);
    }
  }
};

  const columns: TableProps<IFile>['columns'] = [
    {
      title: 'Имя файла',
      dataIndex: 'file_name',
      key: 'file_name',
      render: (text, record) => (
        <Tooltip placement='topLeft' title='Нажмите для редактирования'>
          <a
            key={`name-${record.id}`}
            onClick={() => handleEditFileName(record.id, record.file_name)}>
            {text}
          </a>
        </Tooltip>
      ),
      sorter: (a, b) => a.file_name.localeCompare(b.file_name),
      showSorterTooltip: false,
    },
    {
      title: 'Комментарий',
      dataIndex: 'comment',
      key: 'comment',
      render: (text, record) => (
        <Tooltip placement='topLeft' title='Нажмите для редактирования'>
          <a 
            key={`comment-${record.id}`}
            onClick={() => handleEditFileComment(record.id, record.comment ||'')}
            style={{
              display: 'inline-block',
              width: !text ? '20px' : 'auto',
              height: '20px',
              border: !text ? '1px dashed #d9d9d9' : 'none',
              borderRadius: '4px'
            }}
            >
            {text || ''}
          </a>
        </Tooltip>
      ),
      sorter: (a, b) => a.comment.localeCompare(b.comment),
      showSorterTooltip: false,
    },
    {
      title: 'Размер',
      dataIndex: 'size',
      key: 'size',
      // render: (text) => formatFileSize(text),
      render: (text) => {
        // console.log('Size value before formatting:', text, typeof text);
        return formatFileSize(text);
      },
      sorter: (a, b) => a.size - b.size,
      showSorterTooltip: false,
    },
    {
      title: 'Дата загрузки',
      dataIndex: 'uploaded',
      key: 'uploaded',
      render: (text) => moment(text).format('DD.MM.YYYY'),
      sorter: (a, b) => a.uploaded.localeCompare(b.uploaded),
      showSorterTooltip: false,
    },
    {
      title: 'Дата скачивания',
      dataIndex: 'downloaded',
      key: 'downloaded',
      render: (text) => text ? moment(text).format('DD.MM.YYYY') : '',
      sorter: (a, b) => {
        const aDownloaded = a.downloaded || '';
        const bDownloaded = b.downloaded || '';
        return aDownloaded.localeCompare(bDownloaded);
      },
      showSorterTooltip: false,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Flex justify="space-evenly" align="center">
          <Tooltip 
            placement='top'
            title='Предварительный просмотр'
          >
            <Button
              icon={<FileSearchOutlined />}
              onClick={() => handleFileSearchOutlined(record.id)} />
          </Tooltip>

          <Tooltip 
            placement='top'
            title='Скачать'
          >
            <Button
              icon={<CloudDownloadOutlined/>}
              onClick={() => handleDownloadFile(record.id, record.file_name)} />
          </Tooltip>

          <Tooltip 
            placement='top'
            title='Получить специальную ссылку'
          >
            <Button
              icon={<ShareAltOutlined/>}
              onClick={() => handleGetFileLink(record.id)} />
          </Tooltip>

          <Tooltip 
            placement='top'
            title='Удалить'
          >
            <Button
              icon={<DeleteOutlined/>}
              onClick={() => handleDeleteFile(record.id)} />
          </Tooltip>
        </Flex>
      ),
    }
  ];

  return (
    <Card 
      className='card'
      title={currentUser?.id === storageOwner?.id ? 
        <h1>Ваше файловое хранилище</h1> :
        <h1>Файлы пользователя "{username || storageOwner?.username || currentUser?.username}"</h1>
      }
      bordered={false}
    >
      {error ?
        <Alert type='error' message={error} closable onClose={() => setShowAlert(false)} /> :
        <>
          <Table 
          dataSource={filesList} 
          columns={columns}
          rowKey={(record: IFile) => record.id.toString()}
          pagination={false}
          />
          <DownloadSection />
        </>
      }
    </Card>
  );
}