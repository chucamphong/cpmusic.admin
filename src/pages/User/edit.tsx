import { Breadcrumb, Button, Col, Form, Input, PageHeader, Row, Select, Space, Upload } from "antd";
import { AxiosError } from "axios";
import { isEmpty } from "lodash";
import { User } from "modules/Auth";
import AbilityContext from "modules/CASL/AbilityContext";
import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import usersService from "services/usersService";
import { difference } from "utils/helpers";
import notification from "utils/notification";

type ParamTypes = {
    id: string;
};

const EditUserPage: React.FC = () => {
    const history = useHistory();
    const ability = useContext(AbilityContext);
    const params = useParams<ParamTypes>();
    const [user, setUser] = useState<Partial<User>>({});
    const [loading, showLoading] = useState(false);

    // Cập nhật tiêu đề trang web
    useEffect(() => {
        document.title = "Chỉnh sửa thành viên";
    }, []);

    // Lấy thông tin tài khoản có id là params.id
    useEffect(() => {
        (async () => {
            try {
                const response = await usersService.getUser(+params.id);
                setUser(response.data);
            } catch (e) {
                notification.error({
                    message: (e as AxiosError).response?.data.message,
                });
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const goBack = () => history.push("/thanh-vien");

    const submitForm = async (formData: Partial<User>) => {
        // Lấy những trường thay đổi để gửi lên server, tránh gửi dư thừa những trường không thay đổi
        const data = difference(formData, user);

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
            const response = await usersService.update(+params.id, data);
            // Hiện thông báo thành công
            notification.success({
                message: response.data.message,
            });
            // Cập nhật thông tin thành công thì quay về trang thành viên
            goBack();
        } catch (e) {
            notification.error({
                message: (e as AxiosError).response?.data.message,
            });
        } finally {
            showLoading(false);
        }
    };

    return (
        <Space direction={"vertical"} style={{ width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to={"/"}>Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to={"/thanh-vien"}>Thành viên</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Chỉnh sửa thông tin</Breadcrumb.Item>
            </Breadcrumb>

            <PageHeader title="Chỉnh Sửa Thông Tin" subTitle={`Chỉnh sửa tài khoản ${user.name}.`}
                onBack={goBack} style={{ padding: 0 }}>
                <Form layout={"vertical"} onFinish={submitForm} fields={Object.keys(user).map(key => ({
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
                            <Form.Item name="name" label="Họ tên">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="email" label="Địa chỉ email">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="role" label="Chức vụ">
                                <Select disabled={ability.cannot("update", "users.permissions")}>
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="mod">Moderator</Select.Option>
                                    <Select.Option value="member">Member</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label={"Mật khẩu"}>
                                <Input.Password maxLength={255} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label={"Ảnh đại diện"}>
                                <Upload listType={"picture-card"} showUploadList={false}>
                                    <div>
                                        <div className="ant-upload-text">Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12} justify={"end"}>
                        <Col>
                            <Button onClick={goBack}>Hủy bỏ</Button>
                        </Col>
                        <Col>
                            <Button type={"primary"} htmlType="submit" loading={loading}>Cập nhật</Button>
                        </Col>
                    </Row>
                </Form>
            </PageHeader>
        </Space>
    );
};

export default EditUserPage;
