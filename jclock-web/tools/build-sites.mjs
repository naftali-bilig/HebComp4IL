import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const client = resolve(dist, "client");

await rm(dist, { recursive: true, force: true });
await mkdir(resolve(dist, "server"), { recursive: true });
await mkdir(client, { recursive: true });
await mkdir(resolve(client, "css"), { recursive: true });
await mkdir(resolve(client, "js"), { recursive: true });
await mkdir(resolve(client, "man-now"), { recursive: true });
await mkdir(resolve(client, "woman-now"), { recursive: true });
await copyFile(resolve(root, "public", "index.html"), resolve(client, "index.html"));
await copyFile(resolve(root, "public", "man-now.html"), resolve(client, "man-now.html"));
await copyFile(resolve(root, "public", "woman-now.html"), resolve(client, "woman-now.html"));
await copyFile(resolve(root, "public", "man-now.html"), resolve(client, "man-now", "index.html"));
await copyFile(resolve(root, "public", "woman-now.html"), resolve(client, "woman-now", "index.html"));
await copyFile(resolve(root, "public", "man-now.webmanifest"), resolve(client, "man-now.webmanifest"));
await copyFile(resolve(root, "public", "woman-now.webmanifest"), resolve(client, "woman-now.webmanifest"));
await copyFile(resolve(root, "public", "css", "now-app.css"), resolve(client, "css", "now-app.css"));
await copyFile(resolve(root, "public", "js", "now-app.js"), resolve(client, "js", "now-app.js"));

const worker = `const appRoutes = new Map([
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
`;

await writeFile(resolve(dist, "server", "index.js"), worker, "utf8");
console.log("JClock Sites build complete.");
