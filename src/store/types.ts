import store from "./store";
import rootReducer from "store/reducer.root";

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
