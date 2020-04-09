import Error from "pages/Error/components/Error";
import React from "react";

const NoMatch: React.FC = () => {
    return (
        <Error title="Không tìm thấy trang bạn yêu cầu" message="Không tìm thấy trang này" />
    );
};

export default NoMatch;
