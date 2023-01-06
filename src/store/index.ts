import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './reducers/auth-slice';
import { electionTypeApiSlice } from './reducers/election-type-api-slice';
import { feedbackApiSlice } from './reducers/feedback-api-slice';
import rolesApiSlie from './reducers/roles-api-slices';
import { statesApiSlice } from './reducers/states-api-slice';
import usersApiSlice from './reducers/users-api-slice';
import { votersApiSlice } from './reducers/voters-api-slice';
import { votesApiSlice } from './reducers/votes-api-slice';

export const configureStoreWithMiddleware = (initialState = {}) => {
  const rootPersistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
  };

  const rootReducer = combineReducers({
    auth: authReducer,
    [rolesApiSlie.reducerPath]: rolesApiSlie.reducer,
    [usersApiSlice.reducerPath]: usersApiSlice.reducer,
    [electionTypeApiSlice.reducerPath]: electionTypeApiSlice.reducer,
    [votersApiSlice.reducerPath]: votersApiSlice.reducer,
    [feedbackApiSlice.reducerPath]: feedbackApiSlice.reducer,
    [votesApiSlice.reducerPath]: votesApiSlice.reducer,
    [statesApiSlice.reducerPath]: statesApiSlice.reducer,
  });

  const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        rolesApiSlie.middleware,
        usersApiSlice.middleware,
        electionTypeApiSlice.middleware,
        votersApiSlice.middleware,
        feedbackApiSlice.middleware,
        votesApiSlice.middleware,
        statesApiSlice.middleware,
      ]),
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: initialState,
  });

  const persistor = persistStore(store);

  return { store, persistor };
};

export const { store, persistor } = configureStoreWithMiddleware();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
