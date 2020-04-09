import { Col, Row } from "antd";
import FullHeightScreen from "modules/Common/components/FullHeightScreen";
import Layout from "modules/Common/components/Layout";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

type Props = {
    title: string;
    message: string;
};

const Error: React.FC<Props> = ({ title, message }) => {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <FullHeightScreen>
            <Row align={"middle"} justify={"center"}>
                <Col span={20}>
                    <Layout.Content textAlign={"center"}>
                        <h1>{message}</h1>
                        <Link to={"/"}>Quay về trang chủ</Link>
                    </Layout.Content>
                </Col>
            </Row>
        </FullHeightScreen>
    );
};

export default Error;
