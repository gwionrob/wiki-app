// jest.config.mjs
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
    // Add more setup options before each test is run
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

    testEnvironment: "jest-environment-jsdom",
    moduleNameMapper: {
        "next/router": "<rootDir>/__mocks__/next/router.js",
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
        "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$":
            "<rootDir>/__mocks__/file-mock.js",
        "react-markdown":
            "<rootDir>/node_modules/react-markdown/react-markdown.min.js",
    },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
