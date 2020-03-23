import { Layout } from "antd";
import { SiderProps } from "antd/lib/layout/Sider";
import React from "react";
import styled, { css } from "styled-components";

type Props = {
    fixed?: boolean;
} & SiderProps;

const Sider = styled(({ fixed, ...rest }: Props) => <Layout.Sider {...rest} />)`
    ${({ fixed }) => fixed && css`
        position: fixed;
        overflow: auto;
        height: 100vh;
        left: 0;
        z-index: 3;
    `};
`;

export default Sider;