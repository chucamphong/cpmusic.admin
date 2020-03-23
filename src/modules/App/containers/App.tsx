import { useAuth } from "modules/Auth";
import { User } from "modules/Auth/types";
import DashBoardContainer from "modules/Dashboard/containers/DashBoard";
import LoadingContainer from "modules/Loading/containers/Loading";
import LoginContainer from "modules/Login/containers/Login";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const AppContainer: React.FC = () => {
    const auth = useAuth();

    const isMember = (user?: User) => {
        if (!user) return false;
        return user.role === "member";
    };

    const handleAuthenticate = () => {
        if (auth.isAuthenticated() && !isMember(auth.user)) {
            return <Redirect to={"/"}/>;
        } else {
            return <Redirect to={"/dang-nhap"}/>;
        }
    };

    return (
        <>
            {handleAuthenticate()}

            <LoadingContainer/>
            <Switch>
                <Route exact path={"/"}>
                    <DashBoardContainer/>
                </Route>
                <Route path={"/dang-nhap"}>
                    <LoginContainer/>
                </Route>
            </Switch>
        </>
    );
};

export default AppContainer;