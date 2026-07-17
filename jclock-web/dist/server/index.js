const appRoutes = new Map([
  ["/man/app", "/man-now/"],
  ["/man/now", "/man-now/"],
  ["/man-now", "/man-now/"],
  ["/man-now/", "/man-now/"],
  ["/sun/now", "/man-now/"],
  ["/woman/app", "/woman-now/"],
  ["/woman/now", "/woman-now/"],
  ["/woman-now", "/woman-now/"],
  ["/woman-now/", "/woman-now/"],
  ["/moon/now", "/woman-now/"],
  ["/01-09/now", "/index.html"],
  ["/01-09/now/", "/index.html"],
]);

const localAssets = new Set([
  "/index.html",
  "/man-now.html",
  "/woman-now.html",
  "/man-now/",
  "/woman-now/",
  "/man-now.webmanifest",
  "/woman-now.webmanifest",
  "/css/now-app.css",
  "/js/now-app.js",
]);

const regionNowRoutes = new Map([
  ["01", "/man-now/"],
  ["02", "/man-now/"],
  ["03", "/woman-now/"],
  ["04", "/man-now/"],
  ["05", "/man-now/"],
  ["06", "/man-now/"],
  ["07", "/woman-now/"],
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const regionNowShortcut = url.pathname.match(new RegExp("^/(0[1-9])/now/?$"));
    if (regionNowShortcut) {
      const regionAsset = regionNowRoutes.get(regionNowShortcut[1]);
      if (regionAsset) {
        url.pathname = regionAsset;
        return env.ASSETS.fetch(new Request(url, request));
      }
      url.pathname = "/";
      url.hash = regionNowShortcut[1];
      return Response.redirect(url.toString(), 302);
    }

    const regionShortcut = url.pathname.match(new RegExp("^/(0[1-9])/?$"));
    if (regionShortcut) {
      url.pathname = "/";
      url.hash = regionShortcut[1];
      return Response.redirect(url.toString(), 302);
    }

    url.pathname = appRoutes.get(url.pathname) || (url.pathname === "/" ? "/index.html" : url.pathname);

    if (localAssets.has(url.pathname)) {
      return env.ASSETS.fetch(new Request(url, request));
    }

    const upstream = new URL(url);
    upstream.protocol = "https:";
    upstream.host = "jclock126.web.app";
    return fetch(new Request(upstream, request));
  },
};
