import { Spin } from "antd";
import { useLoading } from "modules/Loading";
import React from "react";
import Background from "../components/Background";

const LoadingContainer = () => {
    const loading = useLoading();

    return loading.isLoading() ? (
        <Background>
            <Spin size="large"/>
        </Background>
    ) : null;
};

export default LoadingContainer;