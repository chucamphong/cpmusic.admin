import React, { useEffect } from "react";

const User = () => {
    useEffect(() => {
        document.title = "Quản lý thành viên";
    }, []);

    return (
        <h1>User Container</h1>
    );
};

export default User;
