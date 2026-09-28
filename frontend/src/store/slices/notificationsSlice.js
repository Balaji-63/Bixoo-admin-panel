import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  connected: false,
  alerts: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    connectionEstablished(state) {
      state.connected = true;
    },
    connectionError(state) {
      state.connected = false;
    },
    addAlert(state, action) {
      state.alerts.unshift({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
      state.unreadCount += 1;
    },
    clearAlert(state, action) {
      state.alerts = state.alerts.filter(a => a.id !== action.payload.id);
    },
    markAllRead(state) {
      state.unreadCount = 0;
    }
  }
});

export const notificationsActions = notificationsSlice.actions;
export default notificationsSlice.reducer;