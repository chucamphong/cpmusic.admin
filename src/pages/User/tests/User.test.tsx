import { act, cleanup, render as reactRender } from "@testing-library/react";
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

describe("Kiểm tra trang quản lý thành viên", () => {
    async function render(store: ReturnType<typeof mockStore>) {
        await act(async () => {
            reactRender(
                <Provider store={store}>
                    <MemoryRouter initialEntries={["/thanh-vien"]}>
                        <ThemeProvider theme={theme}>
                            <App />
                        </ThemeProvider>
                    </MemoryRouter>
                </Provider>,
            );
        });
    }

    afterEach(cleanup);

    test("Truy cập trang quản lý thành viên", async () => {
        const store = merge(cloneDeep(state), {
            auth: {
                user: {
                    role: "mod",
                    permissions: [{
                        action: "view",
                        subject: "users",
                    }],
                },
            },
        });

        await render(mockStore(store));

        expect(document.title).toMatch(/Quản lý thành viên/i);
    });

    test("Báo lỗi khi không có quyền truy cập vào trang quản lý thành viên", async () => {
        await render(mockStore(state));

        expect(document.title).toEqual("Không thể truy cập");
    });
});

