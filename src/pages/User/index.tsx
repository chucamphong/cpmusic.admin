import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Input, notification, PageHeader, Select, Space, Table, Tag } from "antd";
import { ColumnProps } from "antd/es/table";
import debounce from "lodash/debounce";
import { User } from "modules/Auth";
import AbilityContext from "modules/CASL/AbilityContext";
import { UserList } from "pages/User/types";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
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

    // Lưu danh sách tài khoản để hiển thị lên table
    const [usersTable, setUsersTable] = useState<UserList>();
    // Lưu trạng thái của thanh loading hiện/ẩn
    const [loading, setLoading] = useState(false);
    // Lưu giá trị tìm kiếm
    const [searchValue, setSearchValue] = useState<string>();
    // Lưu cột để phục vụ cho việc tìm kiếm
    const [selected, setSelectedValue] = useState<string>("name");

    // Quay trở lại trang trước đó
    const goBack = () => history.goBack();

    // Gửi request để lấy dữ liệu
    const request = async (url: string) => {
        try {
            setLoading(true);
            const response = await usersService.fetch(url);
            setUsersTable(response.data);
        } catch (e) {
            notification.error({
                message: "Truy vấn thất bại",
            });
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh sách tài khoản người dùng
    const fetchUsersList = useCallback(() => {
        (async () => {
            const url = "/users?fields[users]=id,name,email&sort=id";
            await request(url);
        })();
    }, []);

    // Tìm kiếm "value" với "column" trong csdl
    const findBy = useCallback((column: string, value: string) => {
        (async () => {
            const url = `/users?filter[${column}]=${value}`;
            await request(url);
        })();
    }, []);

    // Hàm này sẽ delay 500ms mới lấy giá trị tìm kiếm mới và gửi lên server tránh spam
    const search = useRef(debounce((column: string, searchValue: string) => {
        findBy(column, searchValue);
    }, 500)).current;

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

    // Gửi api lấy dữ liệu về cho table
    useEffect(() => {
        if (!searchValue) {
            fetchUsersList();
        } else {
            search(selected, searchValue);
        }
    }, [fetchUsersList, search, searchValue, selected]);

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
                    <Button onClick={fetchUsersList} key="refresh" icon={<ReloadOutlined />}>Tải lại</Button>,
                    <Button key="create" type="primary" icon={<PlusOutlined />}>Thêm</Button>,
                ]} style={{ padding: 0 }}>
                <Space direction={"vertical"} style={{ width: "100%" }}>
                    {/* Thanh tìm kiếm */}
                    <Input.Search onChange={(e) => setSearchValue(e.target.value)} placeholder="Tìm kiếm thành viên"
                        addonBefore={(
                            <Select defaultValue="name" onChange={value => setSelectedValue(value)}>
                                <Select.Option value="name">Họ tên</Select.Option>
                                <Select.Option value="email">Email</Select.Option>
                            </Select>
                        )} />

                    {/* Bảng danh sách tài khản */}
                    <Table rowKey={"id"} dataSource={usersTable} columns={columns} sortDirections={["descend"]}
                        loading={loading} bordered />
                </Space>
            </PageHeader>
        </Space>
    );
};

export default UserPage;
