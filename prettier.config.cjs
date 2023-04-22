/** @type {import("prettier").Config} */
const config = {
    plugins: [require.resolve("prettier-plugin-tailwindcss")],
    semi: true,
    trailingComma: "all",
    tabWidth: 4,
};

module.exports = config;
