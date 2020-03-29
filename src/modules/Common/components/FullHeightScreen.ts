import styled from "styled-components";

const FullHeightScreen = styled.div`
    > :first-child {
        // noinspection CssInvalidPropertyValue
        min-height: stretch;
        
        // Lỗi: Khi sử dụng trên các trình duyệt chrome hay safari trên điện thoại thì 100vh không còn chạy đúng
        // min-height: 100vh;
    }
`;

export default FullHeightScreen;
