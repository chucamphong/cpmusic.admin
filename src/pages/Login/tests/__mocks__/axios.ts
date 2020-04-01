import { AxiosError, AxiosResponse, AxiosStatic } from "pages/Login/tests/__mocks__/axios";
import { Credentials, LoginFailedResponse, LoginResponse, User } from "modules/Auth";

const Axios: jest.Mocked<AxiosStatic> = jest.genMockFromModule("axios");

/**
 * Giả lập hàm create của axios
 */
Axios.create = jest.fn(() => Axios);

/**
 * Giả lập kết quả trả về của api /users/me
 */
Axios.get.mockResolvedValue({
    data: {
        id: 1,
        name: "Chu Cẩm Phong",
        email: "chucamphong@gmail.com",
        email_verified_at: "2020-03-27T02:11:48.000000Z",
        role: "admin",
        permissions: [
            { "actions": "view", "subject": "me" },
            { "actions": "update", "subject": "me" },
            { "actions": "create", "subject": "users" },
            { "actions": "view", "subject": "users" },
            { "actions": "update", "subject": "users" },
            { "actions": "update", "subject": "users" },
            { "actions": "delete", "subject": "users" },
        ],
    },
} as AxiosResponse<User>);

/**
 * Giả lập kết quả trả về của /login
 */
Axios.post.mockImplementation((_, data: Credentials) => {
    const validate = (credentials: Credentials) => {
        const { email, password } = credentials;
        return email === "chucamphong@gmail.com" && password === "password";
    };

    // Đăng nhập thành công
    if (validate(data)) {
        return Promise.resolve({
            data: {
                plainTextToken: "abc",
            },
        } as Pick<AxiosResponse<LoginResponse>, "data">);
    }

    // Đăng nhập thất bại
    return Promise.reject({
        response: {
            data: {
                message: "Dữ liệu không hợp lệ.",
                errors: {
                    email: ["Không tìm thấy tài khoản trùng khớp."],
                },
            },
        },
    } as unknown as Pick<AxiosError<LoginFailedResponse>, "response">);
});

export default Axios;
