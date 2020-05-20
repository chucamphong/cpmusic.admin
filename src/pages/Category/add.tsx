import { Button, Col, Form, Input, Row } from "antd";
import { Rule } from "antd/es/form";
import { AxiosError } from "axios";
import PageHeader, { BreadcrumbProps } from "modules/Common/components/PageHeader";
import useQuitPage from "modules/Common/hooks/useQuitPage";
import notification from "modules/Notification/notification";
import { Category } from "pages/Category/types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { APIResponse } from "services";
import CategoryService from "services/categoryService";

const breadcrumb: BreadcrumbProps = {
    useBrowserHistory: true,
    routes: [{
        path: "/",
        breadcrumbName: "Trang chủ",
    }, {
        path: "/the-loai",
        breadcrumbName: "Quản lý thể loại",
    }, {
        path: "/the-loai/tao-the-loai",
        breadcrumbName: "Tạo thể loại",
    }],
};

/**
 * Tạo bộ quy tắc để kiểm tra dữ liệu khi nhập form
 */
const rules: ArrayDictionary<Rule> = {
    name: [{
        required: true,
        message: "Thể loại không được để trống",
    }, {
        min: 3,
        message: "Thể loại tối thiểu 3 ký tự",
    }],
};

const categoryService = new CategoryService();

const AddCategoryPage: React.FC = () => {
    const history = useHistory();
    const [, quitPage] = useQuitPage("/the-loai");
    const [form] = Form.useForm();
    const [loading, showLoading] = useState(false);

    useEffect(() => {
        document.title = "Tạo thể loại";
    }, []);

    const submitForm = async (formData: Partial<Category>) => {
        // Gửi request tạo bài hát lên server
        try {
            showLoading(true);

            // Gửi request
            const response = await categoryService.create(formData);

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
        <PageHeader title="Tạo Nghệ Sĩ" breadcrumb={breadcrumb} onBack={() => history.push("/the-loai")}>
            <Form form={form} layout="vertical" onFinish={submitForm}>
                <Row gutter={24}>
                    <Col xs={24}>
                        <Form.Item name="name" label="Thể loại" rules={rules.name}>
                            <Input placeholder="Nhập Thể loại" maxLength={50} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12} justify="end">
                    <Col>
                        <Button onClick={() => history.goBack()}>Hủy bỏ</Button>
                    </Col>
                    <Col>
                        <Button type="primary" htmlType="submit" loading={loading}>Tạo thể loại</Button>
                    </Col>
                </Row>
            </Form>
        </PageHeader>
    );
};

export default AddCategoryPage;
