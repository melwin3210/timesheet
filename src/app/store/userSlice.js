import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetch', async (role) => {
  const url = role ? `http://localhost:3001/users?role=${role}` : 'http://localhost:3001/users';
  const response = await fetch(url);
  return response.json();
});

const userSlice = createSlice({
  name: 'users',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; });
  }
});

export default userSlice.reducer;