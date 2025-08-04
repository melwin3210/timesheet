import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTasks = createAsyncThunk('tasks/fetch', async (userId) => {
  const url = userId ? `http://localhost:3001/tasks?assignedTo=${userId}` : 'http://localhost:3001/tasks';
  const response = await fetch(url);
  return response.json();
});

export const createTask = createAsyncThunk('tasks/create', async (taskData) => {
  const response = await fetch('http://localhost:3001/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...taskData, estimatedHours: parseFloat(taskData.estimatedHours) })
  });
  return response.json();
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { items: [], loading: false },
  reducers: {
    initializeTasks: (state, action) => {
      if (state.items.length === 0) {
        state.items = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(createTask.fulfilled, (state, action) => { state.items.push(action.payload); });
  }
});

export const { initializeTasks } = taskSlice.actions;
export default taskSlice.reducer;