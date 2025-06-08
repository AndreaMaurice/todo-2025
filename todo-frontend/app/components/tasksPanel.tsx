'use client';

import React, { useState } from 'react';
import { useAppSelector } from '../hooks';
import CreateTask from './createTask';
import ViewUpdateTask from './viewUpdateTask';
import { RootState } from '../store/store';

export const TaskPanel: React.FC = () => {
  const taskPanelMode = useAppSelector((state) => state.ui.taskPanelMode);
  
    let content;
    switch (taskPanelMode) {
      case 'creating':
        content = <CreateTask />;
        break;
      case 'viewing':
        content = <ViewUpdateTask />;
        break;
      default:
        content = <CreateTask />;
        break;
    }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {content}
    </div>
  );
}

export default TaskPanel;