'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addNewTodo } from '../slices/todoSlice';
import { setTasksPanelMode, toggleSidebar } from '../slices/uiSlice';
import { Expand, Save, X } from 'lucide-react';

export const CreateTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return;
    }

    try {
      await dispatch(addNewTodo({ title, content })).unwrap();

      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col h-full">
      <div className="flex justify-end">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="hover:text-blue-300 text-blue-500 font-bold p-2 focus:outline-none"
        >
          <Expand />
        </button>
        <button
          type="submit"
          className="hover:text-blue-300 text-blue-500 font-bold p-2 rounded focus:outline-none"
        >
          <Save />
        </button>
        <button
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
          onChange={(e) => setTitle(e.target.value)}
          className="w-full py-2 px-1 leading-tight border-b-2 border-b-gray-300 text-xl focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col h-full">
      <textarea
        placeholder='Content'
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 py-2 px-1 leading-tight focus:outline-none resize-none"
      ></textarea>
    </div>
    </form>
  );
};

export default CreateTask;