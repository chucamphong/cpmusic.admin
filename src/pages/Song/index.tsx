import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import Query from "@chuphong/query-builder";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import { TablePaginationConfig } from "antd/es/table";
import { AxiosError, AxiosResponse } from "axios";
import { numberFormat } from "helpers";
import { truncate } from "lodash";
import PageHeader, { BreadcrumbProps } from "modules/Common/components/PageHeader";
import notification from "modules/Notification/notification";
import { Song } from "pages/Song/types";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDebounce } from "react-use";
import { SongService } from "services";

const breadcrumb: BreadcrumbProps = {
    useBrowserHistory: true,
    routes: [{
        path: "/",
        breadcrumbName: "Trang chủ",
    }, {
        path: "/bai-hat",
        breadcrumbName: "Quản lý bài hát",
    }],
};

const SongPage: React.FC = () => {
    const history = useHistory();
    const songService = new SongService();
    const [searchValue, setSearchValue] = useState("");
    const [songsTable, setSongsTable] = useState<Song[]>([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 20,
        showSizeChanger: false,
    });
    const [loading, showLoading] = useState(true);

    // Lấy danh sách bài hát theo query
    const getSongsList = async (query: Query) => {
        try {
            showLoading(true);
            const response = await songService.get(query);
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

    // Tìm kiềm bái hát
    const searchSong = async () => {
        const query = new Query().for("songs")
            .include(["category", "artists"])
            .select({
                songs: ["id", "name", "other_name", "thumbnail", "url", "year", "views", "category_id"],
                artists: ["name"],
                category: ["id", "name"],
            })
            .where("search", searchValue)
            .page(pagination.current as number)
            .limit(pagination.pageSize as number)
            .sort("-id");

        // Không cần try...catch vì đã bắt exception trong hàm getSongsList
        const response = await getSongsList(query) as AxiosResponse;
        setPagination({
            ...pagination,
            current: 1,                          // Reset lại phân trang về trang 1
            total: response.data.meta.total,     // Cập nhật lại tổng số bài hát để phân trang
        });
    };

    // Làm mới dữ liệu trong bảng bằng cách tìm kiếm lại
    const refreshTable = async () => await handleTableChange(pagination);

    // Gửi request lấy dữ liệu nếu table có sự thay đổi (chuyển trang,...)
    const handleTableChange = async (tablePagination: TablePaginationConfig) => {
        const queryBuilder = new Query().for("songs")
            .include(["category", "artists"])
            .select({
                songs: ["id", "name", "other_name", "thumbnail", "url", "year", "views", "category_id"],
                artists: ["name"],
                category: ["id", "name"],
            })
            .where("search", searchValue)
            .page(tablePagination.current as number)
            .limit(tablePagination.pageSize as number)
            .sort("-id");

        // Không cần try...catch vì đã bắt exception trong hàm getSongsList
        const response = await getSongsList(queryBuilder) as AxiosResponse;
        setPagination({
            ...tablePagination,
            total: response.data.meta.total,
        });
    };

    // Xóa bài hát
    const deleteSong = async (song: Song) => {
        try {
            showLoading(true);
            const response = await songService.remove(song.id);
            // Cập nhật lại dữ liệu trong bảng
            await refreshTable();
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

    // Cập nhật tiêu đề trang web
    useEffect(() => {
        document.title = "Quản lý bài hát";
    }, []);

    /**
     * Lấy dữ liệu cho lần đầu tiên và đảm nhận luôn chức năng tìm kiếm
     * Lấy giá trị cuối cùng của searchValue sau 500ms thì mới gửi request lên server lại
     */
    useDebounce(searchSong, 500, [searchValue]);

    return (
        <PageHeader title="Quản Lý Bài Hát" breadcrumb={breadcrumb} onBack={() => history.goBack()} extra={[
            <Link to="/bai-hat/tao-bai-hat" key="create">
                <Button type="primary" icon={<PlusOutlined />}>Thêm</Button>
            </Link>,
        ]}>
            <Space direction={"vertical"} style={{ width: "100%" }}>
                {/* Thanh tìm kiếm */}
                <Input.Search value={searchValue} onChange={(e) => setSearchValue(e.target.value)} maxLength={255}
                    placeholder="Tìm kiếm theo tên bài hát, nghệ sĩ, thể loại" />

                {/* Bảng danh sách bài hát */}
                <Table rowKey={"id"} dataSource={songsTable} loading={loading}
                    onChange={(pagination) => handleTableChange(pagination)}
                    pagination={pagination as TablePaginationConfig} scroll={{ y: 576 }}
                    style={{ touchAction: "manipulation" }} bordered>
                    <Table.Column title="ID" dataIndex="id" width={84} align="center" />
                    <Table.Column<Song> title="Ảnh đại diện" dataIndex="thumbnail" width={120} align="center"
                        render={(image: string, record) => (
                            <img src={image} alt={record.name} style={{ maxWidth: 90 }} />
                        )} />
                    <Table.Column title="Tên bài hát" dataIndex="name" width={300} ellipsis />
                    <Table.Column title="Tên khác" dataIndex="other_name" width={250} ellipsis />
                    <Table.Column title="Nghệ sĩ" dataIndex="artists" width={150} ellipsis
                        render={(artists: string[]) => artists.join(", ")} />
                    <Table.Column title="Năm phát hành" dataIndex="year" width={120} align="center" />
                    <Table.Column title="Lượt nghe" dataIndex="views" width={120} align="center"
                        render={(views: number) => numberFormat(views, "vi", {
                            // @ts-ignore
                            notation: "compact",
                            compactDisplay: "short",
                        })} />
                    <Table.Column title="Thể loại" dataIndex="category" width={140} ellipsis />
                    <Table.Column<Song> title="Chức năng" width={150} align="center" render={(_, song) => (
                        <Space>
                            <Popconfirm
                                title={`Bạn có muốn xóa bài hát ${truncate(song.name, { length: 10 })}?`}
                                onConfirm={() => deleteSong(song)}>
                                <Button type="primary" icon={<DeleteOutlined />} danger />
                            </Popconfirm>
                            <Link to={`/bai-hat/${song.id}`}>
                                <Button type="primary" icon={<EditOutlined />} />
                            </Link>
                        </Space>
                    )} />
                </Table>
            </Space>
        </PageHeader>
    );
};

export default SongPage;
