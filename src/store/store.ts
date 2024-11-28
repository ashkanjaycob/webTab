import { configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';
import languageReducer from '../features/language/languageSlice';
import authReducer from '../features/auth/authSlice';
import bpmnReducer from '../features/bpmn/bpmnSlice';
import formioReducer from '../features/formio/formioSlice';
import { authMiddleware } from './authMiddleware';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    auth: authReducer,
    bpmn: bpmnReducer,
    formio: formioReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware, thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
