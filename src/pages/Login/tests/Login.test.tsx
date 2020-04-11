import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "modules/App/containers/App";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import store from "store/store";
import { ThemeProvider } from "styled-components";
import { noop } from "utils/helpers";
import theme from "utils/theme";

const change = (element: Element | Node | Document | Window, value: string) => {
    fireEvent.change(element, { target: { value } });
};

const getInputEmail = () => screen.getByPlaceholderText("Nhập địa chỉ email của bạn");

const getInputPassword = () => screen.getByPlaceholderText("Nhập mật khẩu của bạn");

const submitForm = () => fireEvent.click(screen.getByRole("button"));

describe("Kiểm tra trang đăng nhập", () => {
    beforeAll(() => {
        jest.spyOn(console, "warn").mockImplementation(noop);
    });

    beforeEach(() => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ThemeProvider theme={theme}>
                        <App />
                    </ThemeProvider>
                </MemoryRouter>
            </Provider>,
        );
    });

    afterEach(cleanup);

    afterAll(() => {
        jest.clearAllMocks();
    });

    test("Báo lỗi nếu địa chỉ email để trống.", async () => {
        submitForm();

        const error = await screen.findByText("Địa chỉ email không được để trống");

        expect(error).toBeInTheDocument();
    });

    test("Báo lỗi nếu mật khẩu để trống.", async () => {
        submitForm();

        const error = await screen.findByText("Mật khẩu không được để trống");

        expect(error).toBeInTheDocument();
    });

    test("Báo lỗi nếu địa chỉ email và mật khẩu để trống", async () => {
        submitForm();

        const emailError = await screen.findByText("Địa chỉ email không được để trống");
        const passwordError = await screen.findByText("Mật khẩu không được để trống");

        expect(emailError).toBeInTheDocument();
        expect(passwordError).toBeInTheDocument();
    });

    test.each([
        ["abc.@gmail.com"],
        ["xyz@gmail!com"],
    ])("Báo lỗi nếu địa chỉ email %s không hợp lệ", async (email) => {
        change(getInputEmail(), email);

        const error = await screen.findByText("Địa chỉ email không hợp lệ");

        expect(error).toBeInTheDocument();
    });

    test.each([
        ["1234567"],
        ["0123456"],
        ["►¶0♫♫♫"],
    ])("Báo lỗi nếu mật khẩu %s không hợp lệ", async (password) => {
        change(getInputPassword(), password);

        const error = await screen.findByText("Mật khẩu tối thiểu có 8 ký tự");

        expect(error).toBeInTheDocument();
    });

    test("Hiện thông báo \"Dữ liệu không hợp lệ\" nếu đăng nhập thất bại", async () => {
        change(getInputEmail(), "abc@gmail.com");
        change(getInputPassword(), "password");
        submitForm();

        const error = await screen.findByText("Không tìm thấy tài khoản trùng khớp.");
        const message = await screen.findByText("Dữ liệu không hợp lệ.");

        expect(error).toBeInTheDocument();
        expect(message).toBeInTheDocument();
    });

    test("Hiện thông báo \"Đăng nhập thành công\" nếu đăng nhập thành công", async () => {
        change(getInputEmail(), "admin@gmail.com");
        change(getInputPassword(), "password");
        submitForm();

        const message = await screen.findByText("Đăng nhập thành công");

        expect(message).toBeInTheDocument();
    });
});
