import { CloudUploadOutlined, LeftOutlined, RollbackOutlined } from '@ant-design/icons'
import { Flex, FloatButton, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { usersState } from '../../redux/slices/usersSlice'
import FileUploader from '../FileUploader/FileUploader'
import { getUsersList } from '../../services/userServices'

const goBackStyle: React.CSSProperties = {
    position: 'absolute',
    insetInlineEnd: '60px',
    bottom: '-60px',
};

const uploadStyle: React.CSSProperties = {
    position: 'absolute',
    insetInlineEnd: '15px',
    bottom: '-60px',
};

export default function DownloadSection() {
    const { currentUser } = useAppSelector(usersState);
    const [ showUploadForm, setShowUploadForm] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // const handleGoBack = () => {
    //     navigate('/admin');
    // };

    const handleGoBack = useCallback(() => {
    // Перед возвратом обновляем список пользователей
    dispatch(getUsersList()).then(() => {
      navigate('/admin');
    });
  }, [dispatch, navigate]);

    return (
        <>        
        {showUploadForm ? 
            <FileUploader setShowForm={setShowUploadForm} /> :
            
            <Flex justify='space-evenly' align='center'>
                {currentUser?.is_staff && 
                    <FloatButton.Group
                        key='delete_group'
                        shape='square'
                        placement='left'
                        style={goBackStyle}
                        icon={<LeftOutlined key='delete' />}
                    >
                        <Tooltip 
                            placement='left'
                            title='Вернуться к списку пользователей'
                        >
                            <FloatButton
                                key='open'
                                icon={<RollbackOutlined/>}
                                onClick={handleGoBack} />
                        </Tooltip>
                    </FloatButton.Group>
                }
                <FloatButton.Group
                    key='upload_group'
                    shape='square'
                    placement='left'
                    style={uploadStyle}
                    icon={<LeftOutlined key='upload' />}
                >
                    <Tooltip 
                        placement='bottom'
                        title='Загрузить файл'
                    >
                    <FloatButton 
                        key='upload'
                        icon={<CloudUploadOutlined/>}
                        onClick={() => setShowUploadForm(!showUploadForm)} />
                    </Tooltip>
                </FloatButton.Group>
            </Flex>
        }
    </>
  );
}