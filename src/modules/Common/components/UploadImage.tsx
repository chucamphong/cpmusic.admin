import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Space, Typography, Upload } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { RcCustomRequestOptions } from "antd/es/upload/interface";
import { AxiosResponse } from "axios";
import React, { useState } from "react";

type Props = {
    upload: (formData: FormData) => Promise<AxiosResponse>;
    defaultImage?: string;
    onSuccess?: (imageUrl: string) => void;
};

const UploadImage: React.FC<Props> = ({ upload, defaultImage, onSuccess }) => {
    const [loading, showLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState("");

    function request(options: RcCustomRequestOptions) {
        const data = new FormData();
        data.append("file", options.file);

        return upload(data)
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
        <Upload customRequest={request} onChange={handleUpload} accept=".jpeg,.jpg,.png" listType="picture-card"
            showUploadList={false}>
            {hasImage && !loading ?
                <img src={currentImage || defaultImage} alt="Avatar" style={{ maxWidth: 84 }} /> :
                uploadButton
            }
        </Upload>
    );
};

export default UploadImage;
