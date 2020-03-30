import ErrorPage from "modules/App/components/Error";
import HomePage from "modules/Home/containers/Home";
import Loading from "modules/Loading/containers/Loading";
import LoginPage from "modules/Login/containers/Login";
import { GuestRoute, ProtectedRoute } from "modules/Route";
import UserPage from "modules/User/containers/User";
import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";

const AppContainer: React.FC = () => {
    return (
        <Fragment>
            <Loading />
            <Switch>
                {/* Trang chủ */}
                <ProtectedRoute path={"/"} exact>
                    <HomePage />
                </ProtectedRoute>
                {/* Quản lý thành viên */}
                <ProtectedRoute path={"/users"}>
                    <UserPage />
                </ProtectedRoute>
                {/* Đăng nhập */}
                <GuestRoute path={"/dang-nhap"}>
                    <LoginPage />
                </GuestRoute>
                {/* Trang báo lỗi nếu url không tồn tại*/}
                <Route path={"*"} component={ErrorPage} />
            </Switch>
        </Fragment>
    );
};

export default AppContainer;
