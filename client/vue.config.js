const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
    transpileDependencies: true,
    pluginOptions: {
        vuetify: {
            // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
        }
    },
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.graphql$/,
                    use: 'graphql-tag/loader'
                }
            ]
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src/'),
                '@module': path.resolve(__dirname, 'src/modules/'),
                '@view': path.resolve(__dirname, 'src/views/'),
                '@core': path.resolve(__dirname, 'src/core/')
            }
        }
    }
})
