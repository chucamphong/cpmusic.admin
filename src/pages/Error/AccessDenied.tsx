import Error from "pages/Error/components/Error";
import React from "react";

const AccessDenied: React.FC = () => {
    return (
        <Error title={"Không thể truy cập"} message={"Bạn không có quyền truy cập"} />
    );
};

export default AccessDenied;
