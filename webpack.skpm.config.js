const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { skpm } = require("./package.json");

const pluginResourcesPath = `${skpm.main}/Contents/Resources`;

module.exports = function(config, isPluginCommand) {
  config.plugins.push(new webpack.EnvironmentPlugin(["ENV"]));
  config.plugins.push(
    new CopyWebpackPlugin([
      {
        from: path.resolve("./resources/icon.png"),
        to: path.resolve(pluginResourcesPath)
      }
    ])
  );
  config.module.rules.push({
    test: /\.(html)$/,
    use: [
      {
        loader: "@skpm/extract-loader"
      },
      {
        loader: "html-loader",
        options: {
          attrs: ["img:src", "link:href"],
          interpolate: true
        }
      }
    ]
  });
  config.module.rules.push({
    test: /\.(css)$/,
    use: [
      {
        loader: "@skpm/extract-loader"
      },
      {
        loader: "css-loader"
      }
    ]
  });
};
