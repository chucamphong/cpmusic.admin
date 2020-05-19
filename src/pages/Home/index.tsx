import Query from "@chuphong/query-builder";
import { CardProps } from "antd/es/card";
import { AxiosError, AxiosResponse } from "axios";
import notification from "modules/Notification/notification";
import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import { APIPaginatedResponse, APIResponse } from "services";
import { Service } from "services/service";
import styled from "styled-components";

const service = new Service("random");

const StyledCardMeta = styled(Card.Meta)`
    .ant-card-meta-title {
        font-size: 24px;
    }
`;

const StatisticalCard: React.FC<CardProps & { value: number }> = ({ value, ...props }) => {
    return (
        <Card loading={value < 0} {...props}>
            <StyledCardMeta description={value} />
        </Card>
    );
};

const HomePage: React.FC = () => {
    const [usersCount, setUsersCount] = useState<number>(-1);
    const [artistsCount, setArtistsCount] = useState<number>(-1);
    const [categoriesCount, setCategoriesCount] = useState<number>(-1);
    const [songsCount, setSongsCount] = useState<number>(-1);

    useEffect(() => {
        document.title = "Trang chủ";
    }, []);

    useEffect(() => {
        const getUsers = service.get(new Query().for("users").limit(1));
        const getArtists = service.get(new Query().for("artists").limit(1));
        const getCategories = service.get(new Query().for("categories").limit(1));
        const getSongs = service.get(new Query().for("songs").limit(1));

        Promise.all<AxiosResponse<APIPaginatedResponse<any>>, AxiosResponse<APIPaginatedResponse<any>>, AxiosResponse<APIPaginatedResponse<any>>, AxiosResponse<APIPaginatedResponse<any>>>([getUsers, getArtists, getCategories, getSongs])
            .then(([users, artists, categories, songs]) => {
                setUsersCount(users.data.meta.total);
                setArtistsCount(artists.data.meta.total);
                setCategoriesCount(categories.data.meta.total);
                setSongsCount(songs.data.meta.total);
            }).catch((error: AxiosError<APIResponse>) => notification.error({
                message: error.response?.data.message,
            }));
    }, []);

    return (
        <Row gutter={24}>
            <Col xs={24} md={12} lg={6}>
                <StatisticalCard title="Số thành viên" value={usersCount} />
            </Col>
            <Col xs={24} md={12} lg={6}>
                <StatisticalCard title="Số bài hát" value={songsCount} />
            </Col>
            <Col xs={24} md={12} lg={6}>
                <StatisticalCard title="Số nghệ sĩ" value={artistsCount} />
            </Col>
            <Col xs={24} md={12} lg={6}>
                <StatisticalCard title="Số thể loại" value={categoriesCount} />
            </Col>
        </Row>
    );
};

export default HomePage;
