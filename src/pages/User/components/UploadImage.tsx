import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Space, Typography, Upload } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { RcCustomRequestOptions } from "antd/es/upload/interface";
import React, { useState } from "react";
import UserService from "services/userService";

type Props = {
    defaultImage?: string;
    onSuccess?: (imageUrl: string) => void;
};

const UploadImage: React.FC<Props> = ({ defaultImage, onSuccess }) => {
    const userService = new UserService();
    const [loading, showLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState("");

    function upload(options: RcCustomRequestOptions) {
        const data = new FormData();
        data.append("file", options.file);

        return userService.uploadAvatar(data)
            .then(res => options.onSuccess(res.data, options.file))
            .catch(err => options.onError(err));
    }

    function handleUpload(info: UploadChangeParam) {
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
        <Upload customRequest={upload} onChange={handleUpload} showUploadList={false} listType="picture-card"
            accept=".jpeg,.png,.jpg">
            {hasImage && !loading ?
                <img src={currentImage || defaultImage} alt="Avatar" style={{ maxWidth: 84 }} /> :
                uploadButton
            }
        </Upload>
    );
};

export default UploadImage;
