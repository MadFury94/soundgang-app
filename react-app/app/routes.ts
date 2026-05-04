import type { RouteConfig } from "@react-router/dev/routes";
import { route, layout, index } from "@react-router/dev/routes";

export default [
  layout("layouts/site.tsx", [
    index("routes/home.tsx"),
  ]),
] satisfies RouteConfig;
