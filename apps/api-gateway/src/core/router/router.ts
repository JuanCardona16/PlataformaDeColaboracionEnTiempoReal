import { Router } from "express";
import { IDependencyInjection } from "../dependencyInjection/dependencyInjection.js";
import authRouter from "@/features/auth/basic/routes/auth.router.js";
import profileRouter from "@/features/profile/routes/profile.router.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

export default (container: IDependencyInjection): Router => {
  const ApplicationRouter = Router();

  ApplicationRouter.use("/auth", authRouter(container));
  ApplicationRouter.use(
    "/profile",
    authenticateToken(container.tokenService),
    profileRouter(container)
  );

  return ApplicationRouter;
};
