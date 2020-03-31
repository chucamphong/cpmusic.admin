import { cleanup, render, screen } from "@testing-library/react";
import ErrorPage from "modules/Error/containers/Error";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "utils/theme";

describe("Kiểm tra trang báo lỗi", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <ErrorPage />
                </ThemeProvider>
            </MemoryRouter>,
        );
    });

    afterEach(cleanup);

    test("Kiểm tra tiêu đề trang báo lỗi", () => {
        expect(document.title).toEqual("Không tìm thấy trang bạn yêu cầu");
    });

    test("Hiện thông báo \"Không tìm thấy trang này\"", () => {
        const message = screen.getByText("Không tìm thấy trang này", { selector: "h1" });

        expect(message).toBeInTheDocument();
    });

    test("Có nút nhấn \"Quay về trang chủ\"", () => {
        const link = screen.getByText("Quay về trang chủ", { selector: "a" });

        expect(link).toBeInTheDocument();
    });
});
