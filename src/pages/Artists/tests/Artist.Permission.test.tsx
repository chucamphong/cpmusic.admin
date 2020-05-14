import { Role } from "modules/Auth";
import renderPage, { loginWith } from "tests/helpers";
import { initialState } from "tests/mocks/store";

describe("Kiểm tra phân quyền trang quản lý nghệ sĩ", () => {
    describe("Trang quản lý nghệ sĩ", () => {
        test("Bắt đăng nhập nếu chưa đăng nhập", async () => {
            await renderPage(initialState, "/nghe-si");

            expect(document.title).toEqual("Đăng nhập");
        });

        test("Có thể truy cập trang quản lý nghệ sĩ", async () => {
            const store = loginWith(Role.Moderator, [{
                action: "view",
                subject: "artists",
            }]);

            await renderPage(store, "/nghe-si");

            expect(document.title).toEqual("Quản lý nghệ sĩ");
        });

        test("Báo lỗi khi không có quyền truy cập vào trang quản lý nghệ sĩ", async () => {
            const store = loginWith(Role.Moderator);

            await renderPage(store, "/nghe-si");

            expect(document.title).toEqual("Không thể truy cập");
        });
    });

    describe("Trang chỉnh sửa nghệ sĩ", () => {
        test("Bắt đăng nhập nếu chưa đăng nhập", async () => {
            await renderPage(initialState, "/nghe-si/24");

            expect(document.title).toEqual("Đăng nhập");
        });

        test("Có thể truy cập trang chỉnh sửa nghệ sĩ", async () => {
            const store = loginWith(Role.Moderator, [{
                action: "update",
                subject: "artists",
            }]);

            await renderPage(store, "/nghe-si/24");

            expect(document.title).toEqual("Chỉnh sửa nghệ sĩ");
        });

        test("Báo lỗi khi không có quyền truy cập vào trang quản lý nghệ sĩ", async () => {
            const store = loginWith(Role.Moderator);

            await renderPage(store, "/nghe-si/24");

            expect(document.title).toEqual("Không thể truy cập");
        });
    });
});
