const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const { ModuleFederationPlugin } = require("webpack").container;

const deps = require("./package.json").dependencies;
module.exports = {


    entry: { main: './src/index.js' },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: "http://localhost:8080/",
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: true,
        watchFiles: ["./public/*"],
        static: './dist',
        hot: true,
        port: 8080
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                use: [
                    { loader: "babel-loader" }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(css|s[ac]ss)$/i,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            {
                test: /\.html$/i,
                loader: 'html-loader'
            }]
    },

    plugins: [
        new ModuleFederationPlugin({
            name: "libs",
            filename: "remoteEntry.js",
            remotes: {

            },
            exposes: {
                './react': 'react',
                './react-dom': 'react-dom',
                './react-dom/client': 'react-dom/client',

            },
            shared: {
                ...deps,
                react: {
                    singleton: true,
                    requiredVersion: deps.react,
                },
                "react-dom": {
                    singleton: true,
                    requiredVersion: deps["react-dom"],
                },
            },
        }),
        new HtmlWebPackPlugin({
            template: 'public/index.html',
            title: 'Libs',
            inject: true,
        }),

    ],
};
