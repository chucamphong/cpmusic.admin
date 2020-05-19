import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import Query from "@chuphong/query-builder";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import { TablePaginationConfig } from "antd/es/table";
import { AxiosError, AxiosResponse } from "axios";
import PageHeader, { BreadcrumbProps } from "modules/Common/components/PageHeader";
import notification from "modules/Notification/notification";
import { Artist } from "pages/Artists/types";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDebounce } from "react-use";
import ArtistService from "services/artistService";

const artistService = new ArtistService();

const breadcrumb: BreadcrumbProps = {
    useBrowserHistory: true,
    routes: [{
        path: "/",
        breadcrumbName: "Trang chủ",
    }, {
        path: "/nghe-si",
        breadcrumbName: "Quản lý nghệ sĩ",
    }],
};

const ArtistPage: React.FC = () => {
    const history = useHistory();
    const [searchValue, setSearchValue] = useState("");
    const [artistsTable, setArtistsTable] = useState<Artist[]>([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 20,
        showSizeChanger: false,
    });
    const [loading, showLoading] = useState(true);

    const getArtistsList = async (query: Query) => {
        try {
            showLoading(true);
            const response = await artistService.get(query);
            setArtistsTable(response.data.data);
            return response;
        } catch (e) {
            notification.error({
                message: (e as AxiosError).response?.data.message,
            });
        } finally {
            showLoading(false);
        }
    };

    const searchArtist = async () => {
        const query = new Query().for("artists")
            .include("songsCount")
            .page(pagination.current as number)
            .limit(pagination.pageSize as number)
            .where("name", searchValue)
            .sort("-id");

        const response = await getArtistsList(query) as AxiosResponse;
        setPagination({
            ...pagination,
            current: 1,
            total: response.data.meta.total,
        });
    };

    const handleTableChange = async (tablePagination: TablePaginationConfig) => {
        const query = new Query().for("artists")
            .include("songsCount")
            .page(tablePagination.current as number)
            .limit(tablePagination.pageSize as number)
            .where("name", searchValue)
            .sort("-id");

        const response = await getArtistsList(query) as AxiosResponse;
        setPagination({
            ...tablePagination,
            total: response.data.meta.total,
        });
    };

    // Làm mới dữ liệu trong bảng bằng cách tìm kiếm lại
    const refreshTable = async () => await handleTableChange(pagination);

    const deleteArtist = async (artist: Artist) => {
        try {
            showLoading(true);
            const response = await artistService.remove(artist.id);
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

    useEffect(() => {
        document.title = "Quản lý nghệ sĩ";
    }, []);

    useDebounce(searchArtist, 500, [searchValue]);

    return (
        <PageHeader title="Quản Lý Nghệ Sĩ" breadcrumb={breadcrumb} onBack={() => history.goBack()} extra={[
            <Link to="/nghe-si/tao-nghe-si" key="create">
                <Button type="primary" icon={<PlusOutlined />}>Thêm</Button>
            </Link>,
        ]}>
            <Space direction={"vertical"} style={{ width: "100%" }}>
                <Input.Search value={searchValue} onChange={(e) => setSearchValue(e.target.value)} maxLength={255}
                    placeholder="Tìm kiếm theo tên nghệ sĩ" />

                <Table rowKey={"id"} dataSource={artistsTable} loading={loading}
                    onChange={(pagination) => handleTableChange(pagination)}
                    pagination={pagination as TablePaginationConfig} scroll={{ y: 576 }}
                    style={{ touchAction: "manipulation" }} bordered>
                    <Table.Column title="ID" dataIndex="id" width={84} align="center" />
                    <Table.Column<Artist> title="Ảnh đại diện" dataIndex="avatar" width={120} align="center"
                        render={(image: string, record) => (
                            <img src={image} alt={record.name} style={{ maxWidth: 90 }} />
                        )} />
                    <Table.Column title="Tên nghệ sĩ" dataIndex="name" width={300} ellipsis />
                    <Table.Column title="Tổng số bài hát" dataIndex="songs_count" width={300} ellipsis align="center" />
                    <Table.Column<Artist> title="Chức năng" width={150} align="center" render={(_, artist) => (
                        <Space>
                            <Popconfirm
                                title={`Nếu bạn xóa nghệ sĩ thì ${artist.songs_count} bài hát liên quan cũng sẽ bị xóa`}
                                onConfirm={() => deleteArtist(artist)}>
                                <Button type="primary" icon={<DeleteOutlined />} danger />
                            </Popconfirm>
                            <Link to={`/nghe-si/${artist.id}`}>
                                <Button type="primary" icon={<EditOutlined />} />
                            </Link>
                        </Space>
                    )} />
                </Table>
            </Space>
        </PageHeader>
    );
};

export default ArtistPage;
