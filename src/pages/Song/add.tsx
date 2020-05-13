import Query from "@chuphong/query-builder";
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import { Rule } from "antd/es/form";
import { AxiosError } from "axios";
import { numberFormat } from "helpers";
import PageHeader, { BreadcrumbProps } from "modules/Common/components/PageHeader";
import UploadImage from "modules/Common/components/UploadImage";
import notification from "modules/Notification/notification";
import moment from "moment";
import { Artist } from "pages/Artists/types";
import { Category } from "pages/Category/types";
import UploadSong from "pages/Song/components/UploadSong";
import { Song } from "pages/Song/types";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { APIResponse, ArtistService, CategoryService, SongService } from "services";

const songService = new SongService();
const artistService = new ArtistService();
const categoryService = new CategoryService();

/**
 * Tạo bộ quy tắc để kiểm tra dữ liệu khi nhập form
 */
const rules: ArrayDictionary<Rule> = {
    name: [{
        required: true,
        message: "Tên bài hát không được để trống",
    }, {
        min: 4,
        message: "Tối thiểu 4 ký tự",
    }],
    other_name: [{
        min: 4,
        message: "Tối thiểu 4 ký tự",
    }],
    thumbnail: [{
        required: true,
        message: "Không được để trống ảnh đại diện",
    }, {
        type: "url",
        message: "Vui lòng nhập vào một url",
    }],
    url: [{
        required: true,
        message: "Không được để trống bài hát",
    }, {
        type: "url",
        message: "Vui lòng nhập vào một url",
    }],
    year: [{
        required: true,
        message: "Không được để trống năm phát hành",
    }],
    category: [{
        required: true,
        message: "Không được để trống thể loại",
    }],
    artists: [{
        required: true,
        message: "Không được để trống nghệ sĩ",
    }],
    views: [{
        type: "number",
        message: "Lượt nghe phải là một con số",
    }],
};

const breadcrumb: BreadcrumbProps = {
    useBrowserHistory: true,
    routes: [{
        path: "/",
        breadcrumbName: "Trang chủ",
    }, {
        path: "/bai-hat",
        breadcrumbName: "Quản lý bài hát",
    }, {
        path: "/bai-hat/tao-bai-hat",
        breadcrumbName: "Thêm bài hát",
    }],
};

const AddSongPage: React.FC = () => {
    const history = useHistory();
    const [form] = Form.useForm();
    const [loading, showLoading] = useState(false);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [categories, setCategorise] = useState<Category[]>([]);
    const [quit, quitPage] = useState(false);
    const audio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        document.title = "Tạo bài hát";
    }, []);

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

    useEffect(() => {
        audio.current?.load();
    }, []);

    useEffect(() => {
        if (quit) {
            history.push("/bai-hat");
        }
    }, [history, quit]);

    const submitForm = async (formData: Partial<Song>) => {
        // Gửi request tạo bài hát lên server
        try {
            showLoading(true);

            formData["year"] = (formData.year as moment.Moment)?.year();

            // Gửi request
            const response = await songService.create(formData);

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
        <PageHeader title={"Tạo Bài Hát"} breadcrumb={breadcrumb} onBack={() => history.push("/bai-hat")}>
            <Form form={form} layout="vertical" onFinish={submitForm}>
                {/* eslint-disable-next-line */}
                <audio ref={audio} controls style={{ width: "100%", marginBottom: 10 }}>
                    <source src={undefined} type="audio/mpeg" />
                </audio>
                <Row gutter={24}>
                    <Col xs={24} sm={12}>
                        <Form.Item name="name" label="Tên bài hát" rules={rules.name}>
                            <Input maxLength={255} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="other_name" label="Tên khác" rules={rules.other_name}>
                            <Input maxLength={255} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="artists" label="Nghệ sĩ" rules={rules.artists}>
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
                        <Form.Item name="category" label="Thể loại" rules={rules.category}>
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
                        <Form.Item name="year" label="Năm phát hành" rules={rules.year}>
                            <DatePicker picker="year" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="views" label="Lượt nghe" rules={rules.views}>
                            <InputNumber formatter={view => numberFormat(view as number)} min={0}
                                style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="url" label="Bài hát" rules={rules.url}>
                            <UploadSong upload={formData => songService.uploadSong(formData)}
                                onSuccess={songUrl => {
                                    form.setFieldsValue({ url: songUrl });
                                            audio.current?.setAttribute("src", songUrl);
                                }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="thumbnail" label="Ảnh đại diện" rules={rules.thumbnail}>
                            <UploadImage upload={formData => songService.uploadThumbnail(formData)}
                                onSuccess={(imageUrl) => form.setFieldsValue({ thumbnail: imageUrl })} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12} justify="end">
                    <Col>
                        <Button onClick={() => history.goBack()}>Hủy bỏ</Button>
                    </Col>
                    <Col>
                        <Button type="primary" htmlType="submit" loading={loading}>Tạo bài hát</Button>
                    </Col>
                </Row>
            </Form>
        </PageHeader>
    );
};

export default AddSongPage;
