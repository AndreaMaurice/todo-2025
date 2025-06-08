'use client';

import React from 'react';
import { RootState } from './store/store';
import Sidebar from "./components/sidebar";
import TaskPanel from "./components/tasksPanel";
import { useAppDispatch, useAppSelector } from './hooks';

export default function Home() {
    const isSidebarVisible = useAppSelector((state: RootState) => state.ui.isSidebarVisible);
  return (
    <div className="flex h-screen overflow-hidden">
  {isSidebarVisible && (
    <Sidebar />
  )}
  <div className={`flex-1 overflow-y-auto ${!isSidebarVisible ? 'px-80' : ''}`}>
    <TaskPanel />
  </div>
</div>

  );
}
