import { useAbility } from "@casl/react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { Rule } from "antd/es/form";
import { AxiosError } from "axios";
import { User } from "modules/Auth";
import AbilityContext from "modules/CASL/AbilityContext";
import PageHeader, { BreadcrumbProps } from "modules/Common/components/PageHeader";
import notification from "modules/Notification/notification";
import UploadImage from "pages/User/components/UploadImage";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { UserService, APIResponse } from "services";

/**
 * Tạo bộ quy tắc để kiểm tra dữ liệu khi nhập form
 */
const rules: ArrayDictionary<Rule> = {
    email: [{
        required: true,
        message: "Địa chỉ email không được để trống",
    }, {
        type: "email",
        message: "Địa chỉ email không hợp lệ",
    }],
    name: [{
        required: true,
        message: "Họ tên không được để trống",
    }, {
        min: 8,
        message: "Tối thiểu 8 ký tự",
    }],
    role: [{
        required: true,
        message: "Chức vụ không được bỏ trống",
    }],
    password: [{
        required: true,
        message: "Mật khẩu không được để trống",
    }, {
        min: 8,
        message: "Mật khẩu tối thiểu 8 ký tự",
    }],
    avatar: [{
        type: "url",
        message: "Hình ảnh không hợp lệ",
    }],
};

const breadcrumb: BreadcrumbProps = {
    useBrowserHistory: true,
    routes: [{
        path: "/",
        breadcrumbName: "Trang chủ",
    }, {
        path: "/thanh-vien",
        breadcrumbName: "Quản lý tài khoản",
    }, {
        path: "/thanh-vien/tao-tai-khoan",
        breadcrumbName: "Tạo tài khoản",
    }],
};

const initialValues = {
    role: "member",
};

const AddUserPage: React.FC = () => {
    const history = useHistory();
    const [form] = Form.useForm();
    const ability = useAbility(AbilityContext);
    const [loading, showLoading] = useState(false);
    const [quit, quitPage] = useState(false);

    const goBack = useCallback(() => history.push("/thanh-vien"), [history]);

    // Cập nhật tiêu đề trang web
    useEffect(() => {
        document.title = "Thêm tài khoản";
    }, []);

    // Quay trở lại trang /thanh-vien nếu quit = true
    useEffect(() => {
        if (quit) {
            goBack();
        }
    }, [goBack, quit]);

    // Gửi request tạo tài khoản lên server
    const submitForm = async (formData: Partial<User>) => {
        showLoading(true);

        new UserService().create(formData)
            .then(response => {
                notification.success({
                    message: response.data.message,
                });

                quitPage(true);
            })
            .catch((error: AxiosError<APIResponse>) => {
                let errors = error.response?.data.errors;

                notification.error({
                    message: (errors?.[Object.keys(errors)[0]][0]) ?? error.response?.data.message,
                });
            })
            .finally(() => showLoading(false));
    };

    return (
        <PageHeader title="Thêm tài khoản" breadcrumb={breadcrumb} onBack={goBack}>
            <Form form={form} layout="vertical" onFinish={submitForm} initialValues={initialValues}>
                <Row gutter={24}>
                    <Col xs={24} sm={12}>
                        <Form.Item name="email" label="Địa chỉ email" rules={rules.email}>
                            <Input placeholder="Nhập địa chỉ email của bạn" maxLength={255} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="name" label="Họ tên" rules={rules.name}>
                            <Input placeholder="Nhập họ tên của bạn" maxLength={255} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="role" label="Chức vụ" rules={rules.role}>
                            <Select disabled={ability.cannot("create", "users.role")}>
                                <Select.Option value="admin">Admin</Select.Option>
                                <Select.Option value="mod">Moderator</Select.Option>
                                <Select.Option value="member">Member</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="password" label="Mật khẩu" rules={rules.password}>
                            <Input.Password placeholder="Nhập mật khẩu của bạn" maxLength={255} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name={"avatar"} label="Ảnh đại diện" rules={rules.avatar}>
                            <UploadImage onSuccess={(imageUrl) => form.setFieldsValue({ avatar: imageUrl })} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12} justify="end">
                    <Col>
                        <Button onClick={goBack}>Hủy bỏ</Button>
                    </Col>
                    <Col>
                        <Button type="primary" htmlType="submit" loading={loading}>Cập nhật</Button>
                    </Col>
                </Row>
            </Form>
        </PageHeader>
    );
};

export default AddUserPage;
