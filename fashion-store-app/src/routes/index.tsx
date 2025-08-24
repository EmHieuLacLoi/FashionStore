import { privateRoutes } from "@routes/PrivateRoutes";
import { publicRoutes } from "@routes/PublicRoutes";
export const routes = [...privateRoutes, ...publicRoutes];
