import { cleanup, render as reactRender } from "@testing-library/react";
import App from "modules/App/containers/App";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore, { MockStoreEnhanced } from "redux-mock-store";
import { RootState } from "store/types";
import { ThemeProvider } from "styled-components";
import "tests/mocks/window.matchMedia";
import theme from "utils/theme";
import state from "./faker/state";

const initialState: RootState = {
    auth: {},
    loading: { status: "nothing" },
};
const mockStore = (state: RootState = initialState) => configureStore<RootState>()(state);

describe("Kiểm tra AppContainer", () => {
    function render(store: MockStoreEnhanced, url: string = "/") {
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

    test("Nhập url /users và dẫn ra chính xác url đó", async () => {
        render(mockStore(state), "/users");

        expect(document.title).toMatch(/Quản lý thành viên/i);
    });
});

