import { reducer as auth } from "modules/Auth";
import { reducer as loading } from "modules/Loading";
import { default as users } from "pages/User/store/reducer";
import { combineReducers } from "redux";

export default combineReducers({
    loading,
    auth,
    users,
});
