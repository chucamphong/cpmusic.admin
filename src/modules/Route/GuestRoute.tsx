import { useAuth } from "modules/Auth";
import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

const GuestRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
    const auth = useAuth();

    return (
        <Route {...rest} render={({ location }) => {
            return !auth.isAuthenticated() ? children :
                <Redirect to={{ pathname: "/", state: { from: location } }} />;
        }} />
    );
};


export default GuestRoute;
