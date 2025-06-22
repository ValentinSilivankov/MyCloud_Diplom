import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const formatFileSize = (bytes: unknown): string => {
  
  const size = typeof bytes === 'string' ? parseFloat(bytes) : Number(bytes);
  
  if (isNaN(size)) {
    console.error('Invalid size value received:', bytes);
    return 'N/A';
  }
  
  if (size < 0) return 'N/A';
  if (size === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(size) / Math.log(k));

  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};