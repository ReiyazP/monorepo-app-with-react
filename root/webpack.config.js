const path = require('path');

const HtmlWebPackPlugin = require("html-webpack-plugin");
const LiveReloadPlugin = require('webpack-livereload-plugin');
const ExternalTemplateRemotesPlugin = require('external-remotes-plugin');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  entry: './src/index',
  output: {
    publicPath: "auto",
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
    port: 3000,
    historyApiFallback: true,
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
      }
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "home",
      filename: "remoteEntry.js",
      remotes: {
        home: "home@http://localhost:3001/remoteEntry.js",
        contact: "contact@http://localhost:3002/remoteEntry.js",
        about: "about@http://localhost:3003/remoteEntry.js",

      },
      exposes: {
       
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
