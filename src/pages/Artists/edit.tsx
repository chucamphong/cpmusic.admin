import { Button, Col, Form, Input, Row } from "antd";
import { Rule } from "antd/es/form";
import { AxiosError } from "axios";
import { difference } from "helpers";
import { isEmpty } from "lodash";
import PageHeader, { BreadcrumbProps } from "modules/Common/components/PageHeader";
import UploadImage from "modules/Common/components/UploadImage";
import useQuitPage from "modules/Common/hooks/useQuitPage";
import notification from "modules/Notification/notification";
import { Artist } from "pages/Artists/types";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { APIResponse, ArtistService } from "services";

type ParamTypes = {
    id: string;
};

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

const EditArtistPage: React.FC = () => {
    const history = useHistory();
    const params = useParams<ParamTypes>();
    const [artist, setArtist] = useState<Partial<Artist>>({});
    const [, quitPage] = useQuitPage("/nghe-si");
    const [form] = Form.useForm();
    const [loading, showLoading] = useState(false);

    const breadcrumb: BreadcrumbProps = {
        useBrowserHistory: true,
        routes: [{
            path: "/",
            breadcrumbName: "Trang chủ",
        }, {
            path: "/nghe-si",
            breadcrumbName: "Quản lý nghệ sĩ",
        }, {
            path: `/nghe-si/${params.id}`,
            breadcrumbName: "Chỉnh sửa nghệ sĩ",
        }],
    };

    useEffect(() => {
        document.title = `Chỉnh sửa nghệ sĩ ${artist.name ?? ""}`;
    }, [artist.name]);

    // Lấy thông tin nghệ sĩ theo params.id
    useEffect(() => {
        artistService.find(~~params.id)
            .then(response => setArtist(response.data))
            .catch((error: AxiosError<APIResponse>) => notification.error({
                message: error.response?.data.message,
            }));
    }, [params.id]);

    const submitForm = async (formData: Partial<Artist>) => {
        const data = difference(formData, artist);

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
            const response = await artistService.update(+params.id, data);

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
        <PageHeader title={`Chỉnh Sửa Nghệ Sĩ ${artist.name ?? ""}`} breadcrumb={breadcrumb} onBack={() => history.push("/nghe-si")}>
            <Form form={form} layout="vertical" onFinish={submitForm} fields={Object.keys(artist).map(key => ({
                name: [key],
                value: artist[key],
            }))}>
                <Row gutter={24}>
                    <Col xs={24} sm={12}>
                        <Form.Item name="id" label="ID">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="name" label="Tên nghệ sĩ" rules={rules.name}>
                            <Input placeholder="Nhập tên nghệ sĩ" maxLength={255} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="avatar" label="Ảnh đại diện" rules={rules.avatar}>
                            <UploadImage upload={formData => artistService.uploadAvatar(formData)}
                                defaultImage={artist.avatar}
                                onSuccess={(imageUrl) => form.setFieldsValue({ avatar: imageUrl })} />
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

export default EditArtistPage;
