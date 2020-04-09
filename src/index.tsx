import { ConfigProvider } from "antd";
import vi from "antd/es/locale/vi_VN";
import AppContainer from "modules/App/containers/App";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "store/store";
import { ThemeProvider } from "styled-components";
import myTheme from "utils/theme";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <ThemeProvider theme={myTheme}>
                <ConfigProvider locale={vi} componentSize={"middle"} space={{ size: "middle" }}>
                    <AppContainer />
                </ConfigProvider>
            </ThemeProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
