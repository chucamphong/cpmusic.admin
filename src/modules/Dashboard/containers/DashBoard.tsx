import { HomeOutlined, PlayCircleOutlined, UserOutlined } from "@ant-design/icons";
import { useAbility } from "@casl/react";
import { Dropdown, Menu } from "antd";
import { useAuth } from "modules/Auth";
import AbilityContext from "modules/CASL/AbilityContext";
import Avatar from "modules/Common/components/Avatar";
import Layout from "modules/Common/components/Layout";
import Logo from "modules/Dashboard/components/Logo";
import Overlay from "modules/Dashboard/components/Overlay";
import StyledMenuOutlined from "modules/Dashboard/components/StyledMenuOutlined";
import notification from "modules/Notification/notification";
import React, { MouseEvent, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMedia } from "react-use";
import MyTheme from "theme";

const siderWidth = MyTheme.sider.width;

/**
 * Layout Dashboard
 * @param children
 * @constructor
 */
const DashBoardContainer: React.FC = ({ children }) => {
    const auth = useAuth();
    const location = useLocation();
    const ability = useAbility(AbilityContext);
    const [collapsed, setCollapsed] = useState(true);
    const isMobile = useMedia(`(max-width: ${MyTheme.layout.sm})`);
    const toggleSider = () => setCollapsed(!collapsed);
    const selectedKey = location.pathname.split("/");

    if (selectedKey.length > 2) {
        selectedKey.pop();
    }

    useEffect(() => {
        setCollapsed(isMobile);
    }, [isMobile]);

    const UserMenu = () => {
        const logout = (e: MouseEvent) => {
            e.preventDefault();
            notification.destroy();
            auth.logout();
        };

        return (
            <Menu>
                <Menu.Item key={"/tai-khoan"}>
                    <a href={"/tai-khoan"}>Thông tin</a>
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
                <Menu theme="dark" mode="inline" selectedKeys={[selectedKey.join("/")]}>
                    <Menu.Item key="/" title={null}>
                        <HomeOutlined />
                        <Link to="/">
                            <span>Trang chủ</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/thanh-vien" title={null} hidden={ability.cannot("view", "users")}>
                        <UserOutlined />
                        <Link to="/thanh-vien">
                            <span>Thành viên</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/bai-hat" title={null} hidden={ability.cannot("view", "songs")}>
                        <PlayCircleOutlined />
                        <Link to="/bai-hat">
                            <span>Bài hát</span>
                        </Link>
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
            {(isMobile && !collapsed) && <Overlay onClick={toggleSider} />}
            <Layout hasFixedHeader collapsed={collapsed}>
                <Layout.Header fixed>
                    <StyledMenuOutlined onClick={toggleSider} />
                    <Dropdown overlay={UserMenu} overlayStyle={{ width: 150 }} trigger={["click"]}>
                        <Avatar src={auth.user?.avatar} size="large" alt="Avatar" cursor>
                            <UserOutlined />
                        </Avatar>
                    </Dropdown>
                </Layout.Header>
                <Layout.Content margin={20} textAlign="justify">
                    {children}
                </Layout.Content>
            </Layout>
        </Layout>
    );
};

export default DashBoardContainer;
