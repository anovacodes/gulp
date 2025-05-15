export default [
    {
        files: ["**/*.js"],
        ignores: ["dist/**/*.js"],
        rules: {
            "no-unused-vars": "warn",
            "no-console": "warn",
            "prefer-const": "warn",
            "prefer-arrow-callback": "warn",
            quotes: ["warn", "double"],
            "no-constant-binary-expression": "error",
            "comma-dangle": ["warn", "never"],
            semi: ["warn", "never"],
            indent: ["warn", 4],
            "max-len": ["warn", { code: 120 }]
        }
    }
]
