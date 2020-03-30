import { HomeOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { useAuth } from "modules/Auth";
import Avatar from "modules/Common/components/Avatar";
import Layout from "modules/Common/components/Layout";
import Logo from "modules/Dashboard/components/Logo";
import Overlay from "modules/Dashboard/components/Overlay";
import StyledMenuOutlined from "modules/Dashboard/components/StyledMenuOutlined";
import React, { MouseEvent, useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useMedia } from "react-use";
import MyTheme from "utils/theme";

const siderWidth = MyTheme.sider.width;

const DashBoardContainer: React.FC = ({ children }) => {
    const auth = useAuth();
    const location = useLocation();
    const history = useHistory();
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const isMobile = useMedia("(max-width: 576px");
    const toggleSider = () => setCollapsed(!collapsed);

    useEffect(() => {
        setCollapsed(isMobile);
    }, [isMobile]);

    const UserMenu = () => {
        const logout = (e: MouseEvent) => {
            e.preventDefault();
            auth.logout();
            history.push("/");
        };

        return (
            <Menu>
                <Menu.Item key={"/thong-tin"}>
                    <a href={"/thong-tin"}>Thông tin</a>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key={"/dang-xuat"}>
                    <a href={"/dang-xuat"} onClick={logout}>Đăng xuất</a>
                </Menu.Item>
            </Menu>
        );
    };

    return (
        <Layout hasFixedSider collapsed={collapsed}>
            <Layout.Sider width={siderWidth} trigger={null} collapsed={collapsed} collapsedWidth={0} fixed collapsible>
                <Logo>
                    <Link to="/">CPMusic</Link>
                </Logo>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]} selectedKeys={[location.pathname]}>
                    <Menu.Item key="/">
                        <HomeOutlined />
                        <Link to="/">
                            <span>Trang chủ</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/users">
                        <UserOutlined />
                        <Link to="/users">
                            <span>Thành viên</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <VideoCameraOutlined />
                        <span>nav 2</span>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <UploadOutlined />
                        <span>nav 3</span>
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
            {(isMobile && !collapsed) && <Overlay onClick={toggleSider} />}
            <Layout hasFixedHeader collapsed={collapsed}>
                <Layout.Header fixed>
                    <StyledMenuOutlined onClick={toggleSider} />
                    <Dropdown overlay={UserMenu} overlayStyle={{ width: 150 }} trigger={["click"]}>
                        <Avatar cursor size={"large"} alt="Avatar">
                            <UserOutlined />
                        </Avatar>
                    </Dropdown>
                </Layout.Header>
                <Layout.Content margin={20} textAlign={"justify"}>
                    {children}
                </Layout.Content>
            </Layout>
        </Layout>
    );
};

export default DashBoardContainer;
