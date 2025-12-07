import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index('./app.tsx'),
  route('about', './routes/about.tsx'),
  route('sign-in', './routes/(auth)/sign-in.tsx'),
  route('sign-up', './routes/(auth)/sign-up.tsx'),
  ] satisfies RouteConfig;