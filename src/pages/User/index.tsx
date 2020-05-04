import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import Query from "@chuphong/query-builder";
import { Breadcrumb, Button, Input, PageHeader, Popconfirm, Select, Space, Table, Tag } from "antd";
import { PaginationConfig } from "antd/es/pagination";
import { TablePaginationConfig } from "antd/lib/table/interface";
import { AxiosError, AxiosResponse } from "axios";
import { debounce, truncate } from "lodash";
import { useAuth, User } from "modules/Auth";
import { UserList } from "pages/User/types";
import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { APIPaginatedResponse } from "services/service";
import usersService from "services/usersService";
import notification from "utils/notification";

const UserPage: React.FC = () => {
    const auth = useAuth();
    const history = useHistory();

    const [usersTable, setUsersTable] = useState<UserList>([]);
    const [loading, showLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [column, setColumn] = useState("name");
    const [pagination, setPagination] = useState<PaginationConfig>({
        current: 1,
        pageSize: 20,
        showSizeChanger: false,
    });

    // Quay trở lại trang /thanh-vien đó
    const goBack = () => history.push("/thanh-vien");

    // Thực hiện lấy danh sách tài khoản thỏa mãn query
    const fetchUsers = async (query: Query, callback: (response: AxiosResponse<APIPaginatedResponse<User>>) => void) => {
        try {
            showLoading(true);
            const response = await usersService.get(query);
            setUsersTable(response.data.data);
            callback(response);
        } catch (e) {
            notification.error({
                message: (e as AxiosError).response?.data.message,
            });
        } finally {
            showLoading(false);
        }
    };

    // Xử lý sự kiện khi phân trang
    const handleTableChange = async (tablePagination: PaginationConfig) => {
        const query = new Query().for("users")
            .where(column, searchValue)
            .page(tablePagination.current as number)
            .limit(tablePagination.pageSize as number);

        await fetchUsers(query, response => {
            setPagination({
                ...tablePagination,
                total: response.data.meta.total,    // Cập nhật lại tổng số tài khoản để phân trang
            });
        });
    };

    // Hàm tìm kiếm sử dụng debounce để delay 500ms rồi mới gửi request.
    const find = useRef(debounce(async (column: string, value: string) => {
        const query = new Query().for("users")
            .where(column, value)
            .page(pagination.current as number)
            .limit(pagination.pageSize as number);

        await fetchUsers(query, response => {
            setPagination({
                ...pagination,
                current: 1,                         // Reset lại phân trang về trang 1
                total: response.data.meta.total,    // Cập nhật lại tổng số tài khoản để phân trang
            });
        });
    }, 500)).current;

    const refreshUsersList = async () => {
        const query = new Query().for("users")
            .where(column, searchValue)
            .page(pagination.current as number)
            .limit(pagination.pageSize as number);

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
        document.title = "Quản lý tài khoản";
    }, []);

    // Tìm kiếm
    useEffect(() => {
        (async () => find(column, searchValue))();
    }, [searchValue, column, find]);

    return (
        <Space direction={"vertical"} style={{ width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to={"/"}>Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Thành viên</Breadcrumb.Item>
            </Breadcrumb>

            <PageHeader title="Thành Viên" onBack={goBack} extra={[
                <Link to="/thanh-vien/tao-tai-khoan" key="create">
                    <Button type="primary" icon={<PlusOutlined />}>Thêm</Button>
                </Link>,
            ]} style={{ padding: 0 }}>
                <Space direction={"vertical"} style={{ width: "100%" }}>
                    {/* Thanh tìm kiếm */}
                    <Input.Search onChange={(e) => setSearchValue(e.target.value)} placeholder="Tìm kiếm thành viên"
                        addonBefore={(
                            <Select defaultValue="name" onChange={value => setColumn(value)}>
                                <Select.Option value="name">Họ tên</Select.Option>
                                <Select.Option value="email">Email</Select.Option>
                            </Select>
                        )} value={searchValue} maxLength={255} />

                    {/* Bảng danh sách tài khản */}
                    <Table rowKey={"id"} dataSource={usersTable} loading={loading}
                        pagination={pagination as TablePaginationConfig} onChange={(pagination) => handleTableChange(pagination)}
                        scroll={{ y: 576 }} style={{ touchAction: "manipulation" }} bordered>
                        <Table.Column title="ID" dataIndex="id" width={64} />
                        <Table.Column title="Họ tên" dataIndex="name" width={300} ellipsis />
                        <Table.Column title="Địa chỉ email" dataIndex="email" width={300} ellipsis />
                        <Table.Column title="Chức vụ" dataIndex="role" width={84} render={(role: string) => {
                            const color = {
                                "admin": "#d8345f",
                                "mod": "#0779e4",
                                "member": "default",
                            };
                            return <Tag color={color[role]}>{role.toUpperCase()}</Tag>;
                        }} />
                        <Table.Column<User> title="Chức năng" width={100} align="center" render={(_, record) => (
                            <Space>
                                <Popconfirm
                                    title={`Bạn có muốn xóa thành viên ${truncate(record.name, { length: 10 })}?`}
                                    onConfirm={() => deleteUser(record)}
                                    disabled={auth.isMe(record)}>
                                    <Button type="primary" icon={<DeleteOutlined />}
                                        disabled={auth.user?.id === record.id} danger />
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
