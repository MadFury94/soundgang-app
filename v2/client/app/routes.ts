import type { RouteConfig } from "@react-router/dev/routes";
import { route, layout, index } from "@react-router/dev/routes";

export default [
  layout("layouts/site.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("artists", "routes/artists.tsx"),
    route("artists/:slug", "routes/artists.$slug.tsx"),
    route("releases", "routes/releases.tsx"),
    route("blog", "routes/blog.tsx"),
    route("blog/:id", "routes/blog.$id.tsx"),
    route("contact", "routes/contact.tsx"),
    route("submit", "routes/submit.tsx"),
  ]),
] satisfies RouteConfig;
