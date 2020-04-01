import { Col, Row } from "antd";
import FullHeightScreen from "modules/Common/components/FullHeightScreen";
import Layout from "modules/Common/components/Layout";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const NoMatch: React.FC = () => {
    useEffect(() => {
        document.title = "Không tìm thấy trang bạn yêu cầu";
    }, []);

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

export default NoMatch;
