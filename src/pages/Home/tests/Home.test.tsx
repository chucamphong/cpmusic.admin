import { cleanup, render } from "@testing-library/react";
import App from "modules/App/containers/App";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import mockStore, { mockState as state } from "tests/mocks/store";
import theme from "utils/theme";

describe("Kiểm tra trang chủ", () => {
    const store = mockStore(state);

    beforeEach(() => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/"]}>
                    <ThemeProvider theme={theme}>
                        <App />
                    </ThemeProvider>
                </MemoryRouter>
            </Provider>,
        )
    });

    afterEach(cleanup);

    test("Tiêu đề là \"Trang chủ\"", () => {
        expect(document.title).toEqual("Trang chủ");
    });
});
