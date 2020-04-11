import { useAuth } from "modules/Auth";
import AbilityContext from "modules/CASL/AbilityContext";
import DashBoardContainer from "modules/Dashboard/containers/DashBoard";
import AccessDenied from "pages/Error/AccessDenied";
import React, { useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

type Props = {
    action?: string;
    subject?: string;
};

const ProtectedRoute: React.FC<RouteProps & Props> = ({ children, action, subject, ...rest }) => {
    const auth = useAuth();
    const ability = useContext(AbilityContext);

    if (auth.isAuthenticated()) {
        return (
            <Route {...rest} render={() => {
                const okay = action && subject ? ability.can(action, subject) : true;
                return !auth.hasRole("member") && okay ?
                    <DashBoardContainer>{children}</DashBoardContainer> :
                    <AccessDenied />;
            }} />
        );
    }

    return (
        <Route {...rest} render={({ location }) => (
            <Redirect to={{ pathname: "/dang-nhap", state: { from: location } }} />
        )} />
    );
};

export default ProtectedRoute;
