import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '../slices/todoSlice';
import uiReducer from '../slices/uiSlice';

export const store = configureStore({
  reducer: {
    todo: todoReducer,
    ui: uiReducer,
  },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
