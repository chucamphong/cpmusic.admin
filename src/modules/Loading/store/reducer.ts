import produce from "immer";
import { ActionType, Reducer } from "typesafe-actions";
import * as actions from "modules/Loading/store/actions";

type State = {
    status: "nothing" | "pending" | "success" | "failure"
};

const initialState: State = {
    status: "nothing"
};

type LoadingReducer = Reducer<Readonly<State>, ActionType<typeof actions>>;

const loadingReducer: LoadingReducer = (state = initialState, action) => {
    return produce(state, draft => {
        switch (action.type) {
            case "@loading/PENDING":
                draft.status = "pending";
                break;
            case "@loading/SUCCESS":
                draft.status = "success";
                break;
            case "@loading/FAILURE":
                draft.status = "failure";
                break;
            default:
                return state;
        }
    });
};

export default loadingReducer;