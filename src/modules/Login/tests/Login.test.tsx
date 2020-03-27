import puppeteer, { Browser, ChromeArgOptions, Page } from "puppeteer";

describe("Kiểm tra trang đăng nhập", () => {
    let browser: Browser;
    let page: Page;
    const options: ChromeArgOptions = {
        args: [
            "--disable-canvas-aa",
            "--disable-2d-canvas-clip-aa",
            "--disable-gl-drawing-for-tests",
            "--use-gl=swiftshader",
            "--enable-webgl",
            "--hide-scrollbars",
            "--mute-audio",
            "--no-first-run",
            "--disable-infobars",
            "--disable-breakpad",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--proxy-server='direct://'",
            "--proxy-bypass-list=*"
        ]
    };

    beforeAll(async () => {
        browser = await puppeteer.launch(options);
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto("http://localhost:3000", {
            waitUntil: "domcontentloaded"
        });
    });

    afterEach(async () => {
        await page.close();
    });

    afterAll(async () => {
        await browser.close();
    });

    async function getInnerText(className: string) {
        await page.waitForSelector(className, {
            visible: true
        });
        const element = await page.$(className);
        return await page.evaluate(e => e?.innerText, element);
    }

    /**
     * Thực hiện điền dữ liệu vào form và submit form
     * @param email
     * @param password
     */
    async function fillFormAndSubmit(email: string, password: string) {
        await page.type("#email", email);
        await page.type("#password", password);
        await page.click("button[type=submit]");
    }

    test.each([
        ["", "", "Địa chỉ email không được để trống.", "Mật khẩu không được để trống."],
        ["test", "test", "Địa chỉ email không hợp lệ.", "Mật khẩu tối thiểu có 8 ký tự."],
    ])("Báo lỗi khi email = \"%s\" và mật khẩu = \"%s\"", async (email, password, email_error, password_error) => {
        // Thực hiện nhập dữ liệu và nhấn nút đăng nhập
        await fillFormAndSubmit(email, password);

        // Chờ xuất hiện class ant-form-item-explain
        await page.waitForSelector(".ant-form-item-explain");
        // Sửa lỗi đôi khi trình duyệt không kịp render nên sẽ dẫn đến thiếu dòng báo lỗi của mật khẩu
        await page.waitForSelector(".ant-form-item-explain");

        // Lấy các div có class ant-form-item-explain
        const errors = await page.$$(".ant-form-item-explain");
        // Lấy dòng báo lỗi của email
        const emailError = await page.evaluate(e => e?.innerText, errors[0]);
        // Lấy dòng báo lỗi của password
        const passwordError = await page.evaluate(e => e?.innerText, errors[1]);

        // Xác nhận lại các dòng báo lỗi
        expect(emailError).toEqual(email_error);
        expect(passwordError).toEqual(password_error);
    });

    test("Hiện thông báo \"Dữ liệu không hợp lệ.\" khi đăng nhập thất bại", async () => {
        await fillFormAndSubmit("chucamphong1@gmail.com", "password1");

        const emailError = await getInnerText(".ant-form-item-explain");
        const message = await getInnerText(".ant-notification-notice-message");

        expect(emailError).toEqual("Không tìm thấy tài khoản trùng khớp.");
        expect(message).toEqual("Dữ liệu không hợp lệ.");
    });

    test("Hiện thông báo \"Đăng nhập thành công\" khi đăng nhập thành công", async () => {
        await fillFormAndSubmit("chucamphong@gmail.com", "password");

        const message = await getInnerText(".ant-notification-notice-message");
        expect(message).toEqual("Đăng nhập thành công");
    });
});
