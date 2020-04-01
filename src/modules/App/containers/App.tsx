import Loading from "modules/Loading/containers/Loading";
import { GuestRoute, ProtectedRoute } from "modules/Route";
import NoMatch from "pages/Error/NoMatch";
import HomePage from "pages/Home";
import LoginPage from "pages/Login";
import UserPage from "pages/User";
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
                <ProtectedRoute path={"/thanh-vien"}>
                    <UserPage />
                </ProtectedRoute>
                {/* Đăng nhập */}
                <GuestRoute path={"/dang-nhap"}>
                    <LoginPage />
                </GuestRoute>
                {/* Trang báo lỗi nếu url không tồn tại*/}
                <Route path={"*"} component={NoMatch} />
            </Switch>
        </Fragment>
    );
};

export default AppContainer;
