import { AxiosError, AxiosResponse } from "axios";
import { actions, LoginFailedResponse, LoginResponse, User } from "modules/Auth";
import { actions as loadingActions } from "modules/Loading";
import { all, call, fork, put, take } from "redux-saga/effects";
import authService from "services/authService";

type LoginActionType = ReturnType<typeof actions.login.request>;

/**
 * Thực hiện đăng nhập
 */
export function* login() {
    while (true) {
        const { payload }: LoginActionType = yield take(actions.login.request);
        const { email, password } = payload;

        yield put(actions.login.status("pending"));

        try {
            const response: AxiosResponse<LoginResponse> = yield call(authService.login, email, password);
            yield put(actions.login.success(response.data));
            yield put(actions.me.request());
            yield put(actions.login.status("success"));
        } catch (e) {
            const error = e as AxiosError<LoginFailedResponse>;

            const data = error.response?.data ?? {
                message: "Không thể kết nối máy chủ",
                errors: {},
            };

            yield put(actions.login.failure(data));
            yield put(actions.login.status("error"));
        }
    }
}

/**
 * Lấy thông tin của tài khoản "me"
 */
export function* fetchMe() {
    const checkRole = (role: string) => {
        if (!["admin", "mod"].includes(role)) {
            throw new Error("Bạn không có quyền truy cập.");
        }
    };

    while (true) {
        yield take(actions.me.request);

        yield put(loadingActions.pending());

        try {
            const response: AxiosResponse<User> = yield call(authService.me);
            checkRole(response.data.role);

            yield put(actions.me.success(response.data));
            yield put(loadingActions.success());
        } catch (error) {
            yield put(actions.me.failure(error));
            yield put(loadingActions.failure());
        }
    }
}

export function* logout() {
    while (true) {
        yield take(actions.logout.request);
        yield put(loadingActions.pending());
        try {
            yield call(authService.logout);
            yield put(actions.logout.success());
            yield put(loadingActions.success());
        } catch (error) {
            yield put(actions.logout.failure());
            yield put(loadingActions.failure());
        }
    }
}

export default function* authSaga() {
    yield all([
        fork(login),
        fork(fetchMe),
        fork(logout),
    ]);

    if (localStorage.getItem("plainTextToken")) {
        yield put(actions.me.request());
    }
}
