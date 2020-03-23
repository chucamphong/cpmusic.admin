import { combineReducers } from "redux";
import { reducer as auth } from "modules/Auth";
import { reducer as loading } from "modules/Loading";

export default combineReducers({
    auth,
    loading,
});
