import { createProxyMiddleware } from "http-proxy-middleware";
console.log(process.env.REACT_APP_URL);

// module.exports = function (app) {
//   app.use(
//     createProxyMiddleware("/", {
//       target: process.env.REACT_APP_URL || "http://localhost:8080",
//       changeOrigin: true,
//     })
//   );
// };
