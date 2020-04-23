import { isNumber } from "lodash";
import isEqual from "lodash/isEqual";
import { actions, Role, User } from "modules/Auth";
import { useDispatch } from "react-redux";
import useSelector from "store/hooks/useSelector";
import { AppDispatch } from "store/types";

const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const token = useSelector(state => state.auth.plainTextToken, isEqual);
    const user = useSelector(state => state.auth.user, isEqual);

    return {
        login(email: string, password: string) {
            dispatch(actions.login.request({ email, password }));
        },
        logout() {
            dispatch(actions.logout.request());
        },
        isAuthenticated(): boolean {
            return !!(token && user);
        },
        hasRole(role: Role): boolean {
            if (!this.isAuthenticated()) return false;

            return user?.role === role;
        },
        isMe(entity: User | number): boolean {
            if (isNumber(entity)) {
                return user?.id === entity;
            }

            return isEqual(user, entity);
        },
        user,
    };
};

export default useAuth;
