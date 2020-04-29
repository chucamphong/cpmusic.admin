import React from "react";
import { useParams } from "react-router-dom";

type ParamTypes = {
    id: string;
};

const EditSongPage: React.FC = () => {
    const params = useParams<ParamTypes>();

    return (
        <h1>ID: {params.id}</h1>
    );
};

export default EditSongPage;
