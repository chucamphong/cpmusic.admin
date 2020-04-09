import produce from "immer";
import { UserAction, UserState } from "pages/User/types";
import { Reducer } from "typesafe-actions";

type UserReducer = Reducer<Readonly<UserState>, UserAction>;

const userReducer: UserReducer = (state = {}, action) => {
    return produce(state, draft => {
        switch (action.type) {
            case "@users/USERS_SUCCESS":
                draft.list = action.payload;
                break;
            case "@users/USERS_STATUS":
                draft.status = action.payload;
                break;
            default:
                return draft;
        }
    });
};

export default userReducer;
