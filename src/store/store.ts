import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "store/reducer.root";
import rootSaga from "store/saga.root";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

const enhancer = composeEnhancers(
    applyMiddleware(sagaMiddleware),
);

const store = createStore(
    rootReducer,
    {
        auth: {
            plainTextToken: localStorage.getItem("plainTextToken")?.toString(),
        },
    },
    enhancer,
);

sagaMiddleware.run(rootSaga);

store.subscribe(() => {
    const { auth } = store.getState();

    if (auth.plainTextToken) {
        localStorage.setItem("plainTextToken", auth.plainTextToken);
    } else {
        localStorage.removeItem("plainTextToken");
    }
});

export default store;