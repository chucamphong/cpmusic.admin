import "tests/mocks/window.matchMedia";
import renderPage, { loginWith, Role } from "tests/utils";

describe("Kiểm tra phân quyền của phần quản lý tài khoản", () => {
    describe("Kiểm tra trang quản lý tài khoản", () => {
        test("Có thể truy cập trang quản lý tài khoản", async () => {
            const store = loginWith(Role.Moderator, [{
                action: "view",
                subject: "users",
            }]);

            await renderPage(store, "/thanh-vien");

            expect(document.title).toEqual("Quản lý tài khoản");
        });

        test("Báo lỗi khi không có quyền truy cập vào trang quản lý tài khoản", async () => {
            const store = loginWith(Role.Moderator);

            await renderPage(store, "/thanh-vien");

            expect(document.title).toEqual("Không thể truy cập");
        });
    });

    describe("Kiểm tra trang tạo tài khoản", () => {
        test("Truy cập trang tạo tài khoản", async () => {
            const store = loginWith(Role.Moderator, [{
                action: "create",
                subject: "users",
            }]);

            await renderPage(store, "/thanh-vien/tao-tai-khoan");

            expect(document.title).toMatch(/Thêm tài khoản/i);
        });

        test("Báo lỗi khi không có quyền truy cập vào trang tạo tài khoản", async () => {
            const store = loginWith(Role.Moderator);

            await renderPage(store, "/thanh-vien/tao-tai-khoan");

            expect(document.title).toEqual("Không thể truy cập");
        });
    });
});

