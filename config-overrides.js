const {
  fixBabelImports,
  override,
  addLessLoader,
  removeModuleScopePlugin,
  watchAll,
  addWebpackModuleRule,
  // eslint-disable-next-line import/no-extraneous-dependencies
} = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: { "@primary-color": "#2C3D4D" },
    },
  }),
  addWebpackModuleRule({
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: "graphql-tag/loader",
  }),
  removeModuleScopePlugin(),
  watchAll(),
);
