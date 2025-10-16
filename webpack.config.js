const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const Dotenv = require("dotenv-webpack"); // Using dotenv-webpack for environment variables
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // For extracting CSS in production

const prod = process.env.NODE_ENV === "production";

module.exports = {
  // Mode should be at the top level, good as is
  mode: prod ? "production" : "development",
  // devtool should also be at the top level
  devtool: prod ? "source-map" : "eval-cheap-module-source-map",

  output: {
    filename: prod ? "bundle.[contenthash].js" : "bundle.js",
    path: path.resolve(__dirname, "dist"), // Ensure path.resolve uses __dirname
    publicPath: "/",
    clean: true,
  },

  resolve: { extensions: [".js", ".jsx"] },

  devServer: {
    hot: true,
    historyApiFallback: true,
    port: 3002,
  },

  module: {
    rules: [
      // JavaScript and JSX
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: [
              ["@babel/preset-env", { targets: "defaults" }],
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
            // Ensure plugins array is correctly formed and filters boolean
            plugins: [!prod && require.resolve("react-refresh/babel")].filter(
              Boolean
            ),
          },
        },
      },
      // Plain CSS
      {
        test: /\.css$/i,
        use: [
          // Use MiniCssExtractPlugin.loader in production, style-loader in development
          prod ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1, // Crucial: tells css-loader to process @import with postcss-loader
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      // SCSS (optional later)
      {
        test: /\.scss$/i,
        use: [
          // Use MiniCssExtractPlugin.loader in production, style-loader in development
          prod ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2, // 2 because sass-loader and postcss-loader will run before css-loader
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader", // Add postcss-loader for SCSS as well, if you want Tailwind/PostCSS on SCSS
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      // Images and assets
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource", // 'asset' allows Webpack to choose, 'asset/resource' always emits a separate file
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({ template: "public/index.html" }),
    // Only add ReactRefreshWebpackPlugin in development
    !prod && new ReactRefreshWebpackPlugin(),
    // Only add Dotenv in development if you're not using DefinePlugin for specific env vars
    // If you're using DefinePlugin for specific process.env variables, Dotenv might not be strictly necessary here,
    // but it's good for loading all .env variables for `process.env`.
    !prod && new Dotenv(),
    // MiniCssExtractPlugin for production CSS extraction
    prod &&
      new MiniCssExtractPlugin({
        filename: "styles.[contenthash].css",
        chunkFilename: "styles.[contenthash].css",
      }),
    new webpack.DefinePlugin({
      // Ensure these environment variables are correctly accessed and stringified
      "process.env.REACT_APP_AWS_REGION": JSON.stringify(
        process.env.REACT_APP_AWS_REGION
      ),
      "process.env.REACT_APP_AWS_ACCESS_KEY": JSON.stringify(
        process.env.REACT_APP_AWS_ACCESS_KEY
      ),
      "process.env.REACT_APP_AWS_SECRET_ACCESS_KEY": JSON.stringify(
        process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
      ),
      // It's good practice to also define NODE_ENV
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    }),
  ].filter(Boolean), // Filter out any falsey values for plugins

  performance: { hints: false },
};