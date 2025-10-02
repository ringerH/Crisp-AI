import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'interviewee', // 'interviewee' or 'dashboard'
  dashboardSearchQuery: '',
  showWelcomeModal: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setShowWelcomeModal: (state, action) => { // <-- Add this reducer
        state.showWelcomeModal = action.payload;
    },
  },
});

export const { setActiveTab, setShowWelcomeModal } = appSlice.actions;
export default appSlice.reducer;