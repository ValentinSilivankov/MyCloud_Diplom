import { createSlice } from '@reduxjs/toolkit'
import { IFile } from '../../models'
import { 
  changeFile,
  deleteFile,
  downloadFile,
  getFileLink,
  getFilesList,
  uploadFile 
} from '../../services/fileServices'


interface FilesState {
  filesList: IFile[];
  isLoading: boolean;
  error: string;
  lastDownloaded: number | null;
}

const initialState: FilesState = {
  filesList: [],
  isLoading: false,
  error: '',
  lastDownloaded: null,
};
// interface InitialState {
//   filesList: IFile[],
//   isLoading: boolean,
//   error: string,
//   lastDownloaded:number | null;
// }

// const initialState: InitialState = {
//   filesList: [],
//   isLoading: true,
//   error: '',
//   lastDownloaded: null,
// };

const FilesSlice = createSlice({
  name: 'files',
  initialState,
  // selectors: {
  //   filesState: (state) => state,
  // },
  reducers: {
    clearFilesList: (state) => {
      state.filesList = [];
    },
    clearError: (state) => {
      state.error = '';
    },
    resetLastDownloaded: (state) => {
      state.lastDownloaded = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getFilesList.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getFilesList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filesList = action.payload.map((file: IFile) =>({
          ...file,
          key: file.id.toString(),
          size: file.size
        }));
        // state.filesList.forEach((file) => {
        //   file.key = file.id.toString();
        // });
      })
      .addCase(getFilesList.rejected, (state, action) => {
        if (action.error.message !== 'Duplicate request blocked') {
          state.error = action.payload as string;
        }
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(uploadFile.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(changeFile.pending, (state) => {
        state.error = '';
      })
      .addCase(changeFile.fulfilled, (state, action) => {
        state.filesList = state.filesList.map(file =>
          file.id === action.payload.id ? action.payload : file
        );
      })
      .addCase(changeFile.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(downloadFile.pending, (state) => {
        state.error = '';
      })
      .addCase(downloadFile.fulfilled, (state, action) => {
        state.lastDownloaded = action.payload;
        state.filesList = state.filesList.map(file => {
          if (file.id === action.payload) {
            return { ...file, downloaded: new Date().toISOString() };
          }
          return file;
        });
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(getFileLink.pending, (state) => {
        state.error = '';
      })
      .addCase(getFileLink.fulfilled, (state, action) => {
        state.filesList = state.filesList.map(file => {
          if (file.id === action.payload.id) {
            return { ...file, special_link: action.payload.link };
          }
          return file;
        });
      })
      .addCase(getFileLink.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(deleteFile.pending, (state) => {
        state.error = '';
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.filesList = state.filesList.filter(
          file => file.id !== action.payload
        );
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});


export const { clearFilesList, clearError, resetLastDownloaded } = FilesSlice.actions;

export const filesState = (state: { files: FilesState }) => state.files;
export default FilesSlice.reducer;