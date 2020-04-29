import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import Query from "@chuphong/query-builder";
import { Breadcrumb, Button, Input, PageHeader, Popconfirm, Space, Table } from "antd";
import { TablePaginationConfig } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { debounce, truncate } from "lodash";
import { Category, Song } from "pages/Song/types";
import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import songsService from "services/songsService";
import notification from "utils/notification";

const SongPage: React.FC = () => {
    const history = useHistory();
    const [searchValue, setSearchValue] = useState("");
    const [songsTable, setSongsTable] = useState([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 20,
        showSizeChanger: false,
    });
    const [loading, showLoading] = useState(true);

    const goBack = () => history.push("/bai-hat");

    /**
     * @description Lấy danh sách bài hát theo query
     */
    const getSongsList = async (query: Query) => {
        try {
            showLoading(true);
            const response = await songsService.get(query);
            setSongsTable(response.data.data);
            return response;
        } catch (e) {
            notification.error({
                message: (e as AxiosError).response?.data.message,
            });
        } finally {
            showLoading(false);
        }
    };

    const handleTableChange = async (tablePagination: TablePaginationConfig) => {
        const queryBuilder = new Query().for("songs")
            .include("category")
            .where("search", searchValue)
            .page(tablePagination.current as number)
            .limit(tablePagination.pageSize as number)
            .sort("-id");

        const response = await getSongsList(queryBuilder);
        setPagination({
            ...tablePagination,
            total: response?.data.meta.total,
        });
    };

    const deleteSong = async (song: Song) => {
        try {
            showLoading(true);
            const response = await songsService.remove(song.id);
            await refresh();
            notification.success({
                message: response.data.message,
            });
        } catch (e) {
            notification.error({
                message: (e as AxiosError).response?.data.message,
            });
        } finally {
            showLoading(false);
        }
    };

    const find = useRef(debounce(async (value: string) => {
        const queryBuilder = new Query().for("songs")
            .include("category")
            .where("search", value)
            .page(pagination.current as number)
            .limit(pagination.pageSize as number)
            .sort("-id");

        const response = await getSongsList(queryBuilder);
        setPagination({
            ...pagination,
            current: 1,                         // Reset lại phân trang về trang 1
            total: response?.data.meta.total,    // Cập nhật lại tổng số tài khoản để phân trang
        });
    }, 500)).current;

    const refresh = async () => {
        const queryBuilder = new Query()
            .for("songs")
            .include("category")
            .where("search", searchValue)
            .page(pagination.current as number)
            .limit(pagination.pageSize as number)
            .sort("-id");

        const response = await getSongsList(queryBuilder);
        setPagination({
            ...pagination,
            current: 1,                         // Reset lại phân trang về trang 1
            total: response?.data.meta.total,    // Cập nhật lại tổng số tài khoản để phân trang
        });
    };

    // Cập nhật tiêu đề trang web
    useEffect(() => {
        document.title = "Quản lý bài hát";
    }, []);

    // Lấy dữ liệu cho lần đầu tiên và đảm nhận luôn chức năng tìm kiếm
    useEffect(() => {
        (async () => await find(searchValue))();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue]);

    return (
        <Space direction={"vertical"} style={{ width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to={"/"}>Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Thành viên</Breadcrumb.Item>
            </Breadcrumb>

            <PageHeader title="Bài Hát" onBack={goBack} extra={[
                <Link to="/thanh-vien/tao-bai-hat" key="create">
                    <Button type="primary" icon={<PlusOutlined />}>Thêm</Button>
                </Link>,
            ]} style={{ padding: 0 }}>
                <Space direction={"vertical"} style={{ width: "100%" }}>
                    {/* Thanh tìm kiếm */}
                    <Input.Search value={searchValue} onChange={(e) => setSearchValue(e.target.value)} maxLength={255}
                        placeholder="Tìm kiếm theo tên bài hát, nghệ sĩ, thể loại" />

                    {/* Bảng danh sách tài khản */}
                    <Table rowKey={"id"} dataSource={songsTable} loading={loading} onChange={handleTableChange}
                        pagination={pagination} scroll={{ y: 576 }} style={{ touchAction: "manipulation" }} bordered>
                        <Table.Column title="ID" dataIndex="id" width={64} />
                        <Table.Column title="Họ tên" dataIndex="name" width={300} ellipsis />
                        <Table.Column title="Tên khác" dataIndex="other_name" width={300} ellipsis />
                        <Table.Column<Song> title="Ảnh đại diện" dataIndex="thumbnail" width={120}
                            render={(image: string, record) => (
                                <img src={image} alt={record.name} style={{ maxWidth: 64 }} />
                            )} />
                        <Table.Column title="Năm phát hành" dataIndex="year" width={120} />
                        <Table.Column title="Lượt nghe" dataIndex="views" width={120} render={(views: number) =>
                            Intl.NumberFormat().format(views)
                        } />
                        <Table.Column title="Thể loại" dataIndex="category" width={140} render={(category: Category) =>
                            category.name
                        } />
                        <Table.Column<Song> title="Chức năng" width={150} align="center" render={(_, song) => (
                            <Space>
                                <Popconfirm
                                    title={`Bạn có muốn xóa bài hát ${truncate(song.name, { length: 10 })}?`}
                                    onConfirm={() => deleteSong(song)}>
                                    <Button type="danger" icon={<DeleteOutlined />} />
                                </Popconfirm>
                                <Link to={`/bai-hat/${song.name}`}>
                                    <Button type="primary" icon={<EditOutlined />} />
                                </Link>
                            </Space>
                        )} />
                    </Table>
                </Space>
            </PageHeader>
        </Space>
    );
};

export default SongPage;
