import { Breadcrumb, Col, Form, Input, PageHeader, Row, Select, Space } from "antd";
import { AxiosError } from "axios";
import { Song } from "pages/Song/types";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { APIResponse } from "services/service";
import songsService from "services/songsService";
import notification from "utils/notification";

type ParamTypes = {
    id: string;
};

const EditSongPage: React.FC = () => {
    const history = useHistory();
    const params = useParams<ParamTypes>();
    const [form] = Form.useForm();
    const [song, setSong] = useState<Partial<Song>>({});

    useEffect(() => {
        document.title = `Chỉnh sửa bài hát ${song.name ?? ""}`;
    }, [song.name]);

    useEffect(() => {
        songsService.find(~~params.id)
            .then(response => setSong(response.data))
            .catch((error: AxiosError<APIResponse>) => notification.error({
                message: error.response?.data.message,
            }));
    }, [params.id]);

    const submitForm = () => {};

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/bai-hat">Bài hát</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Chỉnh sửa bài hát</Breadcrumb.Item>
            </Breadcrumb>

            <PageHeader title="Chỉnh Sửa Bài Hát" onBack={() => history.push("/bai-hat")} style={{ padding: 0 }}>
                <Form form={form} layout="vertical" onFinish={submitForm} fields={Object.keys(song).map(key => ({
                    name: [key],
                    value: song[key],
                }))}>
                    <Row gutter={24}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="id" label="ID">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="name" label="Tên bài hát">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="other_name" label="Tên khác">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="other_name" label="Tên khác">
                                <Select mode="tags" placeholder="Nhập tên nghệ sĩ" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </PageHeader>
        </Space>
    );
};

export default EditSongPage;
