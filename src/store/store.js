import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import interviewReducer from './interviewSlice';
import candidatesReducer from './candidatesSlice';
import appReducer from './appSlice';

const rootReducer = combineReducers({
  interview: interviewReducer,
  candidates: candidatesReducer,
  app: appReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  
  whitelist: ['interview', 'candidates', 'app'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);