import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Input, notification, PageHeader, Select, Space, Table, Tag } from "antd";
import { ColumnProps } from "antd/es/table";
import { TablePaginationConfig } from "antd/lib/table/interface";
import { AxiosResponse } from "axios";
import debounce from "lodash/debounce";
import { User } from "modules/Auth";
import AbilityContext from "modules/CASL/AbilityContext";
import { UserList } from "pages/User/types";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import usersService from "services/usersService";

const columns: ColumnProps<User>[] = [{
    title: "ID",
    dataIndex: "id",
    sorter: (a, b) => a.id - b.id,
}, {
    title: "Họ tên",
    dataIndex: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
}, {
    title: "Email",
    dataIndex: "email",
    sorter: (a, b) => a.email.localeCompare(b.email),
}, {
    title: "Chức vụ",
    dataIndex: "role",
    filters: [{
        text: "Admin",
        value: "admin",
    }, {
        text: "Mod",
        value: "mod",
    }, {
        text: "Member",
        value: "member",
    }],
    onFilter: (value, record: User) => new RegExp(record.role, "i").test(value.toString()),
    render: (role: string) => (
        <Tag color="#09b87f">
            {role.toUpperCase()}
        </Tag>
    ),
}, {
    title: "Tác vụ",
    render: () => (
        <Space>
            <Button type="danger"><DeleteOutlined /></Button>
            <Button type="primary"><EditOutlined /></Button>
        </Space>
    ),
}];

const UserPage: React.FC = () => {
    const history = useHistory();
    const ability = useContext(AbilityContext);

    const [usersTable, setUsersTable] = useState<UserList>([]);
    const [loading, showLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [column, setColumn] = useState("name");
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        showSizeChanger: false,
    });

    // Quay trở lại trang trước đó
    const goBack = () => history.goBack();

    // Thực hiện lấy danh sách tài khoản thỏa mãn query
    const fetchUsers = async <T extends any>(query: string, callback: (response: AxiosResponse<T>) => void) => {
        if (ability.cannot("view", "users")) return;

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
    const handleTableChange = async (tablePagination) => {
        const query = `filter[${column}]=${searchValue}&page[size]=${tablePagination.pageSize}&page[number]=${tablePagination.current}`;

        await fetchUsers(query, response => {
            setPagination({
                ...tablePagination,
                total: response.data.meta.total,    // Cập nhật lại tổng số tài khoản để phân trang
            });
        });
    };

    // Cập nhật tiêu đề trang web
    useEffect(() => {
        document.title = "Quản lý thành viên";
    }, []);

    // Kiểm tra quyền truy cập
    useEffect(() => {
        if (ability.cannot("view", "users")) {
            history.push("/khong-co-quyen-truy-cap");
        }
    }, [ability, history]);

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
                    <Table rowKey={"id"} dataSource={usersTable} columns={columns} sortDirections={["descend"]}
                        loading={loading} pagination={pagination} onChange={handleTableChange} bordered />
                </Space>
            </PageHeader>
        </Space>
    );
};

export default UserPage;
