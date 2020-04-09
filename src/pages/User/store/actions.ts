import { UserList } from "pages/User/types";
import { createAction } from "typesafe-actions";

export const users = {
    request: createAction("@users/USERS_REQUEST")<string>(),
    status: createAction("@users/USERS_STATUS")<"pending" | "success" | "error">(),
    success: createAction("@users/USERS_SUCCESS")<UserList>(),
    failure: createAction("@users/USERS_FAILURE")<{message: string}>(),
};
