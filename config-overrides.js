const { override, fixBabelImports, addLessLoader, useEslintRc } = require("customize-cra");
const darkThemeVars = require("antd/dist/dark-theme");

module.exports = override(
    fixBabelImports("import", {
        libraryName: "antd",
        libraryDirectory: "es",
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            "hack": `true; @import "${require.resolve("antd/lib/style/color/colorPalette.less")}";`,
            ...darkThemeVars,
            // Colors
            "@primary-color": "#09b87f",
            // "@primary-color": "#87b0f2",
            "@error-color": "#c71c56",
            "@black": "#1f1f23",
            // Base Scaffolding Variables
            "@popover-background": "#303135",
            "@icon-color": "#e8e9ed",
        },
    }),
    useEslintRc()
);