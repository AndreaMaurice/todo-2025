import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/todos';

interface Todo {
  _id: string;
  title: string;
  content: string;
  completed: boolean;
  createdOn: Date;
}

interface TodoState {
  todos: Todo[];
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  error: null,
};

// --- Async Thunks for API Interaction ---

// Thunk for fetching all todos
export const fetchTodos = createAsyncThunk<Todo[], void>(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
);

// Thunk for adding a new todo
// newTodoData will contain title and content
export const addNewTodo = createAsyncThunk<Todo, { title: string; content: string }>(
  'todos/addNewTodo',
  async (newTodoData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_BASE_URL, newTodoData);
      return response.data; // API should return the newly created todo with its _id
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
);

// Thunk for updating an existing todo
// updateTodoData will contain _id and potentially title, content, completed
export const updateExistingTodo = createAsyncThunk<
  Todo, // Expected return type (the updated todo)
  Partial<Todo> & { _id: string } // Payload: _id is required, other fields are optional
>(
  'todos/updateExistingTodo',
  async (updateTodoData, { rejectWithValue }) => {
    const { _id, ...fieldsToUpdate } = updateTodoData;
    try {
      // Send a PUT request to the specific todo endpoint
      const response = await axios.put(`${API_BASE_URL}/${_id}`, fieldsToUpdate);
      return response.data; // API should return the updated todo
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
);


// Thunk for deleting a todo
export const deleteExistingTodo = createAsyncThunk<string, string>( // Returns the deleted ID (string), takes the ID as argument (string)
  'todos/deleteExistingTodo',
  async (todoId, { rejectWithValue }) => {
    try {
      // Change: now expects an object { msg: string, id: string }
      const response = await axios.delete(`${API_BASE_URL}/${todoId}`);
      // Return the ID from the response data
      return response.data.id; // Extract the id from the returned object
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
);

// --- Todo Slice Definition ---
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.todos = action.payload;
      })
      .addCase(addNewTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.todos.unshift(action.payload);
      })
      .addCase(updateExistingTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        const index = state.todos.findIndex(todo => todo._id === action.payload._id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(deleteExistingTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.todos = state.todos.filter(todo => todo._id !== action.payload);
      })
  },
});

export default todoSlice.reducer;