import useAuth from "modules/Auth/hooks/useAuth";
import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

const ProtectedRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
    const auth = useAuth();

    return (
        <Route {...rest} render={({ location }) => {
            return auth.isAuthenticated() ? children :
                <Redirect to={{ pathname: "/dang-nhap", state: { from: location } }}/>;
        }}/>
    );
};


export default ProtectedRoute;