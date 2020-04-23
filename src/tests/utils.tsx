import { SubjectRawRule } from "@casl/ability";
import { act, render as reactRender } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import App from "modules/App/containers/App";
import { Role } from "modules/Auth";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { RootState } from "store/types";
import { ThemeProvider } from "styled-components";
import mockStore, { mockState as state } from "tests/mocks/store";
import theme from "utils/theme";

async function render(store: ReturnType<typeof mockStore>, url: string) {
    await act(async () => {
        reactRender(
            <Provider store={store}>
                <MemoryRouter initialEntries={[url]}>
                    <ThemeProvider theme={theme}>
                        <App />
                    </ThemeProvider>
                </MemoryRouter>
            </Provider>,
        );
    });
}

async function renderPage(store: RootState, url: string = "/") {
    await render(mockStore(store), url);
}

export function loginWith(role: Role, permissions: SubjectRawRule<string, any, any>[] = []) {
    return merge(cloneDeep(state), {
        auth: {
            user: { role, permissions },
        },
    });
}

export default renderPage;
