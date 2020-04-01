import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Input, PageHeader } from "antd";
import React, { Fragment, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

const User = () => {
    const history = useHistory();
    const goBack = () => history.goBack();

    useEffect(() => {
        document.title = "Quản lý thành viên";
    }, []);

    return (
        <Fragment>
            <Breadcrumb style={{ marginBottom: 8 }}>
                <Breadcrumb.Item>
                    <Link to={"/"}>Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Thành viên</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader title="Thành Viên" subTitle={"Thực hiện các chỉnh sửa đối với thành viên."}
                onBack={goBack} extra={[
                    <Button key="refresh" icon={<ReloadOutlined />}>Tải lại</Button>,
                    <Button key="create" type="primary" icon={<PlusOutlined />}>Thêm</Button>,
                ]} style={{ padding: 0 }}>
                <Input.Search />
            </PageHeader>
        </Fragment>
    );
};

export default User;
