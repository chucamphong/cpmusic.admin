import produce from "immer";
import { AuthAction, AuthState } from "modules/Auth/types";
import { Reducer } from "typesafe-actions";

type AuthReducer = Reducer<Readonly<AuthState>, AuthAction>;

const authReducer: AuthReducer = (state = {}, action) => {
    return produce(state, draft => {
        switch (action.type) {
            case "@auth/LOGIN_STATUS":
                draft.status = action.payload;
                break;
            case "@auth/LOGIN_SUCCESS":
                return {
                    plainTextToken: action.payload.plainTextToken,
                };
            case "@auth/LOGIN_FAILURE":
                return {
                    message: action.payload.message,
                    errors: action.payload.errors,
                };

            case "@auth/FETCH_ME_SUCCESS":
                draft.user = action.payload;
                break;
            case "@auth/FETCH_ME_FAILURE":
                return {
                    status: "error",
                    message: action.payload.message,
                    errors: {
                        email: [],
                        password: [],
                    },
                };
            case "@auth/LOGOUT_SUCCESS":
                return {};
            case "@auth/LOGOUT_FAILURE":
                alert("Đăng xuất thất bại");
                break;
            default:
                return draft;
        }
    });
};

export default authReducer;
