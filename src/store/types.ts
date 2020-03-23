import rootReducer from "./reducer.root";
import store from "./store";

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;