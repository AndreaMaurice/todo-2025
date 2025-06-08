import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TaskPanelMode = 'creating' | 'viewing';

interface UiState {
  taskPanelMode: TaskPanelMode;
  isSidebarVisible: boolean;
  activeTaskId: string | null;
}

const initialState: UiState = {
  taskPanelMode: 'creating',
  activeTaskId: null,
  isSidebarVisible: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTasksPanelMode: (state, action: PayloadAction<TaskPanelMode>) => {
      state.taskPanelMode = action.payload;
    },
    showSidebar: (state) => {
      state.isSidebarVisible = true;
    },
    hideSidebar: (state) => {
      state.isSidebarVisible = false;
    },
    toggleSidebar: (state) => {
      state.isSidebarVisible = !state.isSidebarVisible;
    },
    setActiveTask: (state, action: PayloadAction<string | null>) => {
      state.activeTaskId = action.payload;
      state.taskPanelMode = action.payload ? 'viewing' : 'creating';
    },
  },
});

export const { setTasksPanelMode, showSidebar, hideSidebar, toggleSidebar, setActiveTask } = uiSlice.actions;
export default uiSlice.reducer;