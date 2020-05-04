import { Role } from "modules/Auth";
import { initialState } from "tests/mocks/store";
import "tests/mocks/window.matchMedia";
import renderPage, { loginWith } from "tests/helpers";

describe("Kiểm tra AppContainer", () => {
    test("Dẫn đến trang đăng nhập nếu chưa đăng nhập", async () => {
        await renderPage(initialState);

        expect(document.title).toEqual("Đăng nhập");
    });

    test("Dẫn đến trang chủ nếu đã đăng nhập (Phải có quyền quản trị)", async () => {
        const store = loginWith(Role.Moderator);

        await renderPage(store);

        expect(document.title).toEqual("Trang chủ");
    });

    test("Bắt lỗi không có quyền truy cập nếu tài khoản không có quyền quản lý", async () => {
        const store = loginWith(Role.Member);

        await renderPage(store);

        expect(document.title).toEqual("Không thể truy cập");
    });

    test("Nhập url /thanh-vien và dẫn ra chính xác url đó", async () => {
        const store = loginWith(Role.Moderator, [{
            action: "view",
            subject: "users",
        }]);

        await renderPage(store, "/thanh-vien");

        expect(document.title).toEqual("Quản lý tài khoản");
    });

    test("Nhập link bậy bạ sẽ hiện trang không tìm thấy url", async () => {
        const store = loginWith(Role.Member);
        await renderPage(store, "/abcxyz");

        expect(document.title).toEqual("Không tìm thấy trang bạn yêu cầu");
    });
});

