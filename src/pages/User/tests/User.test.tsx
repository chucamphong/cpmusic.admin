import { cleanup, render as reactRender } from "@testing-library/react";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";
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

    test("Truy cập trang quản lý thành viên", () => {
        const store = merge(cloneDeep(state), {
            auth: {
                user: {
                    role: "mod",
                    permissions: [{
                        actions: "view",
                        subject: "users",
                    }],
                },
            },
        });

        render(mockStore(store), "/thanh-vien");

        expect(document.title).toMatch(/Quản lý thành viên/i);
    });

    test("Báo lỗi khi không có quyền truy cập vào trang quản lý thành viên", () => {
        console.log(state);
        render(mockStore(state), "/thanh-vien");

        expect(document.title).toEqual("Không thể truy cập");
    });
});

