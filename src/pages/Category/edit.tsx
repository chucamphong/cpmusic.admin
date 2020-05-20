import { Button, Col, Form, Input, Row } from "antd";
import { Rule } from "antd/es/form";
import { AxiosError } from "axios";
import { difference } from "helpers";
import { isEmpty } from "lodash";
import PageHeader, { BreadcrumbProps } from "modules/Common/components/PageHeader";
import useQuitPage from "modules/Common/hooks/useQuitPage";
import notification from "modules/Notification/notification";
import { Category } from "pages/Category/types";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { APIResponse } from "services";
import CategoryService from "services/categoryService";

type ParamTypes = {
    id: string;
};

const categoryService = new CategoryService();

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

const EditCategoryPage: React.FC = () => {
    const history = useHistory();
    const params = useParams<ParamTypes>();
    const [category, setCategory] = useState<Partial<Category>>({});
    const [, quitPage] = useQuitPage("/the-loai");
    const [form] = Form.useForm();
    const [loading, showLoading] = useState(false);

    const breadcrumb: BreadcrumbProps = {
        useBrowserHistory: true,
        routes: [{
            path: "/",
            breadcrumbName: "Trang chủ",
        }, {
            path: "/the-loai",
            breadcrumbName: "Quản lý thể loại",
        }, {
            path: `/the-loai/${params.id}`,
            breadcrumbName: "Chỉnh sửa thể loại",
        }],
    };

    useEffect(() => {
        document.title = `Chỉnh sửa thể loại ${category.name ?? ""}`;
    }, [category.name]);

    // Lấy thông tin nghệ sĩ theo params.id
    useEffect(() => {
        categoryService.find(~~params.id)
            .then(response => setCategory(response.data))
            .catch((error: AxiosError<APIResponse>) => notification.error({
                message: error.response?.data.message,
            }));
    }, [params.id]);

    const submitForm = async (formData: Partial<Category>) => {
        const data = difference(formData, category);

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
            const response = await categoryService.update(+params.id, data);

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
        <PageHeader title={`Chỉnh Sửa Thể Loại ${category.name ?? ""}`} breadcrumb={breadcrumb} onBack={() => history.push("/the-loai")}>
            <Form form={form} layout="vertical" onFinish={submitForm} fields={Object.keys(category).map(key => ({
                name: [key],
                value: category[key],
            }))}>
                <Row gutter={24}>
                    <Col xs={24} sm={12}>
                        <Form.Item name="id" label="ID">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
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
                        <Button type="primary" htmlType="submit" loading={loading}>Cập nhật</Button>
                    </Col>
                </Row>
            </Form>
        </PageHeader>
    );
};

export default EditCategoryPage;
