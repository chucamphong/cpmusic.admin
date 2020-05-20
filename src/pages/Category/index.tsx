import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import Query from "@chuphong/query-builder";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import { TablePaginationConfig } from "antd/es/table";
import { AxiosError, AxiosResponse } from "axios";
import PageHeader, { BreadcrumbProps } from "modules/Common/components/PageHeader";
import notification from "modules/Notification/notification";
import { Artist } from "pages/Artists/types";
import { Category } from "pages/Category/types";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDebounce } from "react-use";
import CategoryService from "services/categoryService";

const breadcrumb: BreadcrumbProps = {
    useBrowserHistory: true,
    routes: [{
        path: "/",
        breadcrumbName: "Trang chủ",
    }, {
        path: "/the-loai",
        breadcrumbName: "Quản lý thể loại",
    }],
};

const categoryService = new CategoryService();

const CategoryPage: React.FC = () => {
    const history = useHistory();
    const [categoriesTable, setCategoriesTable] = useState<Artist[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 20,
        showSizeChanger: false,
    });
    const [loading, showLoading] = useState(true);

    const getCategoriesList = async (query: Query) => {
        try {
            showLoading(true);
            const response = await categoryService.get(query);
            setCategoriesTable(response.data.data);
            return response;
        } catch (e) {
            notification.error({
                message: (e as AxiosError).response?.data.message,
            });
        } finally {
            showLoading(false);
        }
    };

    const searchCategory = async () => {
        const query = new Query().for("categories")
            .include("songsCount")
            .page(pagination.current as number)
            .limit(pagination.pageSize as number)
            .where("name", searchValue)
            .sort("-id");

        const response = await getCategoriesList(query) as AxiosResponse;
        setPagination({
            ...pagination,
            current: 1,
            total: response.data.meta.total,
        });
    };

    const handleTableChange = async (tablePagination: TablePaginationConfig) => {
        const query = new Query().for("categories")
            .include("songsCount")
            .page(tablePagination.current as number)
            .limit(tablePagination.pageSize as number)
            .where("name", searchValue)
            .sort("-id");

        const response = await getCategoriesList(query) as AxiosResponse;
        setPagination({
            ...tablePagination,
            total: response.data.meta.total,
        });
    };

    const refreshTable = async () => await handleTableChange(pagination);

    const deleteCategory = async (artist: Artist) => {
        try {
            showLoading(true);
            const response = await categoryService.remove(artist.id);
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
        document.title = "Quản lý thể loại";
    }, []);

    useDebounce(searchCategory, 500, [searchValue]);

    return (
        <PageHeader title="Quản Lý Thể Loại" breadcrumb={breadcrumb} onBack={() => history.goBack()} extra={[
            <Link to="/the-loai/tao-the-loai" key="create">
                <Button type="primary" icon={<PlusOutlined />}>Thêm</Button>
            </Link>,
        ]}>
            <Space direction={"vertical"} style={{ width: "100%" }}>
                <Input.Search value={searchValue} onChange={(e) => setSearchValue(e.target.value)} maxLength={255}
                    placeholder="Tìm kiếm theo tên thể loại" />

                <Table rowKey={"id"} dataSource={categoriesTable} loading={loading}
                    onChange={(pagination) => handleTableChange(pagination)}
                    pagination={pagination} scroll={{ y: 576 }}
                    style={{ touchAction: "manipulation" }} bordered>
                    <Table.Column title="ID" dataIndex="id" width={84} align="center" />
                    <Table.Column title="Tên thể loại" dataIndex="name" width={300} ellipsis />
                    <Table.Column title="Tổng số bài hát" dataIndex="songs_count" width={300} ellipsis align="center" />
                    <Table.Column<Category> title="Chức năng" width={150} align="center" render={(_, category) => (
                        <Space>
                            <Popconfirm
                                title={`Nếu bạn xóa thể loại thì ${category.songs_count} bài hát liên quan cũng sẽ bị xóa`}
                                onConfirm={() => deleteCategory(category)}>
                                <Button type="primary" icon={<DeleteOutlined />} danger />
                            </Popconfirm>
                            <Link to={`/nghe-si/${category.id}`}>
                                <Button type="primary" icon={<EditOutlined />} />
                            </Link>
                        </Space>
                    )} />
                </Table>
            </Space>
        </PageHeader>
    );
};

export default CategoryPage;
