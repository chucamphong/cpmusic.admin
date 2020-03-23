import React from "react";
import { useAuth } from "modules/Auth";
import LoadingContainer from "modules/Loading/containers/Loading";
import LoginContainer from "modules/Login/containers/Login";
import DashBoardContainer from "modules/Dashboard/containers/DashBoard";
import { Route, Redirect, Switch } from "react-router-dom";
import { User } from "../../Auth/types";

const AppContainer: React.FC = () => {
    const auth = useAuth();

    const isMember = (user?: User) => {
        if (!user) return false;
        return user.role === "member";
    };

    const handleAuthenticate = () => {
        if (auth.isAuthenticated() && !isMember(auth.user)) {
            return <Redirect to={"/"} />;
        } else {
            return <Redirect to={"/dang-nhap"} />;
        }
    };

    const CheckRole: React.FC = ({ children }) => {
        if (auth.isAuthenticated() && ["admin", "mod"].includes(auth.user?.role ?? "")) {
            return <React.Fragment>{children}</React.Fragment>;
        } else {
            return <Redirect to={"/dang-nhap"} />;
        }
    };

    return (
        <>
            {handleAuthenticate()}

            <LoadingContainer />
            <Switch>
                <Route exact path={"/"}>
                    <DashBoardContainer />
                </Route>
                <Route path={"/dang-nhap"}>
                    <LoginContainer />
                </Route>
            </Switch>
        </>
    );
};

export default AppContainer;