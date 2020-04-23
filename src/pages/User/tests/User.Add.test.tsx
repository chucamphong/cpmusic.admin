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

describe("Kiểm tra trang tạo tài khoản", () => {
    afterEach(cleanup);

    async function render(store: ReturnType<typeof mockStore>) {
        await act(async () => {
            reactRender(
                <Provider store={store}>
                    <MemoryRouter initialEntries={["/thanh-vien/tao-tai-khoan"]}>
                        <ThemeProvider theme={theme}>
                            <App />
                        </ThemeProvider>
                    </MemoryRouter>
                </Provider>,
            );
        });
    }

    test("Hiện báo lỗi nếu tất cả các trường đều để trống", async () => {
        // await render()
    });
});

