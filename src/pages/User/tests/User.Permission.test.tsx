import { SubjectRawRule } from "@casl/ability";
import { act, cleanup, render as reactRender } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import App from "modules/App/containers/App";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { RootState } from "store/types";
import { ThemeProvider } from "styled-components";
import mockStore, { mockState as state } from "tests/mocks/store";
import "tests/mocks/window.matchMedia";
import theme from "utils/theme";

describe("Kiểm tra phân quyền của phần quản lý tài khoản", () => {
    let store: RootState;

    afterEach(cleanup);

    /**
     * Render trang web theo url
     * @param store
     * @param url
     */
    async function render(store: ReturnType<typeof mockStore>, url: string) {
        await act(async () => {
            reactRender(
                <Provider store={store}>
                    <MemoryRouter initialEntries={[url]}>
                        <ThemeProvider theme={theme}>
                            <App />
                        </ThemeProvider>
                    </MemoryRouter>
                </Provider>,
            );
        });
    }

    function loginWith(role: string, permissions: SubjectRawRule<string, any, any>[] = []) {
        store = merge(cloneDeep(state), {
            auth: {
                user: { role, permissions },
            },
        });
    }

    async function renderPage(url: string) {
        await render(mockStore(store), url);
    }

    describe("Kiểm tra trang quản lý tài khoản", () => {
        test("Có thể truy cập trang quản lý tài khoản", async () => {
            loginWith("mod", [{
                action: "view",
                subject: "users",
            }]);

            await renderPage("/thanh-vien");

            expect(document.title).toEqual("Quản lý tài khoản");
        });

        test("Báo lỗi khi không có quyền truy cập vào trang quản lý tài khoản", async () => {
            loginWith("mod");

            await renderPage("/thanh-vien");

            expect(document.title).toEqual("Không thể truy cập");
        });
    });

    describe("Kiểm tra trang tạo tài khoản", () => {
        test("Truy cập trang tạo tài khoản", async () => {
            loginWith("mod", [{
                action: "create",
                subject: "users",
            }]);

            await renderPage("/thanh-vien/tao-tai-khoan");

            expect(document.title).toMatch(/Thêm tài khoản/i);
        });

        test("Báo lỗi khi không có quyền truy cập vào trang tạo tài khoản", async () => {
            loginWith("mod");

            await renderPage("/thanh-vien/tao-tai-khoan");

            expect(document.title).toEqual("Không thể truy cập");
        });
    });
});

