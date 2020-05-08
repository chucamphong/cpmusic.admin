import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Space, Typography, Upload } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { RcCustomRequestOptions } from "antd/es/upload/interface";
import { AxiosResponse } from "axios";
import React, { useState } from "react";

type Props = {
    upload: (formData: FormData) => Promise<AxiosResponse>;
    onSuccess?: (songUrl: string) => void;
};

const UploadSong: React.FC<Props> = ({ upload, onSuccess }) => {
    const [loading, showLoading] = useState(false);
    const [currentSong, setCurrentSong] = useState("");

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
            setCurrentSong(url);
            onSuccess?.(url);
        }
    }

    const uploadButton = (
        <Space direction="vertical">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <Typography.Text>Tải Lên</Typography.Text>
        </Space>
    );

    const hasSong: boolean = !!currentSong;

    return (
        <Upload.Dragger multiple={false} customRequest={request} onChange={handleUpload} accept="audio/mpeg" listType="text"
            showUploadList={false}>
            {hasSong && !loading ?
                <span>Tải bài hát lên thành công</span> :
                uploadButton
            }
        </Upload.Dragger>
    );
};

export default UploadSong;
