import { useAuth } from "modules/Auth";
import { User } from "modules/Auth/types";
import DashBoardContainer from "modules/Dashboard/containers/DashBoard";
import LoadingContainer from "modules/Loading/containers/Loading";
import LoginContainer from "modules/Login/containers/Login";
import React from "react";

const AppContainer: React.FC = () => {
    const auth = useAuth();

    const isMember = (user?: User) => {
        if (!user) return false;
        return user.role === "member";
    };

    return (
        <>
            <LoadingContainer />
            {auth.isAuthenticated() && !isMember(auth.user) ? <DashBoardContainer /> : <LoginContainer />}
        </>
    );
};

export default AppContainer;
