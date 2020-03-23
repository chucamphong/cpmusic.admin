import { memo } from "react";
import styled from "styled-components";

const Logo = styled.div`
    margin: 7px;
    font-size: 30px;
    text-align: center;
    color: white;
`;

// Chặn re-render component này vì nó không bao giờ thay đổi.
export default memo(Logo, () => true);