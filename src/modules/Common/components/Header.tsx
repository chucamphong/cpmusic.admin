import { Layout } from "antd";
import { BasicProps } from "antd/es/layout/layout";
import React from "react";
import styled, { css } from "styled-components";

type Props = {
    fixed?: boolean;
} & BasicProps;

const Header = styled(({ fixed, ...rest }: Props) => <Layout.Header {...rest} />)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    width: 100%;
    
    ${({ fixed }) => fixed && css`
        position: fixed;
        z-index: 1;
        right: 0;
        transition: width 0.2s;
        will-change: width;
    `};
`;

export default Header;