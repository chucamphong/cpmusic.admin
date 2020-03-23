import { Avatar as AntdAvatar } from "antd";
import { AvatarProps } from "antd/es/avatar";
import React from "react";
import styled from "styled-components";

type Props = {
    cursor?: boolean;
} & AvatarProps;

const ForwardRefAvatar = React.forwardRef<AntdAvatar, Props>(({ cursor, ...rest }, ref) => {
    return <AntdAvatar {...rest} ref={ref} />;
});

const Avatar: React.FC<Props> = styled(ForwardRefAvatar)<Props>`
    cursor: ${props => props.cursor ? "pointer" : "auto"};
`;

export default Avatar;