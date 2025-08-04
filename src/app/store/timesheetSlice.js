import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTimesheets = createAsyncThunk('timesheets/fetch', async (userId) => {
  const url = userId ? `http://localhost:3001/timesheets?userId=${userId}` : 'http://localhost:3001/timesheets';
  const response = await fetch(url);
  return response.json();
});

export const updateTimesheet = createAsyncThunk('timesheets/update', async (timesheetData) => {
  const existing = await fetch(`http://localhost:3001/timesheets?userId=${timesheetData.userId}&taskId=${timesheetData.taskId}&date=${timesheetData.date}`);
  const existingData = await existing.json();
  
  if (existingData.length > 0) {
    const response = await fetch(`http://localhost:3001/timesheets/${existingData[0].id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...existingData[0], ...timesheetData })
    });
    return response.json();
  } else {
    const response = await fetch('http://localhost:3001/timesheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...timesheetData, submitted: false })
    });
    return response.json();
  }
});

export const submitTimesheet = createAsyncThunk('timesheets/submit', async ({ userId, date }) => {
  const response = await fetch(`http://localhost:3001/timesheets?userId=${userId}&date=${date}`);
  const timesheets = await response.json();
  
  const updates = await Promise.all(
    timesheets.filter(t => !t.submitted).map(t => 
      fetch(`http://localhost:3001/timesheets/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...t, submitted: true })
      }).then(res => res.json())
    )
  );
  
  return updates;
});

const timesheetSlice = createSlice({
  name: 'timesheets',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimesheets.pending, (state) => { state.loading = true; })
      .addCase(fetchTimesheets.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(updateTimesheet.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id);
        if (index >= 0) state.items[index] = action.payload;
        else state.items.push(action.payload);
      })
      .addCase(submitTimesheet.fulfilled, (state, action) => {
        action.payload.forEach(updated => {
          const index = state.items.findIndex(t => t.id === updated.id);
          if (index >= 0) state.items[index] = updated;
        });
      });
  }
});

export default timesheetSlice.reducer;