const { so1ve } = require("@so1ve/eslint-config");

module.exports = so1ve({
    typescript: true,
    vue: true,
    solid: false,
    jsonc: false,
    yaml: false,

    // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
    ignores: [],
});