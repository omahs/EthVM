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
                https: require.resolve('https-browserify'),
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                os: require.resolve('os-browserify/browser'),
                url: require.resolve('url'),
                assert: require.resolve('assert')
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
