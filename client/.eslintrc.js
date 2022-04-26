module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['../.eslintrc.js', 'plugin:vue/vue3-essential', '@vue/typescript/recommended'],
    rules: {
        'vue/no-unused-vars': 'error',
        'vue/require-default-prop': 'off',
        'vue/custom-event-name-casing': 'off'
        // 'graphql/template-strings': [
        //     'error',
        //     {
        //         env: 'apollo',
        //         schemaJson: require('./src/apollo/schemas/api.json')
        //         // tagName is gql by default
        //     }
        // ]
    },
    parserOptions: {
        ecmaVersion: 2020
    }
}
