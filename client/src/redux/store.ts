import { configureStore, combineReducers } from "@reduxjs/toolkit"
import storage from "redux-persist/lib/storage" // defaults to localStorage for web
import { persistReducer, persistStore } from "redux-persist"
import authReducer from "./authSlice"

// ✅ configure persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only auth slice will be persisted
}

const rootReducer = combineReducers({
  auth: authReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist stores non-serializable stuff
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
