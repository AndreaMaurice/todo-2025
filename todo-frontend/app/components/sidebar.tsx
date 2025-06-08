'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from '../store/store';
import { fetchTodos, addNewTodo, updateExistingTodo, deleteExistingTodo } from "../slices/todoSlice";
import { setTasksPanelMode, setActiveTask } from "../slices/uiSlice";
import { ListChecks, ClockFading, SquarePen, Trash2 } from 'lucide-react';


export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos } = useAppSelector((state: RootState) => state.todo);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchValue.toLowerCase())
  );

  // const completedTodos = todos.filter(todo =>
  //   todo.completed == true
  // );

  // const pendingTodos = todos.filter(todo =>
  //   todo.completed == false
  // );

 const limitContent = (text: string, maxWords: number) => {
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
};

const createNewTask = () => {
  dispatch(setTasksPanelMode('creating'));
}

  return (
      <div className="w-[400px] flex flex-col border-r border-gray-200 h-screen">
        <div className="p-4 pb-0">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Tasks</h1>
            <button onClick={createNewTask} className="text-blue-500 hover:text-blue-300" aria-label="Create New Task">
              <SquarePen />
            </button>
          </div>
          <input
            type="search"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Search"
            aria-label="Search todos"
            className="rounded-sm bg-gray-200 p-2 placeholder-gray-400 focus:outline-gray-300 w-full mb-4"
          />
          <h2 className="text-lg font-semibold mb-2">All Tasks</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 scroll-smooth">
          <ul className="space-y-2 snap-y snap-mandatory">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <li
                  key={todo._id}
                  onClick={() => {
                    dispatch(setActiveTask(todo._id));
                    dispatch(setTasksPanelMode('viewing'));
                  }}
                  className="rounded-sm p-2 w-full text-left bg-gray-200 hover:bg-gray-300 transition-colors snap-center"
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => {
                            dispatch(updateExistingTodo({ ...todo, completed: !todo.completed }));
                          }}
                          className="w-4 h-4 accent-blue-600 rounded-md border-gray-300 border-2 focus:ring-2 focus:ring-blue-400 transition"
                        />
                      </label>
                      <span className={`font-bold ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                        {todo.title}
                      </span>
                    </div>
                    <button
                      onClick={() => dispatch(deleteExistingTodo(todo._id))}
                      className="text-red-500 hover:bg-red-500 hover:text-white rounded-sm p-1"
                      aria-label={`Delete todo ${todo.title}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className='flex justify-between items-center'>
                    <div className="text-xs text-gray-700">{limitContent(todo.content, 10)}</div>
                    <div className="text-xs text-gray-700">
                      {new Date(todo.createdOn).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>  
                  </div>
                </li>
              ))
            ) : (
              <li className="my-4">No tasks found.</li>
            )}
          </ul>
        </div>
        {/* <div className="p-4 pb-12 border-t border-gray-200 space-y-2">
          <button
            onClick={() => dispatch(fetchTodos())}
            className="rounded-sm p-2 w-full text-left flex gap-2 hover:bg-blue-200 hover:text-blue-700"
            aria-label="Completed tasks"
          >
            <ListChecks />
            Completed
          </button>
          <button
            onClick={() => dispatch(fetchTodos())}
            className="rounded-sm p-2 w-full text-left flex gap-2 hover:bg-blue-200 hover:text-blue-700"
            aria-label="Pending tasks"
          >
            <ClockFading />
            Pending
          </button>
        </div> */}
      </div>
);
};

export default Sidebar;
