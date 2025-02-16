import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import auth from "./auth";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import storage from "redux-persist/lib/storage";
import { Api } from "../services/api";

const reducers = combineReducers({
  auth,
  [Api.reducerPath]: Api.reducer,
});

const persistConfig = {
  key: "persist-for-learning-purpose-change-this-for-production",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(Api.middleware);
    return middlewares;
  },
});

const persistor = persistStore(store);

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof reducers>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAppDispatch = () => useDispatch<any>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export { store, persistor };
