import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/user.slice.js'; // Import your slice

const store = configureStore({
  reducer: {
    auth: authReducer, // Add reducers here
  },
});

export default store;