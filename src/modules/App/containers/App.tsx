import { useAuth } from "modules/Auth";
import Ability from "modules/CASL/Ability";
import AbilityContext from "modules/CASL/AbilityContext";
import Loading from "modules/Loading/containers/Loading";
import { GuestRoute, ProtectedRoute } from "modules/Route";
import AccountPage from "pages/Account";
import ArtistPage from "pages/Artists";
import AddArtistPage from "pages/Artists/add";
import EditArtistPage from "pages/Artists/edit";
import CategoryPage from "pages/Category";
import AddCategoryPage from "pages/Category/add";
import EditCategoryPage from "pages/Category/edit";
import AccessDenied from "pages/Error/AccessDenied";
import NoMatch from "pages/Error/NoMatch";
import HomePage from "pages/Home";
import LoginPage from "pages/Login";
import SongPage from "pages/Song";
import AddSongPage from "pages/Song/add";
import EditSongPage from "pages/Song/edit";
import UserPage from "pages/User";
import AddUserPage from "pages/User/add";
import EditUserPage from "pages/User/edit";
import React from "react";
import { Route, Switch } from "react-router-dom";

const AppContainer: React.FC = () => {
    const auth = useAuth();

    Ability.update(auth.user?.permissions ?? []);

    return (
        <AbilityContext.Provider value={Ability}>
            <Loading />
            <Switch>
                {/* Trang chủ */}
                <ProtectedRoute path={"/"} exact>
                    <HomePage />
                </ProtectedRoute>
                {/* Quản lý thành viên */}
                <ProtectedRoute path={"/thanh-vien"} action={"view"} subject={"users"} exact>
                    <UserPage />
                </ProtectedRoute>
                <ProtectedRoute path={"/thanh-vien/tao-tai-khoan"} action={"create"} subject={"users"} exact>
                    <AddUserPage />
                </ProtectedRoute>
                <ProtectedRoute path={"/thanh-vien/:id"} action={"update"} subject={"users"} exact>
                    <EditUserPage />
                </ProtectedRoute>
                {/* Quản lý nghệ sĩ */}
                <ProtectedRoute path={"/nghe-si"} action={"view"} subject={"artists"} exact>
                    <ArtistPage />
                </ProtectedRoute>
                <ProtectedRoute path={"/nghe-si/tao-nghe-si"} action={"create"} subject={"artists"} exact>
                    <AddArtistPage />
                </ProtectedRoute>
                <ProtectedRoute path={"/nghe-si/:id"} action={"update"} subject={"artists"} exact>
                    <EditArtistPage />
                </ProtectedRoute>
                {/* Quản lý thể loại */}
                <ProtectedRoute path={"/the-loai"} action="view" subject="categories" exact>
                    <CategoryPage />
                </ProtectedRoute>
                <ProtectedRoute path={"/the-loai/tao-the-loai"} action="create" subject="categories" exact>
                    <AddCategoryPage />
                </ProtectedRoute>
                <ProtectedRoute path={"/the-loai/:id"} action="update" subject="categories" exact>
                    <EditCategoryPage />
                </ProtectedRoute>
                {/* Quản lý bài hát */}
                <ProtectedRoute path={"/bai-hat"} action={"view"} subject={"songs"} exact>
                    <SongPage />
                </ProtectedRoute>
                <ProtectedRoute path={"/bai-hat/tao-bai-hat"} action={"create"} subject={"songs"} exact>
                    <AddSongPage />
                </ProtectedRoute>
                <ProtectedRoute path={"/bai-hat/:id"} action={"update"} subject={"songs"} exact>
                    <EditSongPage />
                </ProtectedRoute>
                {/* Xem thông tin tài khoản */}
                <ProtectedRoute path={"/tai-khoan"} action={"view"} subject={"me"} exact>
                    <AccountPage />
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
    );
};

export default AppContainer;
