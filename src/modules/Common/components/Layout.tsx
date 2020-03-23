import { Layout as AntdLayout } from "antd";
import { BasicProps } from "antd/es/layout/layout";
import Content from "modules/Common/components/Content";
import Header from "modules/Common/components/Header";
import Sider from "modules/Common/components/Sider";
import React from "react";
import styled, { css } from "styled-components";

type Props = {
    hasFixedHeader?: boolean;
    hasFixedSider?: boolean;
    collapsed?: boolean;
} & BasicProps;

type LayoutComponents = {
    Header: typeof Header;
    Sider: typeof Sider;
    Content: typeof Content;
};

type LayoutType = React.FC<Props> & LayoutComponents;

const CustomLayout = styled(({ hasFixedHeader, hasFixedSider, collapsed, ...rest }: Props) => <AntdLayout {...rest} />)`
    // Làm cho phần header trở thành fixed
    ${({ hasFixedHeader, collapsed, theme }) => hasFixedHeader && css`
        > header {
            width: ${collapsed ? "100%" : `calc(100% - ${theme.sider.width})`};
        
            @media (max-width: ${theme.layout.sm}) {
                width: 100%;
            }
        }
        
        > main {
            margin: 80px 20px 20px;
        }
    `};
    
    // Đẩy phần layout header và main vào ?px để hiển thị sider
    ${({ hasFixedSider, collapsed, theme }) => hasFixedSider && css`
        // Select vào layout thứ 2
        > section {
            margin-left: ${collapsed ? "initial" : theme.sider.width};
            transition: margin-left 0.2s;

            @media (max-width: ${theme.layout.sm}) {
                margin-left: initial;
            }
        }
    `};
`;

const Layout: LayoutType = (rest) => <CustomLayout {...rest} />;

Layout.Header = Header;
Layout.Sider = Sider;
Layout.Content = Content;

export default Layout;