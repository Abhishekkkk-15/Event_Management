import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  userData: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.userData = null
    },
    setUserData: (state,action)=>{
      console.log(action.payload)
      state.userData = action.payload
    }
  },
});

export const { loginSuccess, logoutUser,setUserData } = authSlice.actions;
export default authSlice.reducer;
