import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        layout: {
            xs: string,
            sm: string,
            md: string,
            lg: string,
            xl: string,
            xxl: string
        },
        sider: {
            width: string,
        },
        content: {
            margin: stirng,
        }
    }
}
