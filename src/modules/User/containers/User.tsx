import React, { useEffect } from "react";

const User = () => {
    useEffect(() => {
        document.title = "Quản Lý Thành Viên";
    });

    return (
        <h1>User Container</h1>
    );
};

export default User;
