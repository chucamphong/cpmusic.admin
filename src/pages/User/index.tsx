import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Input, notification, PageHeader, Popconfirm, Select, Space, Table, Tag } from "antd";
import { TablePaginationConfig } from "antd/lib/table/interface";
import { AxiosResponse } from "axios";
import debounce from "lodash/debounce";
import truncate from "lodash/truncate";
import { useAuth, User } from "modules/Auth";
import { UserList } from "pages/User/types";
import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import usersService from "services/usersService";

const UserPage: React.FC = () => {
    const auth = useAuth();
    const history = useHistory();

    const [usersTable, setUsersTable] = useState<UserList>([]);
    const [loading, showLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [column, setColumn] = useState("name");
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 20,
        showSizeChanger: false,
    });

    // Quay trở lại trang trước đó
    const goBack = () => history.goBack();

    // Thực hiện lấy danh sách tài khoản thỏa mãn query
    const fetchUsers = async <T extends any>(query: string, callback: (response: AxiosResponse<T>) => void) => {
        try {
            showLoading(true);
            const response = await usersService.fetch(`/users?${query}`);
            setUsersTable(response.data.data);
            callback(response);
        } catch (error) {
            notification.error({
                message: error.message,
            });
        } finally {
            showLoading(false);
        }
    };

    // Xử lý sự kiện khi phân trang
    const handleTableChange = async (tablePagination: TablePaginationConfig) => {
        const query = `filter[${column}]=${searchValue}&page[size]=${tablePagination.pageSize}&page[number]=${tablePagination.current}`;

        await fetchUsers(query, response => {
            setPagination({
                ...tablePagination,
                total: response.data.meta.total,    // Cập nhật lại tổng số tài khoản để phân trang
            });
        });
    };

    // Hàm tìm kiếm sử dụng debounce để delay 500ms rồi mới gửi request.
    const findUser = useRef(debounce(async (column: string, value: string) => {
        const query = `filter[${column}]=${value}&page[size]=${pagination.pageSize}&page[number]=${pagination.current}`;

        await fetchUsers(query, response => {
            setPagination({
                ...pagination,
                current: 1,                         // Reset lại phân trang về trang 1
                total: response.data.meta.total,    // Cập nhật lại tổng số tài khoản để phân trang
            });
        });
    }, 500)).current;

    const refreshUsersList = async () => {
        const query = `filter[${column}]=${searchValue}&page[size]=${pagination.pageSize}&page[number]=${pagination.current}`;

        await fetchUsers(query, response => {
            setPagination({
                ...pagination,
                total: response.data.meta.total,    // Cập nhật lại tổng số tài khoản để phân trang
            });
        });
    };

    const deleteUser = async (user: User) => {
        try {
            showLoading(true);
            const response = await usersService.remove(user.id);
            await refreshUsersList();
            notification.success({
                message: response.data.message,
            });
            console.log(response.data);
        } catch (e) {
            notification.error({
                message: "Bạn không có quyền thực hiện thao tác này",
            });
        } finally {
            showLoading(false);
        }
    };

    // Cập nhật tiêu đề trang web
    useEffect(() => {
        document.title = "Quản lý thành viên";
    }, []);

    // Tìm kiếm
    useEffect(() => {
        findUser(column, searchValue);
    }, [searchValue, column, findUser]);

    return (
        <Space direction={"vertical"} style={{ width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to={"/"}>Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Thành viên</Breadcrumb.Item>
            </Breadcrumb>

            <PageHeader title="Thành Viên" subTitle={"Thực hiện các chỉnh sửa đối với thành viên."}
                onBack={goBack} extra={[
                    <Button key="create" type="primary" icon={<PlusOutlined />}>Thêm</Button>,
                ]} style={{ padding: 0 }}>
                <Space direction={"vertical"} style={{ width: "100%" }}>
                    {/* Thanh tìm kiếm */}
                    <Input.Search onChange={(e) => setSearchValue(e.target.value)} placeholder="Tìm kiếm thành viên"
                        addonBefore={(
                            <Select defaultValue="name" onChange={value => setColumn(value)}>
                                <Select.Option value="name">Họ tên</Select.Option>
                                <Select.Option value="email">Email</Select.Option>
                            </Select>
                        )} value={searchValue} />

                    {/* Bảng danh sách tài khản */}
                    <Table rowKey={"id"} dataSource={usersTable} loading={loading}
                        pagination={pagination} onChange={handleTableChange}
                        scroll={{ y: 576 }} style={{ touchAction: "manipulation" }} bordered>
                        <Table.Column title="ID" dataIndex="id" width={64} />
                        <Table.Column title="Họ tên" dataIndex="name" width={300} ellipsis />
                        <Table.Column title="Địa chỉ email" dataIndex="email" width={300} ellipsis />
                        <Table.Column<string> title="Chức vụ" dataIndex="role" width={84} render={(role: string) => (
                            <Tag>{role.toUpperCase()}</Tag>
                        )} />
                        <Table.Column<User> title="Chức năng" width={84} align="center" render={(_, record) => (
                            <Space>
                                <Popconfirm
                                    title={`Bạn có muốn xóa thành viên ${truncate(record.name, { length: 10 })}?`}
                                    onConfirm={() => deleteUser(record)}
                                    disabled={auth.user?.id === record.id}>
                                    <Button type="danger" icon={<DeleteOutlined />} disabled={auth.user?.id === record.id} />
                                </Popconfirm>
                                <Link to={`/thanh-vien/${record.id}`}>
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

export default UserPage;
