import Query from "@chuphong/query-builder";
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import { AxiosError } from "axios";
import { difference, numberFormat } from "helpers";
import PageHeader, { BreadcrumbProps } from "modules/Common/components/PageHeader";
import notification from "modules/Notification/notification";
import moment from "moment";
import { Artist } from "pages/Artists/types";
import { Category } from "pages/Category/types";
import { Song } from "pages/Song/types";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { APIResponse, ArtistService, CategoryService, SongService } from "services";

type ParamTypes = {
    id: string;
};

const songService = new SongService();
const artistService = new ArtistService();
const categoryService = new CategoryService();

const EditSongPage: React.FC = () => {
    const history = useHistory();
    const params = useParams<ParamTypes>();
    const [form] = Form.useForm();
    const [loading, showLoading] = useState(false);
    const [song, setSong] = useState<Partial<Song>>({});
    const [artists, setArtists] = useState<Artist[]>([]);
    const [categories, setCategorise] = useState<Category[]>([]);
    const goBack = () => history.push("/bai-hat");

    const breadcrumb: BreadcrumbProps = {
        useBrowserHistory: true,
        routes: [{
            path: "/",
            breadcrumbName: "Trang chủ",
        }, {
            path: "/bai-hat",
            breadcrumbName: "Quản lý bài hát",
        }, {
            path: `/bai-hat/${params.id}`,
            breadcrumbName: "Chỉnh sửa bài hát",
        }],
    };

    useEffect(() => {
        document.title = `Chỉnh sửa bài hát ${song.name ?? ""}`;
    }, [song.name]);

    // Lấy thông tin bài hát theo params.id
    useEffect(() => {
        songService.find(~~params.id)
            .then(response => setSong({
                ...response.data,
                year: moment(response.data.year, "YYYY"),
            }))
            .catch((error: AxiosError<APIResponse>) => notification.error({
                message: error.response?.data.message,
            }));
    }, [params.id]);

    // Lấy danh sách nghệ sĩ để phục vụ cho việc chọn lựa
    useEffect(() => {
        const query = new Query().for("artists").select("name");

        artistService.get<Artist[]>(query)
            .then(response => setArtists(response.data))
            .catch((error: AxiosError<APIResponse>) => notification.error({
                message: error.response?.data.message,
            }));
    }, []);

    // Lấy danh sách thể loại để phục cho việc chọn lựa
    useEffect(() => {
        const query = new Query().for("categories").select("name");

        categoryService.get<Category[]>(query)
            .then(response => setCategorise(response.data))
            .catch((error: AxiosError<APIResponse>) => notification.error({
                message: error.response?.data.message,
            }));
    }, []);

    const submitForm = (formData: Partial<Song>) => {
        const data = difference(formData, song);

        console.log(data);
    };

    return (
        <PageHeader title={`Chỉnh Sửa Bài Hát ${song.name}`} breadcrumb={breadcrumb} onBack={goBack}>
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
                        <Form.Item name="artists" label="Nghệ sĩ">
                            <Select mode="multiple" placeholder="Chọn nghệ sĩ">
                                {artists.map(artist => (
                                    <Select.Option key={artist.name} value={artist.name}>
                                        {artist.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="category" label="Thể loại">
                            <Select placeholder="Chọn thể loại bài hát" showSearch>
                                {categories.map(category => (
                                    <Select.Option key={category.name} value={category.name}>
                                        {category.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="year" label="Năm phát hành">
                            <DatePicker picker="year" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="views" label="Lượt nghe">
                            <InputNumber formatter={view => numberFormat(view as number)} min={0}
                                style={{ width: "100%" }} />
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

export default EditSongPage;
