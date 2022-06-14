module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended'
    ],
    rules: {
        curly: 'error',
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-else-return': ['error', { allowElseIf: true }],
        'arrow-parens': 'off',
        'generator-star-spacing': 'off',
        semi: 'off',
        'prefer-const': 'error',
        'no-var': 'error',
        'linebreak-style': 'off'
    },
    parserOptions: {
        ecmaVersion: 2020
    }
}
