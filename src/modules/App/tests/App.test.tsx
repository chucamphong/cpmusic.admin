import { cleanup, render as reactRender } from "@testing-library/react";
import App from "modules/App/containers/App";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import mockStore, { mockState as state } from "tests/mocks/store";
import "tests/mocks/window.matchMedia";
import theme from "utils/theme";

describe("Kiểm tra AppContainer", () => {
    function render(store: ReturnType<typeof mockStore>, url: string = "/") {
        reactRender(
            <Provider store={store}>
                <MemoryRouter initialEntries={[url]}>
                    <ThemeProvider theme={theme}>
                        <App />
                    </ThemeProvider>
                </MemoryRouter>
            </Provider>,
        );
    }

    afterEach(cleanup);

    test("Dẫn đến trang đăng nhập nếu chưa đăng nhập", () => {
        render(mockStore());

        expect(document.title).toEqual("Đăng nhập");
    });

    test("Dẫn đến trang chủ nếu đã đăng nhập (Phải có quyền quản trị)", () => {
        render(mockStore(state));

        expect(document.title).toEqual("Trang chủ");
    });

    test("Bắt đăng nhập lại nếu tài khoản không có quyền quản lý", () => {
        const store = mockStore({
            ...state,
            auth: {
                // @ts-ignore
                user: {
                    role: "member",
                },
            },
        });

        render(store);

        expect(document.title).toEqual("Đăng nhập");
    });

    test("Nhập url /users và dẫn ra chính xác url đó", () => {
        render(mockStore(state), "/thanh-vien");

        expect(document.title).toMatch(/Quản lý thành viên/i);
    });

    test("Nhập link bậy bạ sẽ hiện trang không tìm thấy url", () => {
        render(mockStore(state), "/abcxyz");

        expect(document.title).toEqual("Không tìm thấy trang bạn yêu cầu");
    });
});

