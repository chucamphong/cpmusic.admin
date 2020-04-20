import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Space, Typography, Upload } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { RcCustomRequestOptions } from "antd/es/upload/interface";
import React, { useState } from "react";
import usersService from "services/usersService";
import styled from "styled-components";

type Props = {
    defaultImage?: string;
    onSuccess?: (imageUrl: string) => void;
};

const StyledImage = styled.img`
    max-width: 84px;
`;

const UploadImage: React.FC<Props> = ({ defaultImage, onSuccess }) => {
    const [loading, showLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState("");

    function uploadAvatar(options: RcCustomRequestOptions) {
        const data = new FormData();
        data.append("file", options.file);

        return usersService.uploadAvatar(data)
            .then(res => options.onSuccess(res.data, options.file))
            .catch(err => options.onError(err));
    }

    function handleUploadAvatar(info: UploadChangeParam) {
        if (info.file.status === "uploading") {
            showLoading(true);
        }

        if (info.file.status === "done") {
            showLoading(false);

            let url = Object.values(info.file.response).join("");
            setCurrentImage(url);
            onSuccess?.(url);
        }
    }

    const uploadButton = (
        <Space direction="vertical">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <Typography.Text>Tải Lên</Typography.Text>
        </Space>
    );

    const hasImage: boolean = !!currentImage || !!defaultImage;

    return (
        <Upload customRequest={uploadAvatar} onChange={handleUploadAvatar} showUploadList={false}
            listType="picture-card" accept=".jpeg,.png,.jpg">
            {hasImage && !loading ?
                <StyledImage src={currentImage || defaultImage} alt="Avatar" /> :
                uploadButton
            }
        </Upload>
    );
};

export default UploadImage;
