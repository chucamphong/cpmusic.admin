import { useDispatch } from "react-redux";
import { AppDispatch } from "store/types";
import useSelector from "store/hooks/useSelector";
import isEqual from "lodash/isEqual";
import { actions } from "modules/Auth";

const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const token = useSelector(state => state.auth.plainTextToken, isEqual);
    const user = useSelector(state => state.auth.user, isEqual);

    function login(email: string, password: string) {
        dispatch(actions.login.request({ email, password }));
    }

    function logout() {
        dispatch(actions.logout.request());
    }

    function isAuthenticated() {
        return token && user;
    }

    function refresh() {
        dispatch(actions.me.request());
    }

    return {
        login,
        logout,
        isAuthenticated,
        refresh,
        user
    };
};

export default useAuth;