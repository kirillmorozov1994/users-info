const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env = {}) => {

    const { mode = 'development' } = env;

    const isProd = mode === 'production';
    const isDev = mode === 'development';

    const getStyleLoaders = () => {
        return [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader', 
            'sass-loader'
        ]
    }

    const getPlugins = () => {
        const plugins = [
            new HtmlWebpackPlugin({
                template: './index.html'
            })
        ];
        if(isProd) {
            plugins.push(
                new MiniCssExtractPlugin({
                    filename: 'css/main-[hash:4].css'
                }),
                new CleanWebpackPlugin()
            )
        }
        return plugins;
    }

    return {

        mode: isProd ? 'production' : isDev && 'development',

        context: path.resolve(__dirname, 'src'),

        entry: {
            main: './js/index.js'
        },

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: './js/[name]-[hash:4].js'
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: '/node-modules/',
                    use: ['babel-loader']

                },
                {
                    test: /\.scss$/,
                    use: getStyleLoaders()
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                publicPath: '../',
                                name: 'img/[name]-[hash:4].[ext]',
                            }
                        }
                    ]
                }
            ]
        },

        plugins: getPlugins(),

        devServer: {
            port: 3000,
            open: true
        }
    }
}