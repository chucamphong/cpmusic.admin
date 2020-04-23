import { cleanup } from "@testing-library/react";
import renderPage, { loginWith, Role } from "tests/utils";

describe("Kiểm tra trang chủ", () => {
    beforeEach(async () => {
        const store = loginWith(Role.Moderator);
        await renderPage(store, "/");
    });

    afterEach(cleanup);

    test("Tiêu đề là \"Trang chủ\"", async () => {
        expect(document.title).toEqual("Trang chủ");
    });
});
