/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  browserBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  devServerPort: 8002,
  serverDependenciesToBundle: [
    // react-dnd and its dependencies are bundled as ESM
    "react-dnd",
    "dnd-core",
    "@react-dnd/invariant",
    "@react-dnd/shallowequal",
    "@react-dnd/asap",
    "react-dnd-html5-backend",
  ],
};
