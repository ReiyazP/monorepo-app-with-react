const path = require('path');

const HtmlWebPackPlugin = require("html-webpack-plugin");
const LiveReloadPlugin = require('webpack-livereload-plugin');
const ExternalTemplateRemotesPlugin = require('external-remotes-plugin');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;
module.exports = {
  entry: './src/index',
  output: {
    publicPath: "http://localhost:3003/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devtool: 'source-map',
  optimization: {
    minimize: false,
  },
  devServer: {
    hot: false,
    static: path.join(__dirname, 'dist'),
    port: 3003,
    historyApiFallback: {
      index: 'index.html',
    },
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "about",
      filename: "remoteEntry.js",
      remotes: {
        libs: "libs@http://localhost:8080/remoteEntry.js",
      },
      exposes: {
        "./base": "./src/base.js"
      },
      shared: {
        react: {
          singleton: true,
        },
        "react-dom": {
          singleton: true,
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "public/index.html",
    }),
    new ExternalTemplateRemotesPlugin(),
    new LiveReloadPlugin({
    }),
  ],
};
