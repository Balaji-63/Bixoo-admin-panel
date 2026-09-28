
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import requirementsReducer from './slices/requirementsSlice';
import notificationsReducer from './slices/notificationsSlice';
import { idempotencyMiddleware } from './middleware/idempotencyMiddleware';
import { outboxSocketMiddleware } from './middleware/outboxSocketMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requirements: requirementsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
      .concat(idempotencyMiddleware)
      .concat(outboxSocketMiddleware),
});