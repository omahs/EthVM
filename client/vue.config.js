const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
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
        plugins: [
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser'
            })
        ],
        resolve: {
            fallback: {
                http: require.resolve('stream-http'),
                stream: require.resolve('stream-browserify')
            },
            alias: {
                '@': path.resolve(__dirname, 'src/'),
                '@module': path.resolve(__dirname, 'src/modules/'),
                '@view': path.resolve(__dirname, 'src/views/'),
                '@core': path.resolve(__dirname, 'src/core/')
            }
        }
    },
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                return {
                    ...options,
                    reactivityTransform: true
                }
            })
    }
})
