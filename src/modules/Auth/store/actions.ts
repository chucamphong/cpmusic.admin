import { Credentials, LoginFailedResponse, LoginResponse, User } from "modules/Auth/types";
import { createAction, createAsyncAction } from "typesafe-actions";

export const login = {
    request: createAction("@auth/LOGIN_REQUEST")<Credentials>(),
    status: createAction("@auth/LOGIN_STATUS")<"pending" | "success" | "error">(),
    success: createAction("@auth/LOGIN_SUCCESS")<LoginResponse>(),
    failure: createAction("@auth/LOGIN_FAILURE")<LoginFailedResponse>()
};

export const me = createAsyncAction(
    "@auth/FETCH_ME_REQUEST",
    "@auth/FETCH_ME_SUCCESS",
    "@auth/FETCH_ME_FAILURE",
    "@auth/FETCH_ME_CANCEL"
)<undefined, User, Error, undefined>();

export const logout = createAsyncAction(
    "@auth/LOGOUT_REQUEST",
    "@auth/LOGOUT_SUCCESS",
    "@auth/LOGOUT_FAILURE"
)<undefined, undefined, undefined>();
