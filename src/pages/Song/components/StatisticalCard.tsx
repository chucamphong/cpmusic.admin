import { Card } from "antd";
import { CardMetaProps } from "antd/es/card";
import React from "react";
import styled from "styled-components";

type Props = {
    title: string;
    value: number;
}

const StyledCardMeta: React.FC<CardMetaProps> = styled(Card.Meta)`
    .ant-card-meta-title {
        font-size: 24px;
    }
`;

const StatisticalCard: React.FC<Props> = ({ title, value }) => {
    return (
        <Card loading={value < 0}>
            <StyledCardMeta title={title} description={value} />
        </Card>
    );
};

export default StatisticalCard;
