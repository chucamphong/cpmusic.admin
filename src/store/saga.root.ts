import { all, fork } from "redux-saga/effects";
import { authSaga } from "modules/Auth";

export default function* root() {
    yield all([
        fork(authSaga),
    ]);
}