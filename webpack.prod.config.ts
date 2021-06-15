import path from "path";
import { merge } from "webpack-merge";
import common from "./webpack.common.config";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
//@ts-ignore
import TerserPlugin from "terser-webpack-plugin";
//@ts-ignore
import UglyfiJsPlugin from "uglifyjs-webpack-plugin";

const config = merge(common, {
  mode: "production",
  target: "web",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[contenthash].js",
    publicPath: ""
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  // devtool: "source-map"
});

export default config;
