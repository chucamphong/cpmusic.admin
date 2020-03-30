import { Col, Row } from "antd";
import FullHeightScreen from "modules/Common/components/FullHeightScreen";
import Layout from "modules/Common/components/Layout";
import React from "react";
import { Link } from "react-router-dom";

const Error: React.FC = () => {
    return (
        <FullHeightScreen>
            <Row align={"middle"} justify={"center"}>
                <Col span={20}>
                    <Layout.Content textAlign={"center"}>
                        <h1>Không tìm thấy trang này</h1>
                        <Link to={"/"}>Quay về trang chủ</Link>
                    </Layout.Content>
                </Col>
            </Row>
        </FullHeightScreen>
    );
};

export default Error;
