import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk('auth/login', async ({ username, password }) => {
  const response = await fetch('http://localhost:3001/users');
  const users = await response.json();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) throw new Error('Invalid credentials');
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
});

export const signupUser = createAsyncThunk('auth/signup', async ({ username, password, name }) => {
  const usersResponse = await fetch('http://localhost:3001/users');
  const users = await usersResponse.json();
  
  if (users.find(u => u.username === username)) {
    throw new Error('Username already exists');
  }
  
  const response = await fetch('http://localhost:3001/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, name, role: 'associate' })
  });
  
  const newUser = await response.json();
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('currentUser') || 'null') : null, 
    loading: false, 
    error: null 
  },
  reducers: {
    logout: (state) => { 
      state.user = null; 
      if (typeof window !== 'undefined') localStorage.removeItem('currentUser');
    },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { 
        state.loading = false; 
        state.user = action.payload;
        if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signupUser.fulfilled, (state, action) => { 
        state.loading = false; 
        state.user = action.payload;
        if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(action.payload));
      })
      .addCase(signupUser.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;