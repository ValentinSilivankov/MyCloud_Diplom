/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Alert, Button, Card, Flex, message, Table, TableProps, Tooltip } from 'antd'
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  ShareAltOutlined
} from '@ant-design/icons'
import { usersState } from '../redux/slices/usersSlice'
import {
  clearError,
  clearFilesList,
  filesState
} from '../redux/slices/filesSlice'
import { formatFileSize, useAppDispatch, useAppSelector } from '../hooks'
import { IChangeFileData, IDownloadFileData, IFile, IFileLinkResponse } from '../models'
import DownloadSection from '../components/DownloadSection/DownloadSection'
import { changeFile, deleteFile, downloadFile, getFileLink, getFilesList } from '../services/fileServices'

const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Ссылка скопирована в буфер обмена')
    })
    .catch(err => {
      console.error('Ошибка копирования:', err)
    })
}

export default function StoragePage() {
  const { currentUser, storageOwner } = useAppSelector(usersState)
  const { filesList, error } = useAppSelector(filesState)
  
  const [showAlert, setShowAlert] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (storageOwner?.username) {
      dispatch(getFilesList(storageOwner.username))
    }

    return () => {
      dispatch(clearFilesList())
      dispatch(clearError())
    }
  }, [dispatch, storageOwner?.username])

  useEffect(() => {
    setShowAlert(!!error)
  }, [error])

  const handleEditFileName = (id: number, file_name: string) => {
    const newFileName = prompt('Введите новое имя файла:', file_name)
    if (!newFileName) return

    const newFileData: IChangeFileData = { id, file_name: newFileName }

    dispatch(changeFile(newFileData))
      .unwrap()
      .then(() => {
        message.success('Файл переименован')
        refreshFileList()
      })
      .catch((error: Error) => {
        showError('Ошибка переименования:', error)
      })
  }

  const handleEditFileComment = (id: number, comment: string) => {
    const newFileComment = prompt('Введите новый комментарий:', comment)
    if (!newFileComment) return

    const newFileData: IChangeFileData = { id, comment: newFileComment }

    dispatch(changeFile(newFileData))
      .unwrap()
      .then(() => {
        message.success('Комментарий изменён')
        refreshFileList()
      })
      .catch((error: Error) => {
        showError('Ошибка изменения комментария:', error)
      })
  }

  const handleDownloadFile = (id: number, file_name: string) => {
    const fileData: IDownloadFileData = { id, file_name }

    dispatch(downloadFile(fileData))
      .unwrap()
      .then(() => {
        message.success('Файл скачан')
        refreshFileList()
      })
      .catch((error: Error) => {
        showError('Ошибка скачивания:', error)
      })
  }

  const handleGetFileLink = (id: number) => {
    dispatch(getFileLink(id))
      .unwrap()
      .then((data: IFileLinkResponse) => {
        copyToClipboard(data.special_link)
        message.success('Ссылка скопирована в буфер')
      })
      .catch((error: Error) => {
        showError('Ошибка получения ссылки:', error)
      })
  }

  const handleDeleteFile = (id: number) => {
    if (!confirm('Вы действительно хотите удалить файл?')) return

    dispatch(deleteFile(id))
      .unwrap()
      .then(() => {
        message.success('Файл удалён')
        refreshFileList()
      })
      .catch((error: Error) => {
        showError('Ошибка удаления:', error)
      })
  }

  const refreshFileList = () => {
    if (storageOwner?.username) {
      dispatch(getFilesList(storageOwner.username))
    }
  }

  const showError = (context: string, error: Error) => {
    console.error(context, error)
    message.error({
      content: context + ' ' + error.message,
      duration: 2,
    })
  }

  const columns: TableProps<IFile>['columns'] = [
    {
      title: 'Имя файла',
      dataIndex: 'file_name',
      key: 'file_name',
      render: (text: string, record: IFile) => (
        <Tooltip title="Нажмите для редактирования">
          <a onClick={() => handleEditFileName(record.id, record.file_name)}>
            {text}
          </a>
        </Tooltip>
      ),
      sorter: (a, b) => a.file_name.localeCompare(b.file_name),
    },
    {
      title: 'Комментарий',
      dataIndex: 'comment',
      key: 'comment',
      render: (text: string, record: IFile) => (
        <Tooltip title="Нажмите для редактирования">
          <a onClick={() => handleEditFileComment(record.id, record.comment)}>
            {text || '-'}
          </a>
        </Tooltip>
      ),
      sorter: (a, b) => (a.comment || '').localeCompare(b.comment || ''),
    },
    {
      title: 'Размер',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => formatFileSize(size),
      sorter: (a, b) => a.size - b.size,
    },
    {
      title: 'Дата загрузки',
      dataIndex: 'uploaded',
      key: 'uploaded',
      render: (date: string) => moment(date).format('DD.MM.YYYY'),
      sorter: (a, b) => a.uploaded.localeCompare(b.uploaded),
    },
    {
      title: 'Дата скачивания',
      dataIndex: 'downloaded',
      key: 'downloaded',
      render: (date: string | null) => date ? moment(date).format('DD.MM.YYYY') : '-',
      sorter: (a, b) => (a.downloaded || '').localeCompare(b.downloaded || ''),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: IFile) => (
        <Flex justify="space-evenly" align="center" gap="small">
          <Tooltip title="Скачать файл">
            <Button
              icon={<CloudDownloadOutlined />}
              onClick={() => handleDownloadFile(record.id, record.file_name)}
            />
          </Tooltip>

          <Tooltip title="Получить ссылку">
            <Button
              icon={<ShareAltOutlined />}
              onClick={() => handleGetFileLink(record.id)}
            />
          </Tooltip>

          <Tooltip title="Удалить файл">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteFile(record.id)}
            />
          </Tooltip>
        </Flex>
      ),
    }
  ]

  return (
    <Card 
      className="card"
      title={
        currentUser?.username === storageOwner?.username ? 
          <h1>Ваше файловое хранилище</h1> :
          <h1>Файлы пользователя "{storageOwner?.username}"</h1>
      }
      bordered={false}
    >
      {showAlert && error && (
        <Alert 
          type="error" 
          message={error} 
          closable 
          onClose={() => setShowAlert(false)} 
        />
      )}
      
      <Table 
        dataSource={filesList} 
        columns={columns} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      
      <DownloadSection />
    </Card>
  )
}