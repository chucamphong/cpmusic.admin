import { useAuth } from "modules/Auth";
import Ability from "modules/CASL/Ability";
import AbilityContext from "modules/CASL/AbilityContext";
import Loading from "modules/Loading/containers/Loading";
import { GuestRoute, ProtectedRoute } from "modules/Route";
import AccessDenied from "pages/Error/AccessDenied";
import NoMatch from "pages/Error/NoMatch";
import HomePage from "pages/Home";
import LoginPage from "pages/Login";
import UserPage from "pages/User";
import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";

const AppContainer: React.FC = () => {
    const auth = useAuth();

    Ability.update(auth.user?.permissions ?? []);

    return (
        <Fragment>
            <AbilityContext.Provider value={Ability}>
                <Loading />
                <Switch>
                    {/* Trang chủ */}
                    <ProtectedRoute path={"/"} exact>
                        <HomePage />
                    </ProtectedRoute>
                    {/* Quản lý thành viên */}
                    <ProtectedRoute path={"/thanh-vien"} exact>
                        <UserPage />
                    </ProtectedRoute>
                    {/* Đăng nhập */}
                    <GuestRoute path={"/dang-nhap"}>
                        <LoginPage />
                    </GuestRoute>
                    {/* Trang báo lỗi nếu người dùng truy cập trái phép một trang nào đó */}
                    <Route path={"/khong-co-quyen-truy-cap"} component={AccessDenied} />
                    {/* Trang báo lỗi nếu url không tồn tại*/}
                    <Route path={"*"} component={NoMatch} />
                </Switch>
            </AbilityContext.Provider>
        </Fragment>
    );
};

export default AppContainer;
