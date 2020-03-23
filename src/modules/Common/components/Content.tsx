import React from "react";
import styled from "styled-components";
import { Layout } from "antd";
import { BasicProps } from "antd/es/layout/layout";

type Props = {
    justify?: boolean;
    margin?: number;
} & BasicProps;

const Content: React.FC<Props> = styled(({justify, ...rest}: Props) => <Layout.Content {...rest} />)`
    text-align: ${({ justify }) => justify ? "justify" : "auto"};
    margin: ${({ margin, theme }) => margin ? `${margin}px` : theme.content.margin};
`;

export default Content;