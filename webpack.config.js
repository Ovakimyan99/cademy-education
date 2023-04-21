const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = true

module.exports = {
    entry: './src/index.js',
    devtool: 'inline-source-map',
    output: {
        filename: isDev ? '[name].js' : '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: !isDev,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
            template: './index.html',
            inject: 'body'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        alias: {
            Router: path.resolve(__dirname, './src/core/Router'),
            Page: path.resolve(__dirname, './src/core/Page'),
            Core: path.resolve(__dirname, './src/core/'),
            Components: path.resolve(__dirname, './src/component/'),
        },
    },
    devServer: {
        static: './dist',
        port: 3000,
        watchFiles: ['src/**/*'],
    },
};
