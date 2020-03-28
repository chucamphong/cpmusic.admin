import { useAuth } from "modules/Auth";
import DashBoardContainer from "modules/Dashboard/containers/DashBoard";
import LoadingContainer from "modules/Loading/containers/Loading";
import LoginContainer from "modules/Login/containers/Login";
import React, { Fragment } from "react";

const AppContainer: React.FC = () => {
    const auth = useAuth();

    return (
        <Fragment>
            <LoadingContainer />
            {auth.isAuthenticated() && !auth.hasRole("member") ? <DashBoardContainer /> : <LoginContainer />}
        </Fragment>
    );
};

export default AppContainer;
