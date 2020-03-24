import { Button, Col, Form, Input, notification, Row, Typography } from "antd";
import { useAuth } from "modules/Auth";
import FullHeightScreen from "modules/Common/components/FullHeightScreen";
import { FieldData, Rules } from "modules/Login/types";
import React, { useEffect, useState } from "react";
import useSelector from "store/hooks/useSelector";
import { isDevelopment } from "utils/helpers";

const initialValues = isDevelopment() ? {
    "email": "chucamphong@gmail.com",
    "password": "password"
} : {};

const rules: Rules = {
    // Kiểm tra tính hợp lệ của username
    email: [{
        required: true,
        message: "Địa chỉ email không được để trống."
    }, {
        type: "email",
        message: "Địa chỉ email không hợp lệ."
    }, {
        max: 255,
        message: "Địa chỉ email tối đa 255 ký tự."
    }],
    // Kiểm tra tính hợp lệ của password
    password: [{
        required: true,
        message: "Mật khẩu không được để trống."
    }, {
        min: 8,
        message: "Mật khẩu tối thiếu có 8 ký tự."
    }, {
        max: 255,
        message: "Mật khẩu tối đa 255 ký tự."
    }]
};

const LoginContainer: React.FC = () => {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const status = useSelector(state => state.auth.status);
    const message = useSelector(state => state.auth.message);
    const errors = useSelector(state => state.auth.errors);

    document.title = "Đăng nhập";

    useEffect(() => {
        setLoading(status === "pending");

        if (status === "success" || status === "error") {
            notification.destroy();

            notification.open({
                type: status,
                message: message ?? "Đăng nhập thành công"
            });
        }
    }, [status, message]);

    const onFinish = (values) => {
        const { email, password } = values as FieldData;
        auth.login(email, password);
    };

    return (
        <FullHeightScreen>
            <Row justify="center" align="middle">
                <Col xs={20} sm={14} md={12} lg={10} xl={8}>
                    <Row justify="center">
                        <Typography.Title level={2}>Đăng Nhập</Typography.Title>
                    </Row>
                    <Form onFinish={onFinish} initialValues={initialValues}>
                        <Form.Item validateStatus={errors?.email ? "error" : "validating"}
                            help={errors?.email?.toString()}
                            name="email" rules={rules.email}>
                            <Input />
                        </Form.Item>
                        <Form.Item validateStatus={errors?.password ? "error" : "validating"}
                            help={errors?.password?.toString()} name="password" rules={rules.password}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={loading} loading={loading} block>
                            Đăng Nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </FullHeightScreen>
    );
};

export default LoginContainer;