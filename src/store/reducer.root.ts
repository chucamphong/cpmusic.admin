import { reducer as auth } from "modules/Auth";
import { reducer as loading } from "modules/Loading";
import { combineReducers } from "redux";

export default combineReducers({
    auth,
    loading,
});
