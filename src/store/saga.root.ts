import { authSaga } from "modules/Auth";
import usersSaga from "pages/User/store/saga";
import { all, fork } from "redux-saga/effects";

export default function* root() {
    yield all([
        fork(authSaga),
        fork(usersSaga),
    ]);
}
