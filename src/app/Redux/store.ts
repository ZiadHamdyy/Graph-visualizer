import { configureStore } from "@reduxjs/toolkit";
import graphReducer from "./graphSlice";
import jsonReducer from "./jsonSlice";

export const store = configureStore({
  reducer: {
    graph: graphReducer,
    json: jsonReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["graph/setCurrentGraph"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.instance"],
        // Ignore these paths in the state
        ignoredPaths: ["graph.currentGraph"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
