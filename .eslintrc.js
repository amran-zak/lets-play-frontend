module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'plugin:react/recommended',
        'standard-with-typescript'
    ],
    overrides: [
        {
            files: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
            rules: {
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/space-before-function-paren': 'off',
                '@typescript-eslint/no-misused-promises': 'off',
                '@typescript-eslint/return-await': 'off',
                '@typescript-eslint/func-call-spacing': 'off',
                indent: ['error', 4]
            }
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: [
        'react'
    ],
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/restrict-plus-operands': 'error',
        '@typescript-eslint/indent': ['error', 2],
        '@typescript-eslint/object-curly-spacing': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/no-confusing-void-expression': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        'multiline-ternary': 'off'
    }
}
