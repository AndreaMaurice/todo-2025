'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { RootState } from '../store/store';
import { updateExistingTodo } from '../slices/todoSlice';
import { setTasksPanelMode, toggleSidebar } from '../slices/uiSlice';
import { Expand, Save, X } from 'lucide-react';

const ViewUpdateTask: React.FC = () => {
  const dispatch = useAppDispatch();

  const activeTaskId = useAppSelector((state: RootState) => state.ui.activeTaskId);
  const todos = useAppSelector((state: RootState) => state.todo.todos);
  const selectedTask = todos.find((todo) => todo._id === activeTaskId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize title and content from selectedTask
  useEffect(() => {
  if (selectedTask) {
    setTitle(selectedTask.title);
    setContent(selectedTask.content);
    setIsCompleted(selectedTask.completed);
  }
}, [selectedTask]);

// Handle changes to title and content, unmark completion if changed
  const handleTitleChange = (value: string) => {
  setTitle(value);
  if (selectedTask?.completed && value !== selectedTask.title) {
    setIsCompleted(false);
  }
};

const handleContentChange = (value: string) => {
  setContent(value);
  if (selectedTask?.completed && value !== selectedTask.content) {
    setIsCompleted(false);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !selectedTask) return;

    try {
      await dispatch(updateExistingTodo({
        _id: selectedTask._id,
        title,
        content,
        completed: isCompleted
      })).unwrap();

    } catch (error) {
      console.error('Failed to save Task:', error);
    }
  };

  if (!selectedTask) {
    return (
      <div className="p-4 text-gray-500">
        <p>Task deleted.</p>
      </div>
    );
  }

  return (
<form onSubmit={handleSubmit} className="p-4 flex flex-col h-full">
      <div className="flex justify-end">
        <button
          aria-label='Expand'
          onClick={() => dispatch(toggleSidebar())}
          className="hover:text-blue-300 text-blue-500 font-bold p-2 focus:outline-none"
        >
          <Expand />
        </button>
        <button
          aria-label='Save'
          type="submit"
          className="hover:text-blue-300 text-blue-500 font-bold p-2 rounded focus:outline-none"
        >
          <Save />
        </button>
        <button
        aria-label='Exit'
          type="button"
          onClick={() => dispatch(setTasksPanelMode('creating'))}
          className="hover:text-red-300 text-red-500 font-bold p-2 rounded focus:outline-none"
        >
          <X />
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          id="title"
          placeholder='Title'
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full py-2 px-1 leading-tight border-b-2 border-b-gray-300 text-xl focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col h-full">
      <textarea
        placeholder='Content'
        id="content"
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        className="flex-1 py-2 px-1 leading-tight focus:outline-none resize-none"
      ></textarea>
    </div>
    </form>
  );
};

export default ViewUpdateTask;
