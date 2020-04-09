import { authSaga } from "modules/Auth";
import { all, fork } from "redux-saga/effects";

export default function* root() {
    yield all([
        fork(authSaga),
    ]);
}
