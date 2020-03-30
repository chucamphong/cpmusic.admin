import { Layout } from "antd";
import { BasicProps } from "antd/es/layout/layout";
import React from "react";
import styled, { css } from "styled-components";

type Props = {
    textAlign?: "justify" | "center";
    margin?: number;
} & BasicProps;

const Content: React.FC<Props> = styled(({ textAlign, ...rest }: Props) => <Layout.Content {...rest} />)`
    ${({ textAlign }) => textAlign && css`
        text-align: ${textAlign};
    `};
    margin: ${({ margin, theme }) => margin ? `${margin}px` : theme.content.margin};
`;

export default Content;
