import { Button, Col, Form, Input, Row, Typography } from "antd";
import { Store } from "antd/es/form/interface";
import { isDevelopment } from "helpers";
import { useAuth } from "modules/Auth";
import FullHeightScreen from "modules/Common/components/FullHeightScreen";
import notification from "modules/Notification/notification";
import { FieldData, Rules } from "pages/Login/types";
import React, { useEffect, useState } from "react";
import useSelector from "store/hooks/useSelector";

/**
 * Tạo bộ dữ liệu mẫu phục vụ cho môi trường lập trình
 */
const initialValues = isDevelopment() ? {
    "email": "admin@gmail.com",
    "password": "password",
} : {};

/**
 * Tạo bộ quy tắc để kiểm tra dữ liệu khi nhập form
 */
const rules: Rules = {
    // Kiểm tra tính hợp lệ của username
    email: [{
        required: true,
        message: "Địa chỉ email không được để trống",
    }, {
        type: "email",
        message: "Địa chỉ email không hợp lệ",
    }],
    // Kiểm tra tính hợp lệ của password
    password: [{
        required: true,
        message: "Mật khẩu không được để trống",
    }, {
        min: 8,
        message: "Mật khẩu tối thiểu có 8 ký tự",
    }],
};

/**
 * Trang đăng nhập
 * @constructor
 */
const LoginPage: React.FC = () => {
    const auth = useAuth();
    const [loading, showLoading] = useState(false);
    const status = useSelector(state => state.auth.status);
    const message = useSelector(state => state.auth.message);
    const errors = useSelector(state => state.auth.errors);

    useEffect(() => {
        document.title = "Đăng nhập";
    }, []);

    useEffect(() => {
        showLoading(status === "pending");

        if (status === "success" || status === "error") {
            notification.destroy();

            notification.open({
                type: status,
                message: message ?? "Đăng nhập thành công",
            });
        }
    }, [status, message]);

    const submitForm = (values: Store) => {
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
                    <Form onFinish={submitForm} initialValues={initialValues}>
                        <Form.Item validateStatus={errors?.email ? "error" : "validating"}
                            help={errors?.email?.toString()}
                            name="email" rules={rules.email}>
                            <Input placeholder="Nhập địa chỉ email của bạn" maxLength={255} />
                        </Form.Item>
                        <Form.Item validateStatus={errors?.password ? "error" : "validating"}
                            help={errors?.password?.toString()} name="password" rules={rules.password}>
                            <Input.Password placeholder="Nhập mật khẩu của bạn" maxLength={255} />
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

export default LoginPage;
