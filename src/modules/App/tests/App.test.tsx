import { cleanup, render as reactRender } from "@testing-library/react";
import { cloneDeep, merge } from "lodash";
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
        const store = mockStore(merge(cloneDeep(state), {
            auth: {
                user: {
                    role: "mod",
                },
            },
        }));

        render(store);

        expect(document.title).toEqual("Trang chủ");
    });

    test("Bắt lỗi không có quyền truy cập nếu tài khoản không có quyền quản lý", () => {
        const store = mockStore(merge(cloneDeep(state), {
            auth: {
                user: {
                    role: "member",
                },
            },
        }));

        render(store);

        expect(document.title).toEqual("Không thể truy cập");
    });

    test("Nhập url /thanh-vien và dẫn ra chính xác url đó", () => {
        const store = mockStore(merge(cloneDeep(state), {
            auth: {
                user: {
                    role: "mod",
                    permissions: [{
                        actions: "view",
                        subject: "users",
                    }],
                },
            },
        }));

        render(store, "/thanh-vien");

        expect(document.title).toMatch(/Quản lý thành viên/i);
    });

    test("Nhập link bậy bạ sẽ hiện trang không tìm thấy url", () => {
        render(mockStore(state), "/abcxyz");

        expect(document.title).toEqual("Không tìm thấy trang bạn yêu cầu");
    });
});

