const { override, fixBabelImports, addLessLoader, useEslintRc, useBabelRc } = require("customize-cra");
const { getThemeVariables } = require("antd/dist/theme");

module.exports = override(
    fixBabelImports("import", {
        libraryName: "antd",
        libraryDirectory: "es",
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            ...getThemeVariables({
                dark: true,
            }),
            "@primary-color": "#09b87f",
            // "@primary-color": "#87b0f2",
            "@error-color": "#c71c56",
            "@black": "#1f1f23",
            // Base Scaffolding Variables
            "@popover-background": "#303135",
            "@icon-color": "#e8e9ed",
            "@select-item-selected-bg": "@primary-color",
            "@page-header-padding": 0,
        },
    }),
    useEslintRc(),
    useBabelRc(),
);
