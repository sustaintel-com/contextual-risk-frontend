import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from './Slises/authSlice';
import storage from 'redux-persist/es/storage/session';

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer

});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // or add 'layerManagement', 'monitoringTree' as needed
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
