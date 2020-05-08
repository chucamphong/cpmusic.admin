import { useAbility } from "@casl/react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { Rule } from "antd/es/form";
import { AxiosError } from "axios";
import { difference } from "helpers";
import { has, isEmpty } from "lodash";
import { useAuth, User } from "modules/Auth";
import AbilityContext from "modules/CASL/AbilityContext";
import PageHeader, { BreadcrumbProps } from "modules/Common/components/PageHeader";
import UploadImage from "modules/Common/components/UploadImage";
import notification from "modules/Notification/notification";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { UserService } from "services";

type ParamTypes = {
    id: string;
};

/**
 * Tạo bộ quy tắc để kiểm tra dữ liệu khi nhập form
 */
const rules: ArrayDictionary<Rule> = {
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
        min: 8,
        message: "Mật khẩu tối thiểu 8 ký tự",
    }],
    avatar: [{
        type: "url",
        message: "Hình ảnh không hợp lệ",
    }],
};

const userService = new UserService();

const EditUserPage: React.FC = () => {
    const auth = useAuth();
    const history = useHistory();
    const [form] = Form.useForm();
    const ability = useAbility(AbilityContext);
    const params = useParams<ParamTypes>();
    const [user, setUser] = useState<Partial<User>>({});
    const [loading, showLoading] = useState(false);
    const [quit, quitPage] = useState(false);
    const breadcrumb: BreadcrumbProps = {
        useBrowserHistory: true,
        routes: [{
            path: "/",
            breadcrumbName: "Trang chủ",
        }, {
            path: "/thanh-vien",
            breadcrumbName: "Quản lý tài khoản",
        }, {
            path: `/thanh-vien/${params.id}`,
            breadcrumbName: "Chỉnh sửa tài khoản",
        }],
    };

    useEffect(() => {
        // Cập nhật tiêu đề trang web
        document.title = "Chỉnh sửa tài khoản";

        // Lấy thông tin tài khoản có id là params.id
        (async () => {
            try {
                const response = await userService.find(+params.id);
                setUser(response.data);
            } catch (e) {
                notification.error({
                    message: (e as AxiosError).response?.data.message,
                });
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (quit) {
            goBack();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quit]);

    const goBack = () => history.goBack();

    const submitForm = async (formData: Partial<User>) => {
        // Lấy những trường thay đổi để gửi lên server, tránh gửi dư thừa những trường không thay đổi
        const data = difference<Partial<User>>(formData, user);

        // Trường hợp không có gì thay đổi thì không làm gì hết
        if (isEmpty(data)) {
            return notification.info({
                message: "Có vẻ như bạn chưa thay đổi gì cả",
            });
        }

        // Gửi request cập nhật thông tin lên server
        try {
            showLoading(true);
            // Gửi request
            const response = await userService.update(+params.id, data);

            // Nếu thay đổi mật khẩu hoặc chức vụ của bản thân thì sẽ bị logout ra để cập nhật lại dữ liệu
            if (auth.isMe(user?.id) && (has(data, "password") || has(data, "role"))) {
                return auth.logout();
            }

            // Hiện thông báo thành công
            notification.success({
                message: response.data.message,
            });

            /**
             * Quay về trang quản lý thành viên
             * Sửa lỗi: Nếu xài thẳng hàm history.push thì sẽ bị memory leak khi chuyển trang nên phải tạo một flag để
             * chuyển trang mà không bị memory leak
             */
            quitPage(true);
        } catch (e) {
            notification.error({
                message: (e as AxiosError).response?.data.message,
            });
        } finally {
            showLoading(false);
        }
    };

    return (
        <PageHeader title="Chỉnh Sửa Thông Tin" breadcrumb={breadcrumb} onBack={goBack}>
            <Form form={form} layout="vertical" onFinish={submitForm} fields={Object.keys(user).map(key => ({
                name: [key],
                value: user[key],
            }))}>
                <Row gutter={24}>
                    <Col xs={24} sm={12}>
                        <Form.Item name="id" label="ID">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="email" label="Địa chỉ email">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="name" label="Họ tên" rules={rules.name}>
                            <Input maxLength={255} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="role" label="Chức vụ" rules={rules.role}>
                            <Select disabled={ability.cannot("update", "users.permissions")}>
                                <Select.Option value="admin">Admin</Select.Option>
                                <Select.Option value="mod">Moderator</Select.Option>
                                <Select.Option value="member">Member</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="password" label="Mật khẩu" rules={rules.password}>
                            <Input.Password maxLength={255} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name={"avatar"} label="Ảnh đại diện">
                            <UploadImage upload={formData => userService.uploadAvatar(formData)}
                                defaultImage={user.avatar}
                                onSuccess={(imageUrl) => form.setFieldsValue({ avatar: imageUrl })} />
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

export default EditUserPage;
