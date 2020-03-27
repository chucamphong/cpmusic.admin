import styled from "styled-components";

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    opacity: 1;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
`;

export default Overlay;
