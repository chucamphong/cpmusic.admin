import { Role } from "modules/Auth";
import renderPage, { loginWith } from "tests/helpers";
import { initialState } from "tests/mocks/store";

describe("Kiểm trang quản lý nghệ sĩ", () => {
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
