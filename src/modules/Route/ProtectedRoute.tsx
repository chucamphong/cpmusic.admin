import { useAuth } from "modules/Auth";
import DashBoardContainer from "modules/Dashboard/containers/DashBoard";
import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

const ProtectedRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
    const auth = useAuth();

    if (auth.isAuthenticated()) {
        return (
            <Route {...rest} render={() => {
                return !auth.hasRole("member") ?
                    <DashBoardContainer>{children}</DashBoardContainer> :
                    <Redirect to={{ pathname: "/khong-co-quyen-truy-cap" }} />;
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
