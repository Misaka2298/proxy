const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (req, res) => {
  let target = null; // 默认不设置，稍后根据路径决定

  // 根据路径设置不同的目标网站
  if (req.url.startsWith("/lastfm")) {
    target = "https://www.last.fm/";
  } else if (req.url.startsWith("/b")) {
    target = "https://example-b.com"; // 替换成你想代理的网站 B 的 URL
  } else if (req.url.startsWith("/c")) { // 可以无限扩展
    target = "https://example-c.com"; // 网站 C
  } else {
    // 默认路径或其他路径，可以代理到首页或报错
    target = "https://your-default-site.com";
  }

  // 如果没有匹配到目标，直接返回 404 或重定向
  if (!target) {
    res.status(404).send("Not Found");
    return;
  }

  // 创建代理中间件
  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true, // 修改 Host 头，让目标服务器以为请求来自它自己
    pathRewrite: {
      // 重写路径：去掉前缀 /a 或 /b，让目标服务器收到干净的路径
      "^/a": "",  // /a/xxx -> /xxx
      "^/b": "",  // /b/xxx -> /xxx
      "^/c": "",  // /c/xxx -> /xxx
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying ${req.url} to ${target}`); // 日志，便于调试
    },
  });

  proxy(req, res, next); // next 是可选的错误处理回调
};
