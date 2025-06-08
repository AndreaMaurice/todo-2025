// app/hooks.ts (or src/hooks.ts)
import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
// IMPORTANT: Adjust this path to correctly point to your store/store.ts file
import type { RootState, AppDispatch } from './store/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// This creates a pre-typed version of the `useDispatch` hook
export const useAppDispatch: () => AppDispatch = useDispatch;

// This creates a pre-typed version of the `useSelector` hook
// It knows the shape of your entire Redux state (RootState)
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Optional: Creates a pre-typed version of the `useStore` hook
// This is less common but can be useful in advanced scenarios
// export const useAppStore: () => AppStore = useStore;