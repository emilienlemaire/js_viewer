import path from "path";
import { merge } from "webpack-merge";
import common from "./webpack.common.config";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
//@ts-ignore
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const config = merge(common, {
  mode: "production",
  target: "web",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[contenthash].js",
    publicPath: "",
  },
  resolve: {
    alias: {
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin(),
  ],
});

export default config;
