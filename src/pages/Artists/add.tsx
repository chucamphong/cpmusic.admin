import { Button, Col, Form, Input, Row } from "antd";
import { Rule } from "antd/es/form";
import { AxiosError } from "axios";
import PageHeader, { BreadcrumbProps } from "modules/Common/components/PageHeader";
import UploadImage from "modules/Common/components/UploadImage";
import useQuitPage from "modules/Common/hooks/useQuitPage";
import notification from "modules/Notification/notification";
import { Artist } from "pages/Artists/types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { APIResponse, ArtistService } from "services";

const artistService = new ArtistService();

/**
 * Tạo bộ quy tắc để kiểm tra dữ liệu khi nhập form
 */
const rules: ArrayDictionary<Rule> = {
    name: [{
        required: true,
        message: "Tên nghệ sĩ không được để trống",
    }, {
        min: 3,
        message: "Tên nghệ sĩ tối thiểu 3 ký tự",
    }],
    avatar: [{
        required: true,
        message: "Ảnh đại diện không được để trống",
    }, {
        type: "url",
        message: "Ảnh đại diện phải là một url",
    }],
};

const breadcrumb: BreadcrumbProps = {
    useBrowserHistory: true,
    routes: [{
        path: "/",
        breadcrumbName: "Trang chủ",
    }, {
        path: "/nghe-si",
        breadcrumbName: "Quản lý nghệ sĩ",
    }, {
        path: "/nghe-si/tao-nghe-si",
        breadcrumbName: "Tạo nghệ sĩ",
    }],
};

const AddArtistPage: React.FC = () => {
    const history = useHistory();
    const [, quitPage] = useQuitPage("/nghe-si");
    const [form] = Form.useForm();
    const [loading, showLoading] = useState(false);

    useEffect(() => {
        document.title = "Tạo nghệ sĩ";
    }, []);

    const submitForm = async (formData: Partial<Artist>) => {
        // Gửi request tạo bài hát lên server
        try {
            showLoading(true);

            // Gửi request
            const response = await artistService.create(formData);

            // Hiện thông báo thành công
            notification.success({
                message: response.data.message,
            });

            // Quay về trang quản lý bài hát
            quitPage(true);
        } catch (e) {
            notification.error({
                message: (e as AxiosError<APIResponse>).response?.data.message,
            });
        } finally {
            showLoading(false);
        }
    };

    return (
        <PageHeader title="Tạo Nghệ Sĩ" breadcrumb={breadcrumb} onBack={() => history.push("/nghe-si")}>
            <Form form={form} layout="vertical" onFinish={submitForm}>
                <Row gutter={24}>
                    <Col xs={24} sm={12}>
                        <Form.Item name="name" label="Tên nghệ sĩ" rules={rules.name}>
                            <Input placeholder="Nhập tên nghệ sĩ" maxLength={255} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="avatar" label="Ảnh đại diện" rules={rules.avatar}>
                            <UploadImage upload={formData => artistService.uploadAvatar(formData)}
                                onSuccess={(imageUrl) => form.setFieldsValue({ avatar: imageUrl })} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12} justify="end">
                    <Col>
                        <Button onClick={() => history.goBack()}>Hủy bỏ</Button>
                    </Col>
                    <Col>
                        <Button type="primary" htmlType="submit" loading={loading}>Tạo nghệ sĩ</Button>
                    </Col>
                </Row>
            </Form>
        </PageHeader>
    );
};

export default AddArtistPage;
