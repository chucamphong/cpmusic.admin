import { render } from "@testing-library/react";
import App from "modules/App/containers/App";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { RootState } from "store/types";
import { ThemeProvider } from "styled-components";
import theme from "utils/theme";
import data from "./mocks/data";
import "./mocks/window.matchMedia";

const initialState: RootState = {
    auth: {},
    loading: { status: "nothing" }
};
const mockStore = (state: RootState = initialState) => configureStore()(state);

describe("Kiểm tra AppContainer", () => {

    test("Dẫn đến trang đăng nhập nếu chưa đăng nhập", () => {
        render(
            <Provider store={mockStore()}>
                <MemoryRouter>
                    <App />
                </MemoryRouter>
            </Provider>
        );

        expect(document.title).toEqual("Đăng nhập");
    });

    test("Dẫn đến trang chủ nếu đã đăng nhập (Phải có quyền quản trị)", () => {
        render(
            <Provider store={mockStore(data)}>
                <MemoryRouter>
                    <ThemeProvider theme={theme}>
                        <App />
                    </ThemeProvider>
                </MemoryRouter>
            </Provider>
        );

        expect(document.title).toEqual("Trang chủ");
    });

    test("Bắt đăng nhập lại nếu tài khoản không có quyền quản lý", () => {
        render(
            // @ts-ignore
            <Provider store={mockStore({ ...data, auth: { user: { role: "member" } } })}>
                <MemoryRouter>
                    <ThemeProvider theme={theme}>
                        <App />
                    </ThemeProvider>
                </MemoryRouter>
            </Provider>
        );

        expect(document.title).toEqual("Đăng nhập");
    });
});

