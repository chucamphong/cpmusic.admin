import { Tag, Typography, Space } from "antd";
import { useAuth } from "modules/Auth";
import React from "react";

const AccountPage: React.FC = () => {
    const auth = useAuth();

    return (
        <React.Fragment>
            <Typography.Title level={3}>Xin chào {auth.user?.name}</Typography.Title>
            <Typography.Text>
                <Space size="small">
                    Chức vụ: <Tag>{auth.user?.role?.toUpperCase()}</Tag>
                </Space>
            </Typography.Text>
        </React.Fragment>
    );
};

export default AccountPage;
