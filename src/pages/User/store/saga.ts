import { AxiosResponse } from "axios";
import { users } from "pages/User/store/actions";
import { UserList } from "pages/User/types";
import { all, call, put, takeLatest } from "redux-saga/effects";
import usersService from "services/usersService";

type FetchUsersType = ReturnType<typeof users.request>;

export function* fetchUsers({ payload }: FetchUsersType) {
    yield put(users.status("pending"));

    try {
        const response: AxiosResponse<UserList> = yield call(usersService.fetch, payload);

        yield put(users.success(response.data));
        yield put(users.status("success"));
    } catch (error) {
        yield put(users.failure(error));
        yield put(users.status("error"));
    }
}

export default function* usersSaga() {
    yield all([
        takeLatest(users.request, fetchUsers),
    ]);
}
