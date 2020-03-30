import { Location } from "history";
import { useAuth } from "modules/Auth";
import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

type LocationState = Location<{
    from: Location;
}>;

const GuestRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
    const auth = useAuth();

    return (
        <Route {...rest} render={({ location }) => {
            const from = (location as LocationState).state?.from.pathname ?? "/";

            return !auth.isAuthenticated() ? children :
                <Redirect to={{ pathname: from, state: { from: location } }} />;
        }} />
    );
};


export default GuestRoute;
